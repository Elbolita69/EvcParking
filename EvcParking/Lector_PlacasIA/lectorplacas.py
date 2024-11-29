from flask import Flask, render_template, Response, jsonify
import cv2
import requests
import mysql.connector
from datetime import datetime
import os

app = Flask(__name__)

camera_active = False
cap = cv2.VideoCapture(0)

def conectar_bd():
    return mysql.connector.connect(
        host="localhost",        
        user="root",           
        password="",           
        database="datos"        
    )

def leer_placa(img):
    with open(img, 'rb') as fp:
        response = requests.post(
            'https://api.platerecognizer.com/v1/plate-reader/',
            files=dict(upload=fp),
            headers={'Authorization': 'Token 94e38f36dce5e23afbea8d2b194b67a99a326215'}
        )
    return response.json()

def guardar_datos_placa(data):
    if data and 'results' in data and data['results']:

        db = conectar_bd()
        cursor = db.cursor()

        for result in data['results']:
            plate = result['plate']
            confidence = result['score']
            now = datetime.now()
            fecha = now.strftime("%Y-%m-%d")
            hora = now.strftime("%H:%M:%S")

            sql = "INSERT INTO placas_detectadas (fecha, hora, placa, confianza) VALUES (%s, %s, %s, %s)"
            values = (fecha, hora, plate, confidence)

            cursor.execute(sql, values)

        db.commit()
        cursor.close()
        db.close()
        print("Datos guardados en la base de datos.")
    else:
        print("No se detectó ninguna placa.")

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/placas')
def mostrar_placas():
    db = conectar_bd()
    cursor = db.cursor()
    cursor.execute("SELECT fecha, hora, placa, confianza FROM placas_detectadas")
    placas = cursor.fetchall()
    cursor.close()
    db.close()
    return render_template('placas.html', placas=placas)

@app.route('/graficos')
def mostrar_graficos():
    db = conectar_bd()
    cursor = db.cursor()

    cursor.execute("SELECT fecha, COUNT(*) FROM placas_detectadas GROUP BY fecha")
    datos_grafico1 = cursor.fetchall()

    cursor.execute("""
        SELECT 
            CASE 
                WHEN confianza >= 90 THEN '90-100%' 
                WHEN confianza >= 80 THEN '80-89%' 
                WHEN confianza >= 70 THEN '70-79%' 
                ELSE '<70%'
            END as rango_confianza,
            COUNT(*) 
        FROM placas_detectadas 
        GROUP BY rango_confianza
    """)
    datos_grafico2 = cursor.fetchall()

    cursor.execute("SELECT HOUR(hora) as hora_del_dia, COUNT(*) FROM placas_detectadas GROUP BY HOUR(hora)")
    datos_grafico3 = cursor.fetchall()

    cursor.execute("SELECT placa, COUNT(*) as frecuencia FROM placas_detectadas GROUP BY placa ORDER BY frecuencia DESC LIMIT 10")
    datos_grafico4 = cursor.fetchall()

    cursor.close()
    db.close()

    return render_template(
        'graficasplacas.html',
        datos_grafico1=datos_grafico1,
        datos_grafico2=datos_grafico2,
        datos_grafico3=datos_grafico3,
        datos_grafico4=datos_grafico4
    )


@app.route('/leer_placa', methods=['POST'])
def leer_placa_endpoint():
    global camera_active

    if not camera_active:
        camera_active = True  

        ret, frame = cap.read()
        if ret:
            foto = "temp.jpg"
            cv2.imwrite(foto, frame)
            print("Imagen capturada y guardada como temp.jpg")  
            try:
                data = leer_placa(foto) 
                print("Respuesta de la API:", data)  
            except Exception as e:
                print("Error al comunicarse con la API:", e)
                return jsonify(success=False, message="Error al comunicarse con la API")

            if data and 'results' in data and data['results']:
                guardar_datos_placa(data) 
                plate = data['results'][0]['plate']
                camera_active = False  
                return jsonify(success=True, plate=plate) 
            else:
                camera_active = False  
                return jsonify(success=False, message="No se detectó ninguna placa")
        else:
            camera_active = False 
            return jsonify(success=False, message="No se pudo capturar imagen")

    return jsonify(success=False, message="La cámara está desactivada, por favor espere.")

@app.route('/video_feed')
def video_feed():
    def generate():
        while True:
            ret, frame = cap.read()
            if not ret:
                break
            _, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

    return Response(generate(), mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    app.run(debug=True)

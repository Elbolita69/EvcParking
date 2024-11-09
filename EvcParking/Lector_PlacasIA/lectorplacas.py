from flask import Flask, render_template, Response, jsonify
import cv2
import requests
import mysql.connector
from datetime import datetime
import os

app = Flask(__name__)

# Variable global para controlar si la cámara está activa o no
camera_active = False
cap = cv2.VideoCapture(0)  # Mantener la cámara abierta en todo momento

# Función para conectar a la base de datos MySQL
def conectar_bd():
    return mysql.connector.connect(
        host="localhost",        # Dirección del servidor de base de datos
        user="root",             # Tu usuario de la base de datos
        password="",             # Tu contraseña de la base de datos
        database="datos"         # Nombre de la base de datos
    )

# Función para leer placa a través de la API
def leer_placa(img):
    with open(img, 'rb') as fp:
        response = requests.post(
            'https://api.platerecognizer.com/v1/plate-reader/',
            files=dict(upload=fp),
            headers={'Authorization': 'Token 94e38f36dce5e23afbea8d2b194b67a99a326215'}
        )
    return response.json()

# Función para guardar los datos de las placas en la base de datos
def guardar_datos_placa(data):
    if data and 'results' in data and data['results']:
        # Conectar a la base de datos
        db = conectar_bd()
        cursor = db.cursor()

        for result in data['results']:
            plate = result['plate']
            confidence = result['score']
            now = datetime.now()
            fecha = now.strftime("%Y-%m-%d")
            hora = now.strftime("%H:%M:%S")

            # SQL para insertar los datos en la tabla de placas_detectadas
            sql = "INSERT INTO placas_detectadas (fecha, hora, placa, confianza) VALUES (%s, %s, %s, %s)"
            values = (fecha, hora, plate, confidence)

            cursor.execute(sql, values)

        # Confirmar los cambios
        db.commit()
        cursor.close()
        db.close()
        print("Datos guardados en la base de datos.")
    else:
        print("No se detectó ninguna placa.")

# Ruta para la página principal
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


# Ruta para capturar una imagen y leer la placa cuando se presiona el botón
@app.route('/leer_placa', methods=['POST'])
def leer_placa_endpoint():
    global camera_active

    # Si la cámara ya está activa, no hacer nada
    if not camera_active:
        camera_active = True  # Activa la cámara

        ret, frame = cap.read()
        if ret:
            foto = "temp.jpg"
            cv2.imwrite(foto, frame)
            print("Imagen capturada y guardada como temp.jpg")  # Verificación de imagen capturada

            # Intenta enviar la imagen a la API
            try:
                data = leer_placa(foto)  # Llama a la función para leer la placa
                print("Respuesta de la API:", data)  # Verificación de respuesta de la API
            except Exception as e:
                print("Error al comunicarse con la API:", e)
                return jsonify(success=False, message="Error al comunicarse con la API")

            if data and 'results' in data and data['results']:
                guardar_datos_placa(data)  # Guarda la placa en la base de datos
                plate = data['results'][0]['plate']
                camera_active = False  # Desactiva la cámara después de la detección
                return jsonify(success=True, plate=plate)  # Devuelve la placa detectada
            else:
                camera_active = False  # Desactiva la cámara si no se detectó placa
                return jsonify(success=False, message="No se detectó ninguna placa")
        else:
            camera_active = False  # Desactiva la cámara si no se pudo capturar imagen
            return jsonify(success=False, message="No se pudo capturar imagen")

    return jsonify(success=False, message="La cámara está desactivada, por favor espere.")

# Ruta para el video en vivo
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

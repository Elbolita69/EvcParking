from flask import Flask, render_template, Response, jsonify
import cv2
import requests
import csv
import os
from datetime import datetime

app = Flask(__name__)

# Función para leer placa a través de la API
def leer_placa(img):
    regions = ['us', 'mx']  # Ajusta las regiones según sea necesario
    with open(img, 'rb') as fp:
        response = requests.post(
            'https://api.platerecognizer.com/v1/plate-reader/',
            data=dict(regions=regions),
            files=dict(upload=fp),
            headers={'Authorization': 'Token 94e38f36dce5e23afbea8d2b194b67a99a326215'}
        )
    return response.json()

# Función para guardar los datos en un CSV
def guardar_datos_placa(data, csv_file='placas_registradas.csv'):
    if not os.path.exists(csv_file):
        with open(csv_file, mode='w', newline='') as file:
            writer = csv.writer(file)
            writer.writerow(["Fecha", "Hora", "Placa", "Confianza"])

    with open(csv_file, mode='a', newline='') as file:
        writer = csv.writer(file)
        for result in data['results']:
            plate = result['plate']
            confidence = result['score']
            now = datetime.now()
            fecha = now.strftime("%Y-%m-%d")
            hora = now.strftime("%H:%M:%S")
            writer.writerow([fecha, hora, plate, confidence])

# Ruta para la página principal
@app.route('/')
def index():
    return render_template('index.html')

# Ruta para capturar una imagen y leer la placa cuando se presiona el botón
@app.route('/leer_placa', methods=['POST'])
def leer_placa_endpoint():
    cap = cv2.VideoCapture(0)
    ret, frame = cap.read()
    if ret:
        foto = "temp.jpg"
        cv2.imwrite(foto, frame)
        data = leer_placa(foto)  # Llama a la función para leer la placa
        cap.release()

        if data and 'results' in data and data['results']:
            guardar_datos_placa(data)  # Guarda la placa en CSV
            plate = data['results'][0]['plate']
            return jsonify(success=True, plate=plate)  # Devuelve la placa detectada
        else:
            return jsonify(success=False)  # No se detectó ninguna placa
    else:
        cap.release()
        return jsonify(success=False)  # No se pudo capturar imagen

# Ruta para el video en vivo
@app.route('/video_feed')
def video_feed():
    def generate():
        cap = cv2.VideoCapture(0)
        while True:
            ret, frame = cap.read()
            if not ret:
                break
            _, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
        cap.release()
    return Response(generate(), mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    app.run(debug=True)

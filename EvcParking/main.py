import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

# Configuración del servidor SMTP
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
EMAIL = "evcparkingproyecto@gmail.com"  # Cambia esto a tu correo de Gmail
EMAIL_PASSWORD = "jspz mdbw vlbb zkki" # Usa la contraseña de aplicación generada

# Crear la aplicación FastAPI
app = FastAPI()

# Modelo para recibir los datos de la reserva
class Reserva(BaseModel):
    nombre: str
    correo: str
    puesto: str

@app.post("/reservar")
async def enviar_reserva(reserva: Reserva):
    try:
        # Crear el mensaje de correo
        mensaje = MIMEMultipart()
        mensaje["From"] = EMAIL
        mensaje["To"] = reserva.correo
        mensaje["Subject"] = "Confirmación de Reserva - EVC Parking"

        # Contenido del correo
        cuerpo = f"""
        <h1>Hola, {reserva.nombre}</h1>
        <p>Tu reserva en <b>EVC Parking</b> ha sido confirmada.</p>
        <p><b>Puesto Asignado:</b> {reserva.puesto}</p>
        <p>¡Gracias por elegirnos!</p>
        """
        mensaje.attach(MIMEText(cuerpo, "html"))

        # Conectar al servidor SMTP
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()  # Iniciar comunicación cifrada
            server.login(EMAIL, EMAIL_PASSWORD)  # Iniciar sesión
            server.sendmail(EMAIL, reserva.correo, mensaje.as_string())  # Enviar correo

        return {"mensaje": "Correo enviado exitosamente"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al enviar el correo: {str(e)}")

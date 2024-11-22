import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
import json
import os

# Configuración del servidor SMTP
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
EMAIL = "evcparkingproyecto@gmail.com"  # Cambia esto a tu correo de Gmail
EMAIL_PASSWORD = "jspz mdbw vlbb zkki"  # Usa la contraseña de aplicación generada

# Archivo para almacenar los usuarios
USERS_FILE = "usuarios.json"

# Crear la aplicación FastAPI
app = FastAPI()

# Modelo para datos de registro e inicio de sesión
class Usuario(BaseModel):
    nombre: str
    email: str
    usuario: str
    password: str

class LoginData(BaseModel):
    email: str
    password: str

# Modelo para reservas
class Reserva(BaseModel):
    nombre: str
    correo: str
    puesto: str

# Función para cargar usuarios desde el archivo
def cargar_usuarios():
    if os.path.exists(USERS_FILE):
        with open(USERS_FILE, "r") as file:
            return json.load(file)
    return []

# Función para guardar usuarios en el archivo
def guardar_usuarios(usuarios):
    with open(USERS_FILE, "w") as file:
        json.dump(usuarios, file)

# Ruta para registrar usuarios
@app.post("/registro")
async def registro(usuario: Usuario):
    usuarios = cargar_usuarios()
    # Verificar si el correo ya está registrado
    if any(u["email"] == usuario.email for u in usuarios):
        raise HTTPException(status_code=400, detail="Este correo ya está registrado.")
    
    # Agregar el usuario al archivo
    nuevo_usuario = usuario.dict()
    nuevo_usuario["role"] = "regular"  # Asignar rol por defecto
    usuarios.append(nuevo_usuario)
    guardar_usuarios(usuarios)

    # Enviar correo de bienvenida
    try:
        enviar_correo(
            destinatario=usuario.email,
            asunto="Bienvenido a EVC Parking",
            cuerpo=f"""
            <h1>¡Hola, {usuario.nombre}!</h1>
            <p>Gracias por registrarte en <b>EVC Parking</b>.</p>
            <p>Tu usuario: {usuario.usuario}</p>
            <p>¡Esperamos que disfrutes de nuestros servicios!</p>
            """
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Usuario registrado, pero fallo al enviar correo: {str(e)}")

    return {"mensaje": "Usuario registrado exitosamente."}

# Ruta para iniciar sesión
@app.post("/login")
async def login(data: LoginData):
    usuarios = cargar_usuarios()
    # Buscar el usuario por correo y contraseña
    usuario = next((u for u in usuarios if u["email"] == data.email and u["password"] == data.password), None)
    if not usuario:
        raise HTTPException(status_code=401, detail="Correo o contraseña incorrectos.")
    return {"mensaje": "Inicio de sesión exitoso.", "usuario": usuario}

# Ruta para enviar correo de reserva
@app.post("/reservar")
async def enviar_reserva(reserva: Reserva):
    try:
        # Crear el mensaje de correo
        enviar_correo(
            destinatario=reserva.correo,
            asunto="Confirmación de Reserva - EVC Parking",
            cuerpo=f"""
            <h1>Hola, {reserva.nombre}</h1>
            <p>Tu reserva en <b>EVC Parking</b> ha sido confirmada.</p>
            <p><b>Puesto Asignado:</b> {reserva.puesto}</p>
            <p>¡Gracias por elegirnos!</p>
            """
        )
        return {"mensaje": "Correo enviado exitosamente"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al enviar el correo: {str(e)}")

# Función para enviar correos
def enviar_correo(destinatario, asunto, cuerpo):
    mensaje = MIMEMultipart()
    mensaje["From"] = EMAIL
    mensaje["To"] = destinatario
    mensaje["Subject"] = asunto
    mensaje.attach(MIMEText(cuerpo, "html"))

    with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
        server.starttls()  # Iniciar comunicación cifrada
        server.login(EMAIL, EMAIL_PASSWORD)  # Iniciar sesión
        server.sendmail(EMAIL, destinatario, mensaje.as_string())  # Enviar correo

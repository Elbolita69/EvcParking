import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import json
import os
from fastapi.middleware.cors import CORSMiddleware

# Configuración del servidor SMTP
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
EMAIL = "evcparkingproyecto@gmail.com"  # Cambia esto a tu correo de Gmail
EMAIL_PASSWORD = "jspz mdbw vlbb zkki"  # Usa la contraseña de aplicación generada

# Ruta para almacenar el archivo de usuarios
USERS_FILE = r"C:\Users\estudiante\Downloads\EvcParking-main\EvcParking\usuarios.json"  # Asegúrate de que esta ruta sea correcta

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

# Función para cargar los usuarios desde el archivo JSON
def cargar_usuarios():
    if os.path.exists(USERS_FILE):
        with open(USERS_FILE, 'r') as file:
            return json.load(file)
    return []

# Función para guardar usuarios en el archivo JSON
def guardar_usuarios(usuarios):
    try:
        with open(USERS_FILE, 'w') as file:
            json.dump(usuarios, file, indent=4)
        print("Usuarios guardados correctamente")
    except Exception as e:
        print(f"Error al guardar usuarios: {e}")

# Función para enviar correos
def enviar_correo(destinatario, asunto, cuerpo):
    mensaje = MIMEMultipart()
    mensaje["From"] = EMAIL
    mensaje["To"] = destinatario
    mensaje["Subject"] = asunto
    mensaje.attach(MIMEText(cuerpo, "html"))

    with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
        server.starttls()
        server.login(EMAIL, EMAIL_PASSWORD)
        server.sendmail(EMAIL, destinatario, mensaje.as_string())

# Configuración de CORS para permitir solicitudes desde diferentes orígenes
origins = [
    "http://localhost",
    "http://localhost:8000",
    "http://127.0.0.1",
    "http://127.0.0.1:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Permitir solicitudes de estos orígenes
    allow_credentials=True,
    allow_methods=["*"],  # Permitir cualquier método HTTP
    allow_headers=["*"],  # Permitir cualquier encabezado
)

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

    # Guardar los usuarios después de agregar el nuevo
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

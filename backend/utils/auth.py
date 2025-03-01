'''
Pasos
Desarrollo de Funciones de Utilidad para Tokens:
Crear un nuevo archivo de utilidades (ej. utils/auth.py) para encapsular las funciones de manejo de tokens.
Implementar las siguientes funciones en auth.py:
    *   sign_token(payload):  Función para firmar un payload (carga útil) 
    y generar un token. Deberá utilizar un algoritmo de firma seguro y una clave secreta.
    *   decode_token(token): Función para decodificar un token 
    y extraer su payload. Deberá verificar la firma del token.
    *   validate_token(token): Función para validar un token. 
    Deberá verificar la firma, la expiración (si aplica) y otros criterios de validez del token.

'''

import jwt
import os
from datetime import datetime, timedelta
from passlib.context import CryptContext
from fastapi import HTTPException, status

#SECRET and TOKEN
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM= os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def sign_token(payload: dict):
    pass

def decode_token(token:str):
    pass

def validate_token(token:str):
    pass
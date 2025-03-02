from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
#from models.users import UsersSchema

router = APIRouter()
auth_controller = AuthController()

@router.post("/auth/login", tags=["Audio"])
async def login(email:str, password:str):
    return await auth_controller.login(email, password)
# '''

'''
Desarrollo del Controlador de Sesiones:
Crear un nuevo controlador (ej. authController) para exponer el endpoint API relacionado con la gestión de sesiones.
Implementar los siguientes endpoints en el controlador, utilizando las funciones de utilidad de tokens:
    *   POST /auth/login: Endpoint para crear una nueva sesión de usuario (login). Recibe las credenciales del usuario (ej. usuario y contraseña) en el cuerpo de la petición, verifica las credenciales, genera un token utilizando sign_token y devuelve el token en la respuesta.
Definición de Request/Response Models:

Pruebas:
Probar los endpoints API utilizando herramientas como Postman, curl o un cliente HTTP similar.  {access_token: asdasdssdad}
Verificar que el endpoint POST /auth/login crea correctamente sesiones y devuelve tokens válidos al proporcionar credenciales correctas.

Comprobar el funcionamiento de las funciones de utilidad sign_token, decode_token y validate_token de forma aislada y en conjunto con los endpoints.
Asegurar la seguridad de la implementación, incluyendo el manejo seguro de la clave secreta y la protección contra ataques comunes (ej. ataques de fuerza bruta, ataques de replay).
'''
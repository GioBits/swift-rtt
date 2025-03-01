'''
Pasos
Desarrollo de Funciones de Utilidad para Tokens:
Crear un nuevo archivo de utilidades (ej. utils/auth.py) para encapsular las funciones de manejo de tokens.
Implementar las siguientes funciones en auth.py:
    *   sign_token(payload):  Función para firmar un payload (carga útil) y generar un token. Deberá utilizar un algoritmo de firma seguro y una clave secreta.
    *   decode_token(token): Función para decodificar un token y extraer su payload. Deberá verificar la firma del token.
    *   validate_token(token): Función para validar un token. Deberá verificar la firma, la expiración (si aplica) y otros criterios de validez del token.
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

Criterios de Aceptación
Se han creado las funciones de utilidad sign_token, decode_token y validate_token en el archivo utils/token_utils.py.
Se ha creado el controlador AuthController con los endpoints POST /auth/logi
Los endpoints API funcionan correctamente y realizan la gestión de sesiones según lo especificado, incluyendo la creación y validación de tokens.
Las funciones de utilidad de tokens funcionan correctamente y aseguran la integridad y validez de los tokens.
Se han realizado pruebas exhaustivas para verificar el correcto funcionamiento de los servicios y endpoints, incluyendo casos de éxito, manejo de errores y aspectos de seguridad.
'''
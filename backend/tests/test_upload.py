from sqlalchemy.orm import Session
from  api.service.audioService import save_audio
from  db.database import SessionLocal

def upload_audio_to_db(file_path: str):
    """
    Subir un archivo de audio a la base de datos.

    Args:
        file_path (str): Ruta del archivo de audio a subir.
    """
    # Crear una sesión de base de datos
    db: Session = SessionLocal()

    try:
        # Leer el archivo como binario
        with open(file_path, "rb") as f:
            file_content = f.read()

        # Extraer el nombre del archivo y el tipo MIME
        filename = file_path.split("/")[-1]
        content_type = "audio/mp3"  # Ajusta según el tipo del archivo

        # Ajustar el atributo user_id, translation y lenguaje
        user_id= "Juan"
        transcription = "Esta es una prueba"
        language = "Español"
        
        # Llamar a la función para guardar el archivo
        result = save_audio(user_id, file_content, filename, content_type, transcription, language, db)

        # Confirmar que el archivo fue subido
        print(f"Archivo guardado con éxito en la base de datos: {result.filename}")

    except Exception as e:
        print(f"Error al subir el archivo: {str(e)}")

    finally:
        # Cerrar la sesión de base de datos
        db.close()

# Llamar a la función con el archivo deseado
upload_audio_to_db("/home/kelsier/Escritorio/Ing_Software/bug-busters/backend/tests/files/higth_on_life .mp3", "12345")
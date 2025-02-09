from sqlalchemy.exc import IntegrityError
from backend.db.database import SessionLocal
from backend.models.audio import AudioRecord
from backend.models.translated_audios import TranslatedAudio

def test_create_translated_audio():
    session = SessionLocal()  # Create a session instance
    try:
        # Crear un audio original
        original_audio = AudioRecord(
            chat_id="12345",
            user_id="user1",
            filename="test_audio.wav",
            audio_data=b"audio_in_binary_format",
            content_type="audio/wav",
            file_size=1024,
            transcription="Transcripción de prueba",
            language="es"
        )
        session.add(original_audio)
        session.commit()

        # Crear un audio traducido
        translated_audio = TranslatedAudio(
            audio_id= original_audio.id,  # Referencia al audio original            audio_data = Column(LargeBinary)  # Utilizamos LargeBinary para almacenar el archivo de audio
            audio_data=b"audio_translated_in_binary_format",
            file_size = 1024, # Tamaño del archivo en bytes
            language = "en",  # Idioma de la traducción
            transcription ="Test transcription",            
        )

        session.add(translated_audio)
        session.commit()

        # Verificar que el audio traducido se ha insertado correctamente
        translated_audio_from_db = session.query(TranslatedAudio).filter_by(id=translated_audio.id).first()
        assert translated_audio_from_db is not None, "El audio traducido no se insertó correctamente"
        assert translated_audio_from_db.audio_id == original_audio.id, "La relación con el audio original no se estableció correctamente"
        assert translated_audio_from_db.language == "en", "El idioma no se guardó correctamente"
        assert translated_audio_from_db.transcription == "Test transcription", "El texto traducido no se guardó correctamente"
        print("Test passed: El audio traducido se insertó correctamente.")
    except IntegrityError as e:
        session.rollback()
        raise e
    finally:
        session.close()

# Ejecutar el test
if __name__ == "__main__":
    test_create_translated_audio()

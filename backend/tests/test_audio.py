import pytest
from fastapi.testclient import TestClient
from fastapi import FastAPI, UploadFile, File
from sqlalchemy.orm import Session
from api.routes.audioRoute import router as audio_router
from unittest.mock import Mock, patch
import io

# Crear una instancia de la aplicación FastAPI
app = FastAPI()

# Incluir el enrutador de audio en la aplicación
app.include_router(audio_router, prefix="/audio")

# Crear un cliente de prueba para interactuar con la aplicación
client = TestClient(app)

# Mock para la base de datos
mock_db = Mock(Session)

@pytest.fixture
def mock_audio_file():
    """ Fixture para crear un archivo de audio simulado """
    audio_content = io.BytesIO(b"fake audio data")
    audio_file = UploadFile(filename="test.mp3", file=audio_content, content_type="audio/mpeg")
    return audio_file

def test_upload_audio_success(mock_audio_file):
    """ Prueba para subir un archivo de audio exitosamente """
    response = client.post(
        "/audio/audio",
        files={"uploadedAudio": ("test.mp3", mock_audio_file.file, "audio/mpeg")},
        data={"language": "Español"}
    )
    assert response.status_code == 200
    assert "id" in response.json()
    assert "user_id" in response.json()
    assert "filename" in response.json()
    assert "format" in response.json()
    assert "size" in response.json()
    assert "transcription" in response.json()
    assert "language" in response.json()
    assert "file" in response.json()

def test_upload_audio_invalid_format(mock_audio_file):
    """ Prueba para subir un archivo con un formato no válido """
    mock_audio_file.content_type = "text/plain"
    response = client.post(
        "/audio/audio",
        files={"uploadedAudio": ("test.txt", mock_audio_file.file, "text/plain")},
        data={"language": "Español"}
    )
    assert response.status_code == 422
    assert response.json()["detail"] == "Invalid file format"

def test_upload_audio_large_file():
    """ Prueba para subir un archivo demasiado grande """
    large_audio_content = io.BytesIO(b"0" * (10 * 1024 * 1024 + 1))  # 10MB + 1 byte
    large_audio_file = UploadFile(filename="large_test.mp3", file=large_audio_content, content_type="audio/mpeg")
    response = client.post(
        "/audio/audio",
        files={"uploadedAudio": ("large_test.mp3", large_audio_file.file, "audio/mpeg")},
        data={"language": "Español"}
    )
    assert response.status_code == 422
    assert response.json()["detail"] == "File size exceeds 10MB"

def test_upload_audio_long_filename():
    """ Prueba para subir un archivo con un nombre demasiado largo """
    long_filename = "a" * 256 + ".mp3"
    audio_content = io.BytesIO(b"fake audio data")
    long_file = UploadFile(filename=long_filename, file=audio_content, content_type="audio/mpeg")
    response = client.post(
        "/audio/audio",
        files={"uploadedAudio": (long_filename, long_file.file, "audio/mpeg")},
        data={"language": "Español"}
    )
    assert response.status_code == 422
    assert response.json()["detail"] == "File name too long"

def test_upload_audio_long_language():
    """ Prueba para subir un archivo con un nombre de idioma demasiado largo """
    audio_content = io.BytesIO(b"fake audio data")
    audio_file = UploadFile(filename="test.mp3", file=audio_content, content_type="audio/mpeg")
    long_language = "a" * 51
    response = client.post(
        "/audio/audio",
        files={"uploadedAudio": ("test.mp3", audio_file.file, "audio/mpeg")},
        data={"language": long_language}
    )
    assert response.status_code == 422
    assert response.json()["detail"] == "Language name is too long"

def test_retrieve_audio_list():
    """ Prueba para recuperar la lista de archivos de audio """
    response = client.get("/audio/audiolist")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
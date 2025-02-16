import pytest
from unittest.mock import MagicMock
from  api.controller.audioController import process_audio
from  models.audio import AudioRecord
from  utils.upload import create_upload_file

@pytest.fixture
def mock_db():
    # Crear un mock para la sesión de la base de datos
    return MagicMock()

def test_audio_upload(mock_db):
    # Ruta del archivo de prueba
    test_file_path = "/home/kelsier/Escritorio/Ing_Software/bug-busters/backend/tests/files/gkdb.wav"

    # Leer el archivo real como binario
    with open(test_file_path, "rb") as f:
        file_content = f.read()

# Crear un UploadFile real con el contenido del archivo
    real_file = create_upload_file(file_content, 
        filename="gkdb.mp3", content_type="audio/wav")
    
    # Simular que el servicio devuelve un AudioRecord
    mock_audio_record = AudioRecord(
        filename="gkdb.wav",
        audio_data=file_content,
        content_type="audio/wav",
        file_size=len(file_content),
        created_at=None
    )
    mock_db.add.return_value = None
    mock_db.commit.return_value = None
    mock_db.refresh.return_value = mock_audio_record

    # Llamar al controlador
    result = process_audio(file=real_file, db=mock_db)

    # Verificar resultados
    assert result.filename == "gkdb.mp3"
    assert result.content_type == "audio/wav"
    assert result.file_size == len(file_content)

    # Verificar que la función de servicio fue llamada
    mock_db.add.assert_called_once()
    mock_db.commit.assert_called_once()
    mock_db.refresh.assert_called_once()

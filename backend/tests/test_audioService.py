import pytest
from unittest.mock import MagicMock
from api.service.audioService import save_audio
from models.audio import AudioRecord

@pytest.fixture
def mock_db():
    # Crear un mock para la sesión de la base de datos
    return MagicMock()

def test_save_audio(mock_db):
    # Datos de entrada simulados
    file_content = "gkdb.wav"
    filename = "gkdb.wav"
    content_type = "audio/wav"

    # Simular el resultado esperado
    mock_audio_record = AudioRecord(
        id=1,
        filename=filename,
        audio_data=file_content,
        content_type=content_type,
        file_size=len(file_content),
        created_at=None
    )
    mock_db.add.return_value = None
    mock_db.commit.return_value = None
    mock_db.refresh.return_value = mock_audio_record

    # Llamar al servicio
    result = save_audio(file_content, filename, content_type, mock_db)

    # Verificar resultados
    assert result.filename == filename
    assert result.content_type == content_type
    assert result.file_size == len(file_content)

    # Verificar que las funciones de la base de datos se llamaron correctamente
    # Verifica que se llamó a `add` con un objeto que tiene los mismos atributos
    args, _ = mock_db.add.call_args
    saved_audio_record = args[0]  # El primer argumento pasado a `add`
    assert saved_audio_record.filename == filename
    assert saved_audio_record.audio_data == file_content
    assert saved_audio_record.content_type == content_type
    assert saved_audio_record.file_size == len(file_content)

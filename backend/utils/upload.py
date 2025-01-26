from fastapi import UploadFile
from tempfile import SpooledTemporaryFile

class CustomUploadFile(UploadFile):
    def __init__(self, filename: str, file_content: bytes, content_type: str):
        spooled_file = SpooledTemporaryFile()
        spooled_file.write(file_content)
        spooled_file.seek(0)  # Volver al inicio del archivo
        super().__init__(filename=filename, file=spooled_file)
        self._content_type = content_type

    @property
    def content_type(self) -> str:
        return self._content_type
    
def create_upload_file(file_content: bytes, filename: str, content_type: str) -> CustomUploadFile:
    """
    Crear un objeto UploadFile con contenido y tipo MIME.

    Args:
        file_content (bytes): Contenido binario del archivo.
        filename (str): Nombre del archivo.
        content_type (str): Tipo MIME del archivo.

    Returns:
        UploadFile: Objeto UploadFile simulado.
    """
    return CustomUploadFile(filename=filename, file_content=file_content, content_type=content_type)
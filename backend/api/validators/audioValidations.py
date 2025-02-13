from fastapi import HTTPException, UploadFile, File

async def validate_upload(file: UploadFile = File(...)):
    try:
        # Leer los datos binarios del archivo
        file_data = await file.read()

        # Verificar que los datos sean binarios
        if not isinstance(file_data, bytes):
            raise HTTPException(status_code=422, detail="Can't read file")

        # Verifica el nombre no sea más de 255 caracteres de largo
        if len(file.filename) > 255:
            raise HTTPException(status_code=422, detail="File name too long")

        # Verifica que el archivo sea de un formato aceptado por el sistema
        valid_formats = {"audio/mpeg", "audio/mp3"}
        if file.content_type not in valid_formats:
            raise HTTPException(status_code=422, detail="Invalid file format")

        # Verifica que el archivo no sea demasiado pesado (max 10MB)
        max_size = 10 * 1024 * 1024  # 10MB en Bytes
        if len(file_data) > max_size:
            raise HTTPException(status_code=422, detail="File size exceeds 10MB")

        return file_data
    except HTTPException as e:
        raise e
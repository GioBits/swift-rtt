from fastapi import UploadFile, File

async def validate_upload(file: UploadFile = File(...)):
    try:
        # Read the binary data from the file
        file_data = await file.read()

        # Verify that the data is binary
        if not isinstance(file_data, bytes):
            raise ValueError("Can't read file")

        # Check that the filename is not longer than 255 characters
        if len(file.filename) > 255:
            raise ValueError("File name too long")

        # Check that the file is in a format accepted by the system
        valid_formats = {"audio/mpeg", "audio/mp3"}
        if file.content_type not in valid_formats:
            raise ValueError("Invalid file format")

        # Check that the file is not too large (max 10MB)
        max_size = 10 * 1024 * 1024  # 10MB in Bytes
        if len(file_data) > max_size:
            raise ValueError("File size exceeds 10MB")

        return file_data
    except ValueError as e:
        raise e
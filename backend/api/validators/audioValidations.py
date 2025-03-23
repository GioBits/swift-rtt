from fastapi import UploadFile, File
from typing import Tuple, Optional

async def validate_upload(file: UploadFile = File(...)) -> Tuple[bytes, bool, Optional[str]]:
    """
    Validates the uploaded file without raising exceptions.
    
    Args:
        file (UploadFile): The uploaded file to validate.
        
    Returns:
        Tuple[bytes, bool, Optional[str]]: A tuple containing:
            - file_data (bytes): The binary data from the file
            - is_valid (bool): Whether the file is valid
            - error_message (Optional[str]): Error message if the file is invalid, None otherwise
    """
    try:
        # Read the binary data from the file
        file_data = await file.read()

        # Verify that the data is binary
        if not isinstance(file_data, bytes):
            return b"", False, "Can't read file"

        # Check that the filename is not longer than 255 characters
        if len(file.filename) > 255:
            return b"", False, "File name too long"

        # Check that the file is in a format accepted by the system
        valid_formats = {"audio/mpeg", "audio/mp3"}
        if file.content_type not in valid_formats:
            return b"", False, "Invalid file format"

        # Check that the file is not too large (max 10MB)
        max_size = 10 * 1024 * 1024  # 10MB in Bytes
        if len(file_data) > max_size:
            return b"", False, "File size exceeds 10MB"

        # If we've passed all checks, the file is valid
        return file_data, True, None
    except Exception as e:
        # If there's an unexpected error, return it as a message
        return b"", False, f"Unexpected error: {str(e)}"
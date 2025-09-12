import os
import uuid
from supabase import create_client
from fastapi import UploadFile
import io
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

def upload_file(file: UploadFile, folder: str = "events") -> str:
    try:
        # Generate unique filename
        filename = f"{uuid.uuid4()}_{file.filename}"
        path = f"{folder}/{filename}"

        # Read file content
        file_bytes = file.file.read()

        # Upload to Supabase Storage
        response = supabase.storage.from_(folder).upload(path, file_bytes)

        # Check for error attribute
        if hasattr(response, "error") and response.error:
            raise Exception(f"Supabase upload error: {response.error}")

        # Get public URL
        public_url = supabase.storage.from_(folder).get_public_url(path)
        return public_url

    except Exception as e:
        raise Exception(f"Supabase upload failed: {str(e)}")
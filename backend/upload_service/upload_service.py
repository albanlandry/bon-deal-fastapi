from fastapi import APIRouter, File, UploadFile, HTTPException
from PIL import Image
import os
import uuid

router = APIRouter()

# Ensure uploads directory exists
UPLOAD_FOLDER = "uploads/"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def save_image(image_file: UploadFile) -> str:
    """ Saves an uploaded image, optimizes it for mobile, and returns the file path. """
    try:
        # Generate unique filename
        file_extension = image_file.filename.split(".")[-1]
        filename = f"{uuid.uuid4()}.{file_extension}"
        file_path = os.path.join(UPLOAD_FOLDER, filename)

        # Open image and resize for mobile optimization
        img = Image.open(image_file.file)
        img.thumbnail((800, 800))  # Resize to max 800px (for mobile)
        img.save(file_path, optimize=True, quality=75)  # Compress image

        return file_path
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image processing error: {str(e)}")

@router.post("/upload")
def upload_images(files: list[UploadFile] = File(...)):
    """ Allows users to upload multiple images. """
    if not files:
        raise HTTPException(status_code=400, detail="No files uploaded")

    image_paths = [save_image(file) for file in files]
    return {"uploaded_images": image_paths}

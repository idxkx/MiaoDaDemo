# backend/app/api/v1/endpoints/clothes.py
import io
import os
import uuid
from typing import List

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, Request
from sqlalchemy.orm import Session
from PIL import Image # Pillow for potential post-processing
from rembg import remove # The star of the show!

from app import models # models 可以保持这样导入
from app.crud import clothes as crud_clothes # 直接导入 crud 对象
from app.crud import clothes_image as crud_clothes_image # 直接导入 crud 对象
from app.schemas.clothes import Clothes, ClothesCreate, ClothesImage, ClothesImageCreate # 直接导入需要的 Schema 类
from app.api import deps
from app.core.config import settings # Import settings to get storage path

router = APIRouter()

# Define the path for processed images based on settings
#确保 IMAGE_STORAGE_PATH 在 .env 和 config.py 中定义
PROCESSED_IMAGE_STORAGE_PATH = settings.IMAGE_STORAGE_PATH 
os.makedirs(PROCESSED_IMAGE_STORAGE_PATH, exist_ok=True) # Ensure directory exists

# --- Clothes CRUD Endpoints ---
# (We can add CRUD endpoints for Clothes itself later here)

@router.post("/", response_model=Clothes)
def create_clothes(
    *,
    db: Session = Depends(deps.get_db),
    clothes_in: ClothesCreate, # 直接使用 ClothesCreate
    current_user: models.User = Depends(deps.get_active_user)
):
    """
    Create new clothes item owned by the current user.
    """
    # 使用导入的 crud_clothes
    clothes = crud_clothes.create_with_owner(db=db, obj_in=clothes_in, user_id=current_user.id)
    return clothes

@router.get("/{clothes_id}", response_model=Clothes)
def read_clothes(
    *,
    db: Session = Depends(deps.get_db),
    clothes_id: int,
    current_user: models.User = Depends(deps.get_active_user)
):
    """
    Get clothes item by ID.
    """
    # 使用导入的 crud_clothes
    clothes = crud_clothes.get(db=db, id=clothes_id)
    if not clothes:
        raise HTTPException(status_code=404, detail="Clothes not found")
    if clothes.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    # Populate image URLs correctly if needed (implementation depends on crud/model)
    # For now, rely on the schema's orm_mode
    return clothes


# --- Clothes Image Upload Endpoint ---

@router.post("/{clothes_id}/images/", response_model=ClothesImage)
async def upload_clothes_image(
    clothes_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_active_user),
    # request: Request # 如果需要构造完整 URL，可以取消注释
):
    """
    Upload an image for a specific clothes item, remove background, and save it.
    """
    # 1. Verify clothes item exists and belongs to the user
    # 使用导入的 crud_clothes
    db_clothes = crud_clothes.get(db=db, id=clothes_id)
    if not db_clothes:
        raise HTTPException(status_code=404, detail="Clothes not found")
    if db_clothes.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions to add image to this item")

    # 2. Read image contents
    contents = await file.read()
    if not contents:
        raise HTTPException(status_code=400, detail="Empty file uploaded")

    try:
        # 3. Remove background using rembg
        output_bytes = remove(contents)

        # --- Optional: Ensure background is white if needed ---
        # If rembg outputs transparent PNG, and you want white BG:
        # try:
        #     img = Image.open(io.BytesIO(output_bytes)).convert("RGBA")
        #     bg = Image.new("RGB", img.size, (255, 255, 255))
        #     bg.paste(img, (0, 0), img)
        #     output_buffer = io.BytesIO()
        #     bg.save(output_buffer, format='PNG') # Or JPEG if preferred
        #     output_bytes = output_buffer.getvalue()
        #     file_extension = ".png" # Or ".jpg"
        # except Exception as pil_err:
        #     print(f"Pillow processing failed: {pil_err}. Saving original rembg output.")
        #     file_extension = ".png" # Default back to png
        # --- End Optional ---
        # If keeping transparent background from rembg:
        file_extension = ".png"


        # 4. Generate unique filename and save the processed image
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        processed_image_path = os.path.join(PROCESSED_IMAGE_STORAGE_PATH, unique_filename)

        with open(processed_image_path, "wb") as f:
            f.write(output_bytes)

        # 5. Construct the relative image URL path
        relative_image_path = os.path.relpath(processed_image_path, settings.LOCAL_STORAGE_PATH)
        image_url_path = f"/storage/{relative_image_path.replace('\\', '/')}"

        # --- 如果需要完整 URL ---
        # if request:
        #     base_url = str(request.base_url) # e.g., http://127.0.0.1:8000/
        #     # 确保 base_url 以 / 结尾
        #     if not base_url.endswith('/'):
        #         base_url += '/'
        #     # image_url 需要去掉开头的 /
        #     full_image_url = f"{base_url.rstrip('/')}{image_url_path}"
        # else:
        #     full_image_url = image_url_path # Fallback or raise error
        # -----------------------

        # 6. Create ClothesImage record in the database
        is_primary = not db_clothes.images

        # 使用导入的 ClothesImageCreate 和 crud_clothes_image
        # 注意：如果 image_url 类型是 HttpUrl，需要传入 full_image_url
        image_in = ClothesImageCreate(image_url=image_url_path, is_primary=is_primary)
        db_image = crud_clothes_image.create_with_clothes(db=db, obj_in=image_in, clothes_id=clothes_id)

        return db_image

    except Exception as e:
        # Log the error for debugging
        print(f"Error processing or saving image for clothes {clothes_id}: {e}")
        # Consider removing the partially saved file if applicable
        if 'processed_image_path' in locals() and os.path.exists(processed_image_path):
             try:
                 os.remove(processed_image_path)
             except OSError:
                 pass # Ignore error during cleanup
        raise HTTPException(status_code=500, detail=f"Failed to process image background: {str(e)}")
    finally:
        await file.close()

# --- Add other image related endpoints like get_images, delete_image etc. later --- 
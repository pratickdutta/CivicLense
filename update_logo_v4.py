import shutil
from PIL import Image
import os

input_path = r"d:\CivicLense\logo1.png"
public_logo = r"d:\CivicLense\frontend\public\logo_v4.png"
favicon_path = r"d:\CivicLense\frontend\src\app\favicon.ico"

try:
    # Copy the new logo to the public folder
    shutil.copy(input_path, public_logo)
    
    # Generate the favicon
    img = Image.open(input_path).convert("RGBA")
    favicon = img.resize((32, 32))
    favicon.save(favicon_path, format="ICO")
    
    # Clean up old versions if they exist
    old_logo = r"d:\CivicLense\frontend\public\logo_v3.png"
    if os.path.exists(old_logo):
        os.remove(old_logo)
        
    print("Successfully updated logo to logo_v4.png and generated favicon.ico")
except Exception as e:
    print(f"Error processing new logo: {e}")

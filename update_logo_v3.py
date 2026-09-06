import shutil
from PIL import Image
import os

input_path = r"d:\CivicLense\logo.png"
public_logo = r"d:\CivicLense\frontend\public\logo_v3.png"
favicon_path = r"d:\CivicLense\frontend\src\app\favicon.ico"

try:
    # Copy the new logo to the public folder
    shutil.copy(input_path, public_logo)
    
    # Generate the favicon
    img = Image.open(input_path).convert("RGBA")
    favicon = img.resize((32, 32))
    favicon.save(favicon_path, format="ICO")
    
    # Clean up old versions if they exist
    old_logo_1 = r"d:\CivicLense\frontend\public\logo.png"
    old_logo_2 = r"d:\CivicLense\frontend\public\logo_v2.png"
    if os.path.exists(old_logo_1):
        os.remove(old_logo_1)
    if os.path.exists(old_logo_2):
        os.remove(old_logo_2)
        
    print("Successfully updated logo to logo_v3.png and generated favicon.ico")
except Exception as e:
    print(f"Error processing new logo: {e}")

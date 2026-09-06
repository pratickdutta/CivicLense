import shutil
from PIL import Image

input_path = r"d:\CivicLense\logo.png"
public_logo = r"d:\CivicLense\frontend\public\logo.png"
favicon_path = r"d:\CivicLense\frontend\src\app\favicon.ico"

try:
    # Overwrite the public logo with the newly provided logo
    shutil.copy(input_path, public_logo)
    
    # Generate the favicon from this new logo
    img = Image.open(input_path).convert("RGBA")
    
    # Create a new image for the favicon
    favicon = img.resize((32, 32))
    favicon.save(favicon_path, format="ICO")
    
    print("Successfully updated logo.png and favicon.ico with the new logo.")
except Exception as e:
    print(f"Error processing new logo: {e}")

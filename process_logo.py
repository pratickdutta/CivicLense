import os
from PIL import Image

input_path = r"d:\CivicLense\ChatGPT Image Sep 7, 2026, 01_38_17 AM.png"
logo_path = r"d:\CivicLense\frontend\public\logo.png"
favicon_path = r"d:\CivicLense\frontend\src\app\favicon.ico"

try:
    img = Image.open(input_path).convert("RGBA")
    
    # Create a new black background image
    background = Image.new('RGBA', img.size, (0, 0, 0, 255))
    
    # Paste the original image on top, using its alpha channel as a mask
    background.paste(img, (0,0), mask=img)
    
    # Ensure the public directory exists
    os.makedirs(os.path.dirname(logo_path), exist_ok=True)
    
    # Save the logo
    background.save(logo_path, format="PNG")
    
    # Resize and save as favicon
    favicon = background.resize((32, 32))
    favicon.save(favicon_path, format="ICO")
    
    print("Successfully processed the logo and favicon.")
except Exception as e:
    print(f"Error processing image: {e}")

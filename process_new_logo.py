import os
from PIL import Image

input_path = r"d:\CivicLense\logo.png"
public_logo = r"d:\CivicLense\frontend\public\logo.png"
favicon_path = r"d:\CivicLense\frontend\src\app\favicon.ico"

try:
    img = Image.open(input_path).convert("RGBA")
    
    # Create a new black background image
    background = Image.new('RGBA', img.size, (0, 0, 0, 255))
    
    # Paste the original image on top, using its alpha channel as a mask
    background.paste(img, (0,0), mask=img)
    
    # Save the logo
    background.save(public_logo, format="PNG")
    
    # Resize and save as favicon
    favicon = background.resize((32, 32))
    favicon.save(favicon_path, format="ICO")
    
    print("Successfully processed the new logo with a black background.")
except Exception as e:
    print(f"Error processing image: {e}")


import os
import shutil
import glob

source_dir = r"C:\Users\26012211\.gemini\antigravity\brain\aaa1d3a8-bb27-4597-85d8-4d65106ad36f"
dest_root = r"C:\Users\26012211\Documents\GitHub\fashion dressing\assets"

mapping = {
    "dress_floral_png_*.png": "clothing/dress_floral.png",
    "top_blue_png_*.png": "clothing/top_blue.png",
    "jeans_classic_png_*.png": "clothing/jeans_classic.png",
    "necklace_gold_png_*.png": "accessories/necklace_gold.png",
    "sneakers_white_png_*.png": "shoes/sneakers_white.png",
    "nails_red_png_*.png": "nails/nails_red.png",
    "body_fair_png_*.png": "body/body_fair.png",
    "hair_blonde_bob_png_*.png": "hair/hair_blonde_bob.png"
}

for pattern, dest_rel in mapping.items():
    files = glob.glob(os.path.join(source_dir, pattern))
    if files:
        src = files[0]
        dest = os.path.join(dest_root, dest_rel)
        os.makedirs(os.path.dirname(dest), exist_ok=True)
        shutil.copy(src, dest)
        print(f"Copied {src} to {dest}")
    else:
        print(f"No files found for pattern {pattern}")

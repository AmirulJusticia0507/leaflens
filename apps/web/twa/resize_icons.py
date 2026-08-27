from PIL import Image
import os

src = r"C:\laragon\www\leaflens\apps\web\public\icons\icon-512.png"
base = r"C:\laragon\www\leaflens\apps\web\android\app\src\main\res"

sizes = {
    "mipmap-mdpi": 48,
    "mipmap-hdpi": 72,
    "mipmap-xhdpi": 96,
    "mipmap-xxhdpi": 144,
    "mipmap-xxxhdpi": 192,
}

img = Image.open(src).convert("RGBA")

for folder, size in sizes.items():
    out_dir = os.path.join(base, folder)
    os.makedirs(out_dir, exist_ok=True)

    resized = img.resize((size, size), Image.LANCZOS)
    resized.save(os.path.join(out_dir, "ic_launcher.png"), "PNG")
    resized.save(os.path.join(out_dir, "ic_launcher_round.png"), "PNG")

    fg_size = int(size * 108 / 48)
    fg = Image.new("RGBA", (fg_size, fg_size), (0, 0, 0, 0))
    inner_size = int(fg_size * 0.75)
    inner = img.resize((inner_size, inner_size), Image.LANCZOS)
    offset = (fg_size - inner_size) // 2
    fg.paste(inner, (offset, offset), inner)
    fg.save(os.path.join(out_dir, "ic_launcher_foreground.png"), "PNG")
    print(f"{folder}: {size}x{size}")

print("Done!")

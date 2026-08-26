"""Generate ikon PWA LeafLens (dijalankan sekali, hasilnya di-commit).

Jalankan dari apps/api:
    .venv/Scripts/python.exe scripts/generate_pwa_icons.py
"""
from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageDraw

OUT_DIR = Path(__file__).resolve().parents[2] / "web" / "public" / "icons"

EMERALD_TOP = (16, 185, 129)  # #10B981
TEAL_BOTTOM = (13, 148, 136)  # #0D9F86-ish


def rounded_gradient(size: int) -> Image.Image:
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    radius = int(size * 0.22)
    mask = Image.new("L", (size, size), 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, size - 1, size - 1], radius=radius, fill=255)

    gradient = Image.new("RGBA", (size, size))
    top, bottom = EMERALD_TOP, TEAL_BOTTOM
    px = gradient.load()
    for y in range(size):
        t = y / max(1, size - 1)
        r = int(top[0] + (bottom[0] - top[0]) * t)
        g = int(top[1] + (bottom[1] - top[1]) * t)
        b = int(top[2] + (bottom[2] - top[2]) * t)
        for x in range(size):
            px[x, y] = (r, g, b, 255)
    img.paste(gradient, (0, 0), mask)
    return img


def draw_leaf(img: Image.Image) -> None:
    size = img.size[0]
    d = ImageDraw.Draw(img)
    cx, cy = size * 0.5, size * 0.52
    L = size * 0.30  # panjang setengah-daun

    # Bentuk daun: dua kurva bezier kuadratik (kiri & kanan) + ujung runcing.
    tip = (cx, cy - L)
    base = (cx, cy + L * 0.9)
    left_ctrl = (cx - L * 1.35, cy - L * 0.15)
    right_ctrl = (cx + L * 1.35, cy - L * 0.15)
    steps = 120

    def q(p0, c, p1, t):
        x = (1 - t) ** 2 * p0[0] + 2 * (1 - t) * t * c[0] + t**2 * p1[0]
        y = (1 - t) ** 2 * p0[1] + 2 * (1 - t) * t * c[1] + t**2 * p1[1]
        return (x, y)

    left_side = [q(tip, left_ctrl, base, i / steps) for i in range(steps + 1)]
    right_side = [q(base, right_ctrl, tip, i / steps) for i in range(steps + 1)]
    d.polygon(left_side + right_side, fill=(255, 255, 255, 255))

    # Tulang daun tengah.
    mid_top = q(tip, left_ctrl, base, 0.5)
    d.line([tip, base], fill=(16, 185, 129, 255), width=max(2, int(size * 0.02)))

    # Pangkal batang kecil.
    stem_w = max(3, int(size * 0.035))
    d.line(
        [base, (cx, cy + L * 1.25)],
        fill=(255, 255, 255, 255),
        width=stem_w,
    )

    # Titik air/ratna sederhana di sudut (aksen).
    dot_r = size * 0.055
    dx, dy = size * 0.78, size * 0.24
    d.ellipse(
        [dx - dot_r, dy - dot_r, dx + dot_r, dy + dot_r],
        fill=(255, 255, 255, 90),
    )


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for size in (192, 512):
        icon = rounded_gradient(size)
        draw_leaf(icon)
        out = OUT_DIR / f"icon-{size}.png"
        icon.save(out, "PNG")
        print(f"dibuat: {out}")
    maskable = rounded_gradient(512)
    draw_leaf(maskable)
    out = OUT_DIR / "maskable-512.png"
    maskable.save(out, "PNG")
    print(f"dibuat: {out}")


if __name__ == "__main__":
    main()

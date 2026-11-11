#!/usr/bin/env python3
"""
Genera los QR dinamicos de las tarjetas digitales de Xlerion.

Los QR NO apuntan directamente a la tarjeta: apuntan al endpoint de tracking
/api/scan/{founder_id}, que registra el escaneo y responde con un 302 hacia
https://xlerion.com.co/{founder_id}

Salida:
  public/cards/qr-miguel.png     (300x300, #00d4ff sobre #0a0a0f, EC=HIGH)
  public/cards/qr-juliette.png
  public/cards/qr-miguel.svg     (vectorial para imprenta / tarjetas NFC)
  public/cards/qr-juliette.svg
  public/cards/nfc-miguel.txt    (payload para programar la NTAG215)
  public/cards/nfc-juliette.txt

Uso:  python scripts/generate_qr.py [--base https://xlerion.com.co]
"""

import argparse
import os
import sys

import qrcode
from qrcode.constants import ERROR_CORRECT_H

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(ROOT, "public", "cards")

FOUNDERS = {
    "miguel": {"slug": "mike", "name": "Miguel E. Rodríguez"},
    "juliette": {"slug": "juliette", "name": "Juliette González"},
}

FG = "#00d4ff"
BG = "#0a0a0f"


def build_qr(target: str, size: int = 300) -> qrcode.QRCode:
    """QR con error correction HIGH ajustado a `size` px exactos.

    El box_size se calcula para que modules_count * box_size <= size y el
    sobrante se rellena con el color de fondo. Así los módulos quedan
    perfectamente nítidos (padding, no reescalado) y el QR mide 300x300.
    """
    qr = qrcode.QRCode(
        version=None,
        error_correction=ERROR_CORRECT_H,
        box_size=10,
        border=2,
    )
    qr.add_data(target)
    qr.make(fit=True)

    modules = qr.modules_count
    qr.box_size = max(1, size // modules)
    return qr


def pad_to(img, size: int, bg: str):
    """Rellena con el color de fondo hasta la medida exacta."""
    from PIL import Image

    if img.size == (size, size):
        return img
    # El factory de qrcode entrega imagenes en modo "1" (bilevel); paste con
    # region implicita no funciona en ese modo, hay que pasar la caja.
    canvas = Image.new("RGB", (size, size), bg)
    canvas.paste(img.convert("RGB"), ((size - img.size[0]) // 2, (size - img.size[1]) // 2))
    return canvas


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--base", default="https://xlerion.com.co")
    args = parser.parse_args()
    base = args.base.rstrip("/")

    os.makedirs(OUT_DIR, exist_ok=True)

    for key, meta in FOUNDERS.items():
        track_url = f"{base}/api/scan/{key}"
        card_url = f"{base}/{meta['slug']}"

        qr = build_qr(track_url)

        # PNG 300x300 exactos
        img = pad_to(qr.make_image(fill_color=FG, back_color=BG), 300, BG)
        png_path = os.path.join(OUT_DIR, f"qr-{key}.png")
        img.save(png_path)
        print(f"PNG  {os.path.relpath(png_path, ROOT)}  {img.size[0]}x{img.size[1]}  -> {track_url}")

        # SVG vectorial (ideal para imprenta y para las tarjetas fisicas)
        svg_path = os.path.join(OUT_DIR, f"qr-{key}.svg")
        with open(svg_path, "w", encoding="utf-8") as fh:
            qr.make_image(fill_color=FG, back_color=BG).save(svg_path)
        print(f"SVG  {os.path.relpath(svg_path, ROOT)}  -> {track_url}")

        # Payload NFC: misma URL que el QR para unificar el tracking
        nfc_path = os.path.join(OUT_DIR, f"nfc-{key}.txt")
        with open(nfc_path, "w", encoding="utf-8") as fh:
            fh.write(track_url + "\n")
        print(f"NFC  {os.path.relpath(nfc_path, ROOT)}  -> {track_url}")
        print(f"     tarjeta publica: {card_url}\n")

    return 0


if __name__ == "__main__":
    sys.exit(main())

#!/usr/bin/env python3
"""
Script para recortar espacios vacíos en los bordes de imágenes PNG
en la carpeta img bot.
"""

from PIL import Image
import os

def recortar_imagen(ruta_imagen):
    """Recorta los espacios transparentes de una imagen."""
    try:
        img = Image.open(ruta_imagen)
        
        # Convertir a RGBA si no lo está
        if img.mode != 'RGBA':
            img = img.convert('RGBA')
        
        # Obtener el bounding box del contenido no transparente
        bbox = img.getbbox()
        
        if bbox:
            # Recortar la imagen
            img_recortada = img.crop(bbox)
            
            # Guardar la imagen recortada
            img_recortada.save(ruta_imagen)
            print(f"✓ Recortado: {os.path.basename(ruta_imagen)}")
            print(f"  Original: {img.size} → Recortado: {img_recortada.size}")
            return True
        else:
            print(f"✗ No se pudo recortar (imagen vacía): {os.path.basename(ruta_imagen)}")
            return False
            
    except Exception as e:
        print(f"✗ Error procesando {os.path.basename(ruta_imagen)}: {e}")
        return False

def main():
    # Ruta de la carpeta img bot
    carpeta = os.path.join(os.path.dirname(__file__), 'img bot')
    
    if not os.path.exists(carpeta):
        print(f"Error: No existe la carpeta '{carpeta}'")
        return
    
    # Buscar todas las imágenes PNG
    imagenes = [f for f in os.listdir(carpeta) if f.lower().endswith('.png')]
    
    if not imagenes:
        print("No se encontraron imágenes PNG en la carpeta img bot")
        return
    
    print(f"Encontradas {len(imagenes)} imágenes PNG")
    print("=" * 50)
    
    # Procesar cada imagen
    recortadas = 0
    for nombre in imagenes:
        ruta = os.path.join(carpeta, nombre)
        if recortar_imagen(ruta):
            recortadas += 1
    
    print("=" * 50)
    print(f"Total recortadas: {recortadas}/{len(imagenes)}")

if __name__ == '__main__':
    main()

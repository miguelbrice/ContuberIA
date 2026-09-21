import struct
import zlib
import os

def create_png(width, height, draw_func):
    raw_data = bytearray()
    for y in range(height):
        raw_data.append(0) # filter byte 0 (None)
        for x in range(width):
            r, g, b, a = draw_func(x, y, width, height)
            raw_data.extend([r, g, b, a])
    
    compressed = zlib.compress(bytes(raw_data), 9)
    
    def chunk(chunk_type, data):
        c = chunk_type + data
        crc = zlib.crc32(c) & 0xffffffff
        return struct.pack('>I', len(data)) + c + struct.pack('>I', crc)
    
    png = bytearray(b'\x89PNG\r\n\x1a\n')
    ihdr = struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0)
    png.extend(chunk(b'IHDR', ihdr))
    png.extend(chunk(b'IDAT', compressed))
    png.extend(chunk(b'IEND', b''))
    return bytes(png)

def draw_contuber(x, y, w, h):
    # Normalized coordinates -1 to 1
    nx = (x / (w - 1)) * 2 - 1
    ny = (y / (h - 1)) * 2 - 1
    
    # Rounded rectangle background
    # Corner radius approx 0.25
    r_corner = 0.25
    dx = max(0, abs(nx) - (1.0 - r_corner))
    dy = max(0, abs(ny) - (1.0 - r_corner))
    dist_corner = (dx*dx + dy*dy) ** 0.5
    
    if dist_corner > r_corner:
        return (0, 0, 0, 0) # transparent outside
    
    # Border check (neon lime glow)
    is_border = dist_corner > (r_corner - 0.08) or (abs(nx) > 0.92 and abs(ny) < 1.0 - r_corner) or (abs(ny) > 0.92 and abs(nx) < 1.0 - r_corner)
    
    # Background color: #09090B (deep obsidian)
    bg_r, bg_g, bg_b, bg_a = 9, 9, 11, 255
    if is_border:
        return (203, 255, 0, 255) # #CBFF00 neon border
        
    # Draw Contuber "C" logo shape
    # Center is at (-0.05, 0)
    cx = nx + 0.05
    cy = ny
    dist_center = (cx*cx + cy*cy) ** 0.5
    
    # Top-right notification / partnership beacon
    if ((nx - 0.6)**2 + (ny + 0.6)**2)**0.5 < 0.16:
        return (203, 255, 0, 255) # Lime badge
        
    # "C" ring shape: outer radius 0.65, inner radius 0.35, cut out on right between -35 deg and 35 deg
    import math
    angle = math.atan2(cy, cx) # -pi to pi
    
    is_c_ring = (0.33 <= dist_center <= 0.67) and not (-0.55 < angle < 0.55 and cx > 0)
    
    # Diamond star in aperture (center-right)
    # star centered around (0.15, 0)
    sx = abs(nx - 0.15)
    sy = abs(ny)
    if sx + sy < 0.22:
        return (255, 255, 255, 255) # white sparkle
    if ((nx - 0.15)**2 + ny**2)**0.5 < 0.06:
        return (203, 255, 0, 255) # lime center
        
    if is_c_ring:
        # Gradient lime to cyan (#CBFF00 to #00FFA3)
        t = (nx + 1.0) / 2.0
        gr_r = int(203 * (1 - t * 0.8))
        gr_g = 255
        gr_b = int(163 * t)
        return (gr_r, gr_g, gr_b, 255)
        
    # Subtle inner dark background
    return (bg_r, bg_g, bg_b, bg_a)

os.makedirs('public', exist_ok=True)

png64 = create_png(64, 64, draw_contuber)
png32 = create_png(32, 32, draw_contuber)
png180 = create_png(180, 180, draw_contuber)
png192 = create_png(192, 192, draw_contuber)

with open('public/apple-touch-icon.png', 'wb') as f:
    f.write(png180)

with open('public/icon-192.png', 'wb') as f:
    f.write(png192)

# Create ICO file containing 32x32 and 64x64 PNGs
def make_ico(images):
    # images is list of (width, height, png_bytes)
    num_images = len(images)
    header = struct.pack('<HHH', 0, 1, num_images)
    
    offset = 6 + 16 * num_images
    entries = bytearray()
    body = bytearray()
    
    for w, h, data in images:
        size = len(data)
        entries.extend(struct.pack('BBBBHHII', w if w < 256 else 0, h if h < 256 else 0, 0, 0, 1, 32, size, offset))
        body.extend(data)
        offset += size
        
    return header + bytes(entries) + bytes(body)

ico_data = make_ico([(32, 32, png32), (64, 64, png64)])
with open('public/favicon.ico', 'wb') as f:
    f.write(ico_data)

print("Icons generated successfully!")

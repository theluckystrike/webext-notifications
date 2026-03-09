#!/usr/bin/env python3
from PIL import Image, ImageDraw, ImageFont
import os

# Image dimensions
WIDTH = 1280
HEIGHT = 640

# Colors
DARK_BG = (18, 18, 24)  # Dark background
GREEN_ACCENT = (34, 197, 94)  # Green accent (#22c55e)
WHITE = (255, 255, 255)
LIGHT_GRAY = (156, 163, 175)

# Create image
img = Image.new('RGB', (WIDTH, HEIGHT), DARK_BG)
draw = ImageDraw.Draw(img)

# Draw subtle gradient background (simplified as horizontal bands)
for i in range(0, HEIGHT, 20):
    alpha = int(255 * (1 - i / HEIGHT) * 0.1)
    draw.rectangle([0, i, WIDTH, i + 20], fill=(30, 30, 40))

# Draw decorative circles
draw.ellipse([900, 100, 1200, 400], fill=(34, 197, 94, 30))
draw.ellipse([1000, 200, 1100, 300], fill=(34, 197, 94, 20))

# Draw notification bell icon (simplified geometric representation)
bell_x, bell_y = 280, 280
# Bell body
draw.ellipse([bell_x - 40, bell_y - 60, bell_x + 40, bell_y + 40], outline=GREEN_ACCENT, width=4)
# Bell top
draw.arc([bell_x - 20, bell_y - 80, bell_x + 20, bell_y - 40], 0, 180, GREEN_ACCENT, width=4)
# Bell clapper
draw.arc([bell_x - 15, bell_y + 30, bell_x + 15, bell_y + 50], 0, 180, GREEN_ACCENT, width=3)

# Draw notification dot (unread indicator)
draw.ellipse([bell_x + 30, bell_y - 50, bell_x + 50, bell_y - 30], fill=GREEN_ACCENT)

# Draw main title text
try:
    # Try to use a nice font if available
    title_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 72)
    subtitle_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 28)
    small_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 20)
except:
    # Fallback to default
    title_font = ImageFont.load_default()
    subtitle_font = ImageFont.load_default()
    small_font = ImageFont.load_default()

# Main title - "webext-notifications"
title = "webext-notifications"
title_bbox = draw.textbbox((0, 0), title, font=title_font)
title_width = title_bbox[2] - title_bbox[0]
draw.text(((WIDTH - title_width) / 2, 400), title, fill=WHITE, font=title_font)

# Subtitle - "Typed notification wrapper for Chrome extensions"
subtitle = "Typed notification wrapper for Chrome extensions"
subtitle_bbox = draw.textbbox((0, 0), subtitle, font=subtitle_font)
subtitle_width = subtitle_bbox[2] - subtitle_bbox[0]
draw.text(((WIDTH - subtitle_width) / 2, 485), subtitle, fill=LIGHT_GRAY, font=subtitle_font)

# Add Zovo branding at bottom
zovo_text = "Part of @zovo/webext"
zovo_bbox = draw.textbbox((0, 0), zovo_text, font=small_font)
zovo_width = zovo_bbox[2] - zovo_bbox[0]
draw.text(((WIDTH - zovo_width) / 2, 550), zovo_text, fill=GREEN_ACCENT, font=small_font)

# Add decorative line under title
line_y = 390
line_start = (WIDTH - title_width) / 2 - 30
line_end = (WIDTH + title_width) / 2 + 30
draw.line([line_start, line_y, line_end, line_y], fill=GREEN_ACCENT, width=3)

# Save image
output_path = "/Users/mike/zovo-workspaces/a20/webext-notifications/social-preview.png"
img.save(output_path, "PNG")
print(f"Social preview saved to: {output_path}")

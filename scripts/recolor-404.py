"""Recolor Edgar's 404 robot to the Serverlys brand and split out the blinking digits.

Outputs (into the Next.js public/404/):
  robot-404.png       recolored art, pixel "404" erased from the screen
  robot-404-eyes.png  the "404" alone, logo green on transparent, cropped
Prints the eyes' box (as % of the art) and the new background stops.
"""
import colorsys
import sys

import numpy as np
from PIL import Image

SRC, OUT = sys.argv[1], sys.argv[2]
im = np.asarray(Image.open(SRC).convert("RGB")).astype(np.float64)
H, W, _ = im.shape

def hex_rgb(h):
    return np.array([int(h[i : i + 2], 16) for i in (1, 3, 5)], dtype=np.float64)

NEW_TOP, NEW_BOT = hex_rgb("#f0f5ff"), hex_rgb("#c2d5ff")  # brand-50 -> brand-200
BRAND_HUE = 226 / 360  # brand-500 #1f55ff
GREEN_HUE = 142 / 360  # the logo's green

# --- background: the left edge column is background top to bottom -------------------
bgrow = im[:, 2, :].copy()  # original background colour per row
top, bot = bgrow[0], bgrow[-1]
seg = bot - top
t_row = np.clip(((bgrow - top) @ seg) / (seg @ seg), 0, 1)  # position along the old ramp
newrow = NEW_TOP[None, :] + (NEW_BOT - NEW_TOP)[None, :] * t_row[:, None]

diff = np.linalg.norm(im - bgrow[:, None, :], axis=2)
cand = diff < 10
# flood fill from the borders so background-coloured pixels inside the art stay art
mask = np.zeros((H, W), bool)
stack = [(y, x) for y in range(H) for x in (0, W - 1) if cand[y, x]] + [(0, x) for x in range(W) if cand[0, x]]
while stack:
    y, x = stack.pop()
    if mask[y, x] or not cand[y, x]:
        continue
    mask[y, x] = True
    for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
        ny, nx = y + dy, x + dx
        if 0 <= ny < H and 0 <= nx < W and not mask[ny, nx] and cand[ny, nx]:
            stack.append((ny, nx))

out = im.copy()
out[mask] = np.broadcast_to(newrow[:, None, :], im.shape)[mask]

# anti-aliased edges against the black outline: pixel ~= k * background
near = np.zeros((H, W), bool)
for dy in range(-3, 4):
    for dx in range(-3, 4):
        near |= np.roll(np.roll(mask, dy, 0), dx, 1)
edge = near & ~mask
ys, xs = np.nonzero(edge)
for y, x in zip(ys, xs):
    b, p = bgrow[y], im[y, x]
    k = float(p @ b) / float(b @ b)
    if 0 <= k <= 1.02 and np.linalg.norm(p - k * b) < 14:
        out[y, x] = np.clip(k, 0, 1) * newrow[y]
        mask[y, x] = True  # handled

# --- the robot: warm tones -> brand blue, the screen-pixel yellow -> logo green -----
hsv = np.zeros_like(im)
flat = im.reshape(-1, 3) / 255.0
hsv_flat = np.array([colorsys.rgb_to_hsv(*c) for c in flat])
hsv = hsv_flat.reshape(H, W, 3)
h, s, v = hsv[..., 0], hsv[..., 1], hsv[..., 2]
art = ~mask
warm = art & (s > 0.15) & (((h >= 0.04) & (h <= 0.145)) | ((h > 0.145) & (h <= 0.19) & (s <= 0.45)))
pix = art & (h > 0.145) & (h <= 0.19) & (s > 0.45)

def apply(sel, hue):
    ys, xs = np.nonzero(sel)
    for y, x in zip(ys, xs):
        r, g, b = colorsys.hsv_to_rgb(hue, s[y, x], v[y, x])
        out[y, x] = (r * 255, g * 255, b * 255)

apply(warm, BRAND_HUE)
apply(pix, GREEN_HUE)

# --- split out the pixel "404" -----------------------------------------------------
X0, X1, Y0, Y1 = 300, 650, 230, 400  # inside the screen
screen = np.zeros((H, W), bool)
screen[Y0:Y1, X0:X1] = True
dig = screen & pix
dy, dx = np.nonzero(dig)
bx0, bx1, by0, by1 = dx.min() - 3, dx.max() + 4, dy.min() - 3, dy.max() + 4

eyes = np.zeros((by1 - by0, bx1 - bx0, 4), np.float64)
green = np.array(colorsys.hsv_to_rgb(GREEN_HUE, 0.68, 0.92)) * 255
for y in range(by0, by1):
    scr = out[y, bx0 - 12].copy()  # this row's screen colour (the screen ramps by row only)
    for x in range(bx0, bx1):
        p = out[y, x].copy()
        d = float(np.linalg.norm(p - scr))
        if d > 4:
            # digits AND their black outlines move to the blinking layer
            eyes[y - by0, x - bx0] = (*p, min(1.0, d / 18.0) * 255)
        out[y, x] = scr  # the screen underneath is left clean

Image.fromarray(np.clip(out, 0, 255).astype(np.uint8)).save(f"{OUT}/robot-404.png", optimize=True)
Image.fromarray(np.clip(eyes, 0, 255).astype(np.uint8), "RGBA").save(f"{OUT}/robot-404-eyes.png", optimize=True)

print("eyes box %:", round(bx0 / W * 100, 3), round(by0 / H * 100, 3), round((bx1 - bx0) / W * 100, 3), round((by1 - by0) / H * 100, 3))
print("eyes px:", bx0, by0, bx1 - bx0, by1 - by0, "green", "#%02x%02x%02x" % tuple(int(c) for c in green))
for pct in (0, 25, 38, 50, 63, 75, 88, 100):
    y = min(int(round(pct / 100 * (H - 1))), H - 1)
    print("stop", pct, "#%02x%02x%02x" % tuple(int(round(c)) for c in newrow[y]))

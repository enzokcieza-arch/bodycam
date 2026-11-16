# Estadísticas de imagen para calibrar el grading contra las referencias: percentiles de luma, saturación media, viñeta.
import sys
from PIL import Image
import numpy as np
for f in sys.argv[1:]:
    im = np.asarray(Image.open(f).convert('RGB')).astype(np.float32) / 255
    h, w, _ = im.shape
    # recorta barras negras (letterbox)
    rows = np.where(im.mean(axis=(1, 2)) > 0.02)[0]; im = im[rows.min():rows.max() + 1]
    h = im.shape[0]
    l = im @ np.array([0.2126, 0.7152, 0.0722], dtype=np.float32)
    mx, mn = im.max(2), im.min(2); sat = np.where(mx > 0.05, (mx - mn) / np.maximum(mx, 1e-3), 0)
    c = l[h // 4:3 * h // 4, w // 4:3 * w // 4]
    edge = np.concatenate([l[:, :w // 10].ravel(), l[:, -w // 10:].ravel()])
    p = np.percentile(l, [2, 10, 25, 50, 75, 90, 98])
    print(f"{f.split('/')[-1][:24]:24s} p2 {p[0]:.2f} p10 {p[1]:.2f} p25 {p[2]:.2f} p50 {p[3]:.2f} p75 {p[4]:.2f} p90 {p[5]:.2f} p98 {p[6]:.2f} | <0.08: {100*(l<0.08).mean():4.0f}% | sat {sat.mean():.2f} | borde/centro {edge.mean()/max(c.mean(),1e-3):.2f}")

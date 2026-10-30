"""SPL Season 3 documentary teaser renderer.

usage: python3 render.py wide|vertical out.mp4 [audio.wav] [--stills t1,t2,...]
"""
import sys, os, math, subprocess
import numpy as np
from multiprocessing import Pool
from PIL import Image, ImageDraw, ImageFont, ImageFilter

HOME = os.path.expanduser('~/s3')
PH = HOME + '/v1ph'
FONTS = HOME + '/fonts'
BRAND = HOME + '/brand'
FPS = 30
DUR = 45.0

# ---------------------------------------------------------------- timeline
# Each shot: image, start, dur, grade, zoom (start,end), focus (fx,fy), glitch-in, texts
# Text: (kind, text, t0, t1, slot)   kind: serif | label | line | kicker
SHOTS = [
    dict(img=None, s=0.0, d=3.0, texts=[('label', 'SAMSARA GROUP PRESENTS', 0.7, 2.7, 'mid')]),
    dict(img='ground/ground_1467', s=3.0, d=4.0, grade='night', zoom=(1.22, 1.02), focus=(0.5, 0.5),
         fadein=1.0, texts=[('serif', '2 seasons', 0.6, 3.9, 'low'),
                            ('label', 'SEASONS 1 & 2 COMPLETED', 1.2, 3.9, 'under')]),
    dict(img='action/action_1023', s=7.0, d=3.5, grade='red', zoom=(1.0, 1.12), focus=(0.45, 0.42),
         gin=True, texts=[('serif', '12 clubs', 0.3, 3.5, 'top'), ('label', 'ONE LEAGUE', 0.9, 3.5, 'undertop')]),
    dict(img='action/action_1120', s=10.5, d=0.7, grade='teal', zoom=(1.05, 1.15), focus=(0.6, 0.45), gin=True, hit=True),
    dict(img='action/action_1301', s=11.2, d=0.7, grade='red', zoom=(1.05, 1.15), focus=(0.42, 0.5), gin=True, hit=True),
    dict(img='action/action_1043', s=11.9, d=0.7, grade='teal', zoom=(1.05, 1.15), focus=(0.45, 0.55), gin=True, hit=True),
    dict(img='action/action_1140', s=12.6, d=0.7, grade='red', zoom=(1.05, 1.18), focus=(0.5, 0.5), gin=True, hit=True),
    dict(img='celebration/celebration_1237', s=13.3, d=3.7, grade='teal', zoom=(1.12, 1.0), focus=(0.5, 0.4),
         gin=True, texts=[('line', 'Every Saturday. The same pride.', 0.5, 3.6, 'low')]),
    dict(img='trophy/trophy_1188', s=17.0, d=4.0, grade='warm', zoom=(1.0, 1.14), focus=(0.5, 0.42),
         gin=True, texts=[('serif', '1 trophy', 0.5, 4.0, 'low'), ('label', 'TWELVE CLUBS WANT IT', 1.3, 4.0, 'under')]),
    dict(img='team-photo/team-photo_1452', s=21.0, d=3.5, grade='cold', zoom=(1.18, 1.05), focus=(0.5, 0.55),
         gin=True, texts=[('serif', '12th', 0.3, 3.5, 'top'), ('label', 'THURSDAY 12 NOVEMBER', 0.9, 3.5, 'undertop'),
                            ('label', 'SEASON 3 SQUAD LISTS CLOSE', 1.3, 3.5, 'undertop2')]),
    dict(img='action/action_1336', s=24.5, d=3.5, grade='teal', zoom=(1.0, 1.12), focus=(0.38, 0.45),
         gin=True, texts=[('line', 'The table resets to zero.', 0.5, 3.4, 'low')]),
    dict(img='champions-dusk/champions-dusk_1243', s=28.0, d=3.5, grade='red', zoom=(1.12, 1.0), focus=(0.42, 0.4),
         gin=True, texts=[('line', 'So who takes it this time?', 0.6, 3.5, 'low')]),
    # strobe
    dict(img='action/action_1155', s=31.5, d=0.25, grade='teal', zoom=(1.1, 1.15), focus=(0.5, 0.5), gin=True, strobe=True),
    dict(img='action/action_1311', s=31.75, d=0.25, grade='red', zoom=(1.1, 1.15), focus=(0.5, 0.45), gin=True, strobe=True),
    dict(img='action/action_1061', s=32.0, d=0.25, grade='teal', zoom=(1.1, 1.15), focus=(0.55, 0.5), gin=True, strobe=True),
    dict(img='celebration/celebration_1156', s=32.25, d=0.25, grade='red', zoom=(1.1, 1.15), focus=(0.5, 0.4), gin=True, strobe=True),
    dict(img='action/action_1146', s=32.5, d=0.25, grade='teal', zoom=(1.1, 1.15), focus=(0.5, 0.5), gin=True, strobe=True),
    dict(img='action/action_1125', s=32.75, d=0.25, grade='red', zoom=(1.1, 1.15), focus=(0.5, 0.5), gin=True, strobe=True),
    dict(img='ground/ground_1442', s=33.0, d=3.5, grade='night', zoom=(1.0, 1.1), focus=(0.5, 0.5), dim=0.55,
         gin=True, texts=[('serif', '14th', 0.25, 3.5, 'mid'), ('label', 'SATURDAY 14 NOVEMBER 2026', 0.9, 3.5, 'undermid'),
                            ('label', 'SEASON 3 KICKS OFF', 1.3, 3.5, 'undermid2')]),
    dict(img=None, s=36.5, d=0.8),
    dict(img='ground/ground_1467', s=37.3, d=7.7, grade='night', zoom=(1.0, 1.08), focus=(0.5, 0.5), dim=0.28,
         gin=True, endcard=True),
]
CROPS = {'ground/ground_1467': 0.80, 'ground/ground_1442': 0.82}
IMPACTS = [3.0, 7.0, 13.3, 17.0, 21.0, 24.5, 28.0, 33.0, 37.3]


def ease(t):
    t = min(max(t, 0.0), 1.0)
    return t * t * (3 - 2 * t)


# ---------------------------------------------------------------- grading
GRADES = {
    #       sat,  shadow tint,          highlight tint,      exposure, contrast
    'teal':  (0.55, (0.00, 0.30, 0.36), (1.00, 0.86, 0.72), 0.82, 1.25),
    'red':   (0.05, (0.06, 0.00, 0.01), (1.00, 0.16, 0.13), 0.80, 1.55),
    'warm':  (0.60, (0.06, 0.03, 0.00), (1.00, 0.74, 0.46), 0.70, 1.40),
    'cold':  (0.35, (0.00, 0.10, 0.18), (0.78, 0.90, 1.00), 0.70, 1.30),
    'night': (0.40, (0.00, 0.12, 0.16), (0.60, 0.88, 0.95), 0.62, 1.30),
}


def grade(img, name, dim=1.0):
    a = np.asarray(img.convert('RGB'), dtype=np.float32) / 255.0
    sat, sh, hi, exp, con = GRADES[name]
    lum = a @ np.array([0.299, 0.587, 0.114], np.float32)
    a = lum[..., None] + (a - lum[..., None]) * sat
    # split tone: blend shadow tint into darks, highlight tint into brights
    l = lum[..., None]
    sh = np.array(sh, np.float32); hi = np.array(hi, np.float32)
    tint = (sh * (1 - l) + hi * l) * l * 1.5
    a = a * 0.45 + tint * 0.55
    a = np.clip(a, 0, 1)
    # contrast s-curve around 0.45, then exposure
    a = np.clip((a - 0.45) * con + 0.45, 0, 1)
    a = a * exp * dim
    # crush blacks slightly, lift with tint
    a = np.clip(a - 0.03, 0, 1) + sh * 0.12
    return Image.fromarray((np.clip(a, 0, 1) * 255).astype(np.uint8))


# ---------------------------------------------------------------- text
def font(name, size):
    return ImageFont.truetype(f'{FONTS}/{name}', int(size))


def text_mask(text, f, tracking=0, shear=0.0):
    asc, desc = f.getmetrics()
    widths = [f.getlength(c) for c in text]
    w = int(sum(widths) + tracking * (len(text) - 1)) + 8
    h = asc + desc + 8
    pad = int(h * abs(shear)) + 4
    im = Image.new('L', (w + pad * 2, h), 0)
    d = ImageDraw.Draw(im)
    x = pad
    for c, cw in zip(text, widths):
        d.text((x, 4), c, font=f, fill=255)
        x += cw + tracking
    if shear:
        im = im.transform(im.size, Image.AFFINE, (1, shear, -shear * h * 0.75, 0, 1, 0), resample=Image.BICUBIC)
    im = im.crop(im.getbbox())
    return np.asarray(im, dtype=np.float32) / 255.0


class Layout:
    def __init__(self, mode):
        self.mode = mode
        if mode == 'wide':
            self.W, self.H = 1920, 1080
            self.bar = 96
        else:
            self.W, self.H = 1080, 1920
            self.bar = 0
        b = min(self.W, self.H)
        v = mode == 'vertical'
        self.f_serif = font('Playfair.ttf', b * (0.22 if v else 0.24))
        self.f_label = font('Inter.ttf', b * (0.030 if v else 0.026))
        self.f_line = font('Inter.ttf', b * (0.056 if v else 0.058))
        self.track = b * 0.012
        # vertical anchor (fraction of H) for each slot: centre y of the element
        if v:
            self.slots = dict(top=0.27, undertop=0.36, undertop2=0.395, mid=0.47, undermid=0.56, undermid2=0.595, low=0.62, under=0.71)
        else:
            self.slots = dict(top=0.30, undertop=0.465, undertop2=0.515, mid=0.47, undermid=0.635, undermid2=0.685, low=0.64, under=0.825)
        self.cache = {}

    def mask(self, kind, text):
        k = (kind, text)
        if k not in self.cache:
            if kind == 'serif':
                m = text_mask(text, self.f_serif, tracking=-self.track * 0.6, shear=0.16)
            elif kind == 'label':
                m = text_mask(text, self.f_label, tracking=self.track * 0.9)
            else:
                m = text_mask(text, self.f_line, tracking=0)
            if m.shape[1] > 0.9 * self.W:  # keep long labels inside the frame
                h = int(m.shape[0] * 0.9 * self.W / m.shape[1])
                m = np.asarray(Image.fromarray((m * 255).astype(np.uint8)).resize((int(0.9 * self.W), h), Image.LANCZOS), np.float32) / 255.0
            blur = np.asarray(Image.fromarray((m * 255).astype(np.uint8)).filter(
                ImageFilter.GaussianBlur(max(6, m.shape[0] // 5))), np.float32) / 255.0
            self.cache[k] = (m, blur)
        return self.cache[k]


def paste_mask(frame, m, x, y, color, op, chroma=0, shadow=None):
    H, W, _ = frame.shape
    h, w = m.shape

    def region(ox):
        x0, y0 = x + ox, y
        fx0, fy0 = max(0, x0), max(0, y0)
        fx1, fy1 = min(W, x0 + w), min(H, y0 + h)
        if fx1 <= fx0 or fy1 <= fy0:
            return None
        return (slice(fy0, fy1), slice(fx0, fx1)), (slice(fy0 - y0, fy1 - y0), slice(fx0 - x0, fx1 - x0))

    if shadow is not None:
        r = region(0)
        if r:
            (fs, ms) = r
            frame[fs] *= (1 - 0.55 * op * shadow[ms])[..., None]
    for c, ox in ((0, chroma), (1, 0), (2, -chroma)):
        r = region(ox)
        if not r:
            continue
        fs, ms = r
        a = m[ms] * op
        frame[fs + (c,)] = frame[fs + (c,)] * (1 - a) + color[c] * a


# ---------------------------------------------------------------- frame
_IMG = {}


def shot_source(L, sh):
    key = (sh['img'], sh['grade'], sh.get('dim', 1.0))
    if key not in _IMG:
        im = Image.open(f"{PH}/{sh['img'].split('/')[-1]}.jpg")
        if sh['img'] in CROPS:  # trim logos / watermarks baked into the photo
            im = im.crop((0, 0, im.width, int(im.height * CROPS[sh['img']])))
        # cover scale at 1.25x so zoomed crops stay sharp
        s = max(L.W / im.width, L.H / im.height) * 1.25
        im = im.resize((int(im.width * s), int(im.height * s)), Image.LANCZOS)
        _IMG[key] = grade(im, sh['grade'], sh.get('dim', 1.0))
    return _IMG[key]


def kenburns(L, sh, t):
    src = shot_source(L, sh)
    z0, z1 = sh['zoom']
    z = z0 + (z1 - z0) * ease(t)
    cover = max(L.W / src.width, L.H / src.height)
    cw, ch = L.W / (cover * z), L.H / (cover * z)
    fx, fy = sh['focus']
    cx = min(max(fx * src.width, cw / 2), src.width - cw / 2)
    cy = min(max(fy * src.height, ch / 2), src.height - ch / 2)
    box = (cx - cw / 2, cy - ch / 2, cx + cw / 2, cy + ch / 2)
    return np.asarray(src.resize((L.W, L.H), Image.BILINEAR, box=box), np.float32) / 255.0


_STATIC = {}


def statics(L):
    if L.mode not in _STATIC:
        yy, xx = np.mgrid[0:L.H, 0:L.W].astype(np.float32)
        d = np.sqrt(((xx - L.W / 2) / (L.W / 2)) ** 2 + ((yy - L.H / 2) / (L.H / 2)) ** 2)
        vig = np.clip(1 - 0.55 * np.clip(d - 0.45, 0, None) ** 1.6, 0, 1)
        crest = Image.open(f'{BRAND}/spl.png').convert('RGBA')
        logo = Image.open(f'{BRAND}/samsara-light.png').convert('RGBA')
        _STATIC[L.mode] = (vig[..., None], crest, logo)
    return _STATIC[L.mode]


def paste_rgba(frame, im, cx, cy, op, chroma=0):
    a = np.asarray(im, np.float32) / 255.0
    m = a[..., 3]
    for c, ox in ((0, chroma), (1, 0), (2, -chroma)):
        H, W, _ = frame.shape
        h, w = m.shape
        x0, y0 = int(cx - w / 2) + ox, int(cy - h / 2)
        fx0, fy0, fx1, fy1 = max(0, x0), max(0, y0), min(W, x0 + w), min(H, y0 + h)
        if fx1 <= fx0 or fy1 <= fy0:
            continue
        mm = m[fy0 - y0:fy1 - y0, fx0 - x0:fx1 - x0] * op
        col = a[fy0 - y0:fy1 - y0, fx0 - x0:fx1 - x0, c]
        frame[fy0:fy1, fx0:fx1, c] = frame[fy0:fy1, fx0:fx1, c] * (1 - mm) + col * mm


def glitch(arr, g, rng):
    """arr uint8 HxWx3, in place-ish. g in 0..1"""
    if g <= 0.01:
        return arr
    H, W, _ = arr.shape
    out = arr.copy()
    s = int(4 + g * 34)
    out[..., 0] = np.roll(arr[..., 0], s, axis=1)
    out[..., 2] = np.roll(arr[..., 2], -s, axis=1)
    for _ in range(int(2 + g * 9)):
        y = rng.integers(0, H)
        h = int(rng.integers(4, 18 + int(g * 70)))
        out[y:y + h] = np.roll(out[y:y + h], int(rng.integers(-1, 2) * g * rng.integers(20, 160)), axis=1)
        if rng.random() < 0.3 * g:
            out[y:y + h] = np.clip(out[y:y + h].astype(np.int16) + 60, 0, 255).astype(np.uint8)
    return out


def text_anim(kind, lt, t0, t1):
    """returns opacity, y-offset (px frac), chroma px"""
    if lt < t0 or lt > t1:
        return 0, 0, 0
    a = ease((lt - t0) / 0.45)
    out = ease((t1 - lt) / 0.25)
    op = min(a, out)
    rise = (1 - a) * 0.03
    chroma = int((1 - ease((lt - t0) / 0.6)) * 26) + 3 if kind == 'serif' else int((1 - a) * 10)
    return op, rise, chroma


def render_frame(args):
    mode, fi = args
    L = LAYOUTS[mode]
    t = fi / FPS
    rng = np.random.default_rng(fi * 7919 + 13)
    vig, crest, logo = statics(L)
    sh = next(s for s in SHOTS if s['s'] <= t < s['s'] + s['d'] + 1e-6) if t < DUR else SHOTS[-1]
    lt = t - sh['s']
    u = lt / sh['d']
    if sh.get('img'):
        frame = kenburns(L, sh, u)
    else:
        frame = np.zeros((L.H, L.W, 3), np.float32)
    if sh.get('fadein'):
        frame *= ease(lt / sh['fadein'])
    # impact flash
    for it in IMPACTS:
        dt = t - it
        if 0 <= dt < 0.2:
            frame = frame + (1 - dt / 0.2) * 0.35
    # texts
    for kind, txt, t0, t1, slot in sh.get('texts', []):
        op, rise, chroma = text_anim(kind, lt, t0, t1)
        if op <= 0:
            continue
        m, blur = L.mask(kind, txt)
        cy = L.slots[slot] * L.H + rise * L.H
        x = int(L.W / 2 - m.shape[1] / 2)
        y = int(cy - m.shape[0] / 2)
        col = (1.0, 1.0, 1.0) if kind != 'label' else (0.86, 0.93, 0.95)
        paste_mask(frame, m, x, y, col, op, chroma=chroma, shadow=blur)
    if sh.get('endcard'):
        endcard(L, frame, lt, crest, logo)
    # vignette + grain
    frame = frame * vig
    frame += rng.normal(0, 0.035, (L.H // 2, L.W // 2, 1)).astype(np.float32).repeat(2, 0).repeat(2, 1)
    # final fade
    if t > DUR - 0.8:
        frame *= ease((DUR - t) / 0.8)
    arr = (np.clip(frame, 0, 1) * 255).astype(np.uint8)
    # constant lens fringe
    arr[..., 0] = np.roll(arr[..., 0], 2, axis=1)
    arr[..., 2] = np.roll(arr[..., 2], -2, axis=1)
    # glitch intensity
    g = 0.0
    if sh.get('gin'):
        g = max(g, 1 - lt / (0.12 if sh.get('strobe') else 0.22))
    if sh.get('strobe'):
        g = max(g, 0.45)
    if sh.get('img') and rng.random() < 0.035:
        g = max(g, 0.35)
    arr = glitch(arr, g, rng)
    if L.bar:
        arr[:L.bar] = 0
        arr[-L.bar:] = 0
    return arr.tobytes()


def endcard(L, frame, lt, crest, logo):
    v = L.mode == 'vertical'
    b = min(L.W, L.H)
    # crest
    a = ease((lt - 0.15) / 0.8)
    if a > 0:
        size = b * (0.42 if v else 0.30) * (1.12 - 0.12 * ease(lt / 2.5))
        im = crest.resize((int(size * crest.width / crest.height), int(size)), Image.LANCZOS)
        cy = L.H * (0.36 if v else 0.30)
        paste_rgba(frame, im, L.W / 2, cy, a, chroma=int((1 - ease(lt / 0.9)) * 22))
    # season 3
    m, blur = L.mask('serif', 'Season 3')
    op, rise, chroma = text_anim('serif', lt, 1.0, 99)
    if op > 0:
        cy = L.H * (0.555 if v else 0.585) + rise * L.H
        paste_mask(frame, m, int(L.W / 2 - m.shape[1] / 2), int(cy - m.shape[0] / 2), (1, 1, 1), op, chroma, blur)
    for txt, t0, yv, yw in (('STARTS SATURDAY 14 NOVEMBER 2026', 2.0, 0.645, 0.755),
                            ('NICHOLLS, CANBERRA', 2.4, 0.675, 0.79)):
        m, blur = L.mask('label', txt)
        op, rise, chroma = text_anim('label', lt, t0, 99)
        if op > 0:
            cy = L.H * (yv if v else yw) + rise * L.H
            paste_mask(frame, m, int(L.W / 2 - m.shape[1] / 2), int(cy - m.shape[0] / 2), (0.86, 0.93, 0.95), op, chroma, blur)
    a = ease((lt - 3.2) / 0.8)
    if a > 0:
        w = b * (0.30 if v else 0.17)
        im = logo.resize((int(w), int(w * logo.height / logo.width)), Image.LANCZOS)
        paste_rgba(frame, im, L.W / 2, L.H * (0.745 if v else 0.862), a * 0.9)


LAYOUTS = {'wide': Layout('wide'), 'vertical': Layout('vertical')}

if __name__ == '__main__':
    mode, out = sys.argv[1], sys.argv[2]
    L = LAYOUTS[mode]
    if '--stills' in sys.argv:
        ts = [float(x) for x in sys.argv[sys.argv.index('--stills') + 1].split(',')]
        for t in ts:
            arr = np.frombuffer(render_frame((mode, int(t * FPS))), np.uint8).reshape(L.H, L.W, 3)
            Image.fromarray(arr).save(f'{out}_{t:05.2f}.jpg', quality=88)
        sys.exit()
    audio = sys.argv[3]
    n = int(DUR * FPS)
    cmd = ['ffmpeg', '-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{L.W}x{L.H}',
           '-r', str(FPS), '-i', '-', '-i', audio, '-c:v', 'libx264', '-preset', 'medium', '-crf', '20',
           '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '256k', '-shortest', '-movflags', '+faststart', out]
    p = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    with Pool(os.cpu_count()) as pool:
        for i, buf in enumerate(pool.imap(render_frame, [(mode, i) for i in range(n)], chunksize=4)):
            p.stdin.write(buf)
            if i % 150 == 0:
                print(mode, i, '/', n, flush=True)
    p.stdin.close()
    p.wait()

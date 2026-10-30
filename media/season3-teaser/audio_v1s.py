"""v1 cut, serious suspense mix (no heartbeat), from recorded Mixkit SFX and music (Mixkit free licence)."""
import sys, wave, subprocess
import numpy as np
SR = 48000; DUR = 45.0; N = int(SR * DUR)
M = np.zeros((N, 2))
DROP, END = 36.5, 37.3   # silence before the end card


def load(f, ss=0, t=None):
    cmd = ['ffmpeg', '-v', 'error', '-ss', str(ss), '-i', f]
    if t: cmd += ['-t', str(t)]
    raw = subprocess.run(cmd + ['-ac', '2', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True).stdout
    return np.frombuffer(raw[:len(raw) // 8 * 8], np.float32).reshape(-1, 2).astype(float)

def norm(x): return x / (np.abs(x).max() + 1e-9)

def transient(x):
    hop = SR // 100; m = x.mean(1); n = len(m) // hop
    db = 10 * np.log10((m[:n * hop].reshape(n, hop) ** 2).mean(1) + 1e-10)
    return int(np.argmax(np.diff(db) * (db[1:] > db.max() - 12)) + 1) * hop

def peak(x):
    hop = SR // 20; m = x.mean(1); n = len(m) // hop
    return int(np.argmax((m[:n * hop].reshape(n, hop) ** 2).mean(1))) * hop + hop // 2

def put(x, at_sample, gain):
    i = max(0, at_sample); s = i - at_sample
    j = min(N, at_sample + len(x))
    if j > i: M[i:j] += x[s:s + j - i] * gain

def sfx(id_, at, gain, align='hit', cut=None):
    x = norm(load(f'sfx/s{id_}.mp3'))
    off = transient(x) if align == 'hit' else peak(x)
    if cut is not None:
        k = int((cut - at) * SR) + off
        x = x[:max(k, 1)].copy(); f = min(len(x), int(0.015 * SR)); x[-f:] *= np.linspace(1, 0, f)[:, None]
    put(x, int(at * SR) - off, gain)

def fade(x, a, b):
    n = len(x); e = np.ones(n)
    e[:int(a * SR)] = np.linspace(0, 1, int(a * SR)); e[n - int(b * SR):] = np.linspace(1, 0, int(b * SR))
    return x * e[:, None]

# beds: sub room tone + tactical drone + "Silent Descent", running to the drop
put(fade(norm(load('sfx/s3081.mp3', 10.0, DROP)), 2.0, 0.02), 0, 0.45)
put(fade(norm(load('sfx/s2744.mp3', 0.0, DROP)), 3.0, 0.02), 0, 0.16)
put(fade(norm(load('sfx/m614.mp3', 31.0, DROP)), 2.5, 0.02), 0, 0.42)
put(fade(norm(load('sfx/m614.mp3', 74.0, 7.7)), 0.6, 3.0), int((END + 0.2) * SR), 0.42)

# suspense ambience under the first half, choir swell into '1 trophy'
sa = norm(load('sfx/s2510.mp3', 14.0, 18.0)); sa *= np.linspace(0.6, 1.0, len(sa))[:, None]
put(fade(sa, 2.0, 1.0), int(3.0 * SR), 0.5)
sfx(662, 17.0, 0.35, 'peak')

# the clock starts with the squad deadline, speeds up under the question
tk = norm(load('sfx/s1059.mp3', 0.0, 7.0))
put(fade(tk, 0.3, 0.2) * np.linspace(0.7, 1.2, len(tk))[:, None], int(21.0 * SR), 0.34)
ft = norm(load('sfx/s1063.mp3')); ft = np.concatenate([ft, ft, ft])[:int(3.5 * SR)]
put(fade(ft, 0.05, 0.1), int(28.0 * SR), 0.42)
# drum swell climbing into the strobe and the '14th' hit
sw = norm(load('sfx/s682.mp3', 13.3, 11.3))
sw[-int(0.015 * SR):] *= np.linspace(1, 0, int(0.015 * SR))[:, None]
sw *= np.linspace(0.3, 1.0, len(sw))[:, None] ** 1.5
put(fade(sw, 1.5, 0.0001), int((33.0 - 11.3) * SR), 1.1)

# impacts on the cuts
sfx(2902, 3.0, 0.7)
sfx(2918, 7.0, 0.55)
for t in (10.5, 11.2, 11.9, 12.6): sfx(563, t, 0.32); sfx(1438, t, 0.3)
sfx(2908, 13.3, 0.5)
sfx(2901, 17.0, 0.7); sfx(563, 17.0, 0.4)
sfx(2917, 21.0, 0.65)
sfx(563, 24.5, 0.5)
sfx(773, 28.0, 0.35)
for i, t in enumerate(np.arange(31.5, 33.0, 0.25)): sfx(1430 if i % 2 else 1438, t, 0.42)
sfx(2908, 33.0, 0.85); sfx(563, 33.0, 0.5)
sfx(2902, END, 1.0); sfx(2908, END, 0.6); sfx(786, END, 0.6)

# risers, and a hard cut into silence
sfx(790, 3.0, 0.35, 'peak')
sfx(1144, 17.0, 0.4, 'peak')
sfx(1144, DROP - 0.05, 0.45, 'peak', cut=DROP)

# glitch zap on each big numeral
for t in (3.6, 7.3, 17.5, 21.3, 33.25, END + 1.0): sfx(2619, t, 0.12)
ch = norm(load('sfx/s364.mp3', 3.0, 3.6))
put(fade(ch, 0.4, 1.2), int(13.3 * SR), 0.15)

M[int(DROP * SR):int(END * SR) - 200] = 0
M[-int(1.5 * SR):] *= np.linspace(1, 0, int(1.5 * SR))[:, None]
M /= np.abs(M).max() / 0.7
with wave.open(sys.argv[1], 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((M * 32767).astype(np.int16).tobytes())

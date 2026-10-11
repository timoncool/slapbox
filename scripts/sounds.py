import numpy as np, wave, sys, os
SR = 22050
rng = np.random.default_rng(7)
out = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'hooks', 'sounds')

def env(n, attack, decay):
    t = np.arange(n) / SR
    return np.minimum(1, t / max(attack, 1e-4)) * np.exp(-t / decay)

def lowpass(x, cutoff):
    a = np.exp(-2 * np.pi * cutoff / SR)
    y = np.zeros_like(x); acc = 0.0
    for i, v in enumerate(x):
        acc = (1 - a) * v + a * acc; y[i] = acc
    return y

def highpass(x, cutoff):
    return x - lowpass(x, cutoff)

def noise(seconds):
    return rng.standard_normal(int(SR * seconds))

def pad(x, seconds):
    return np.concatenate([np.zeros(int(SR * seconds)), x])

def mix(*parts):
    n = max(len(p) for p in parts)
    y = np.zeros(n)
    for p in parts: y[:len(p)] += p
    return y

def save(name, x):
    x = x / (np.max(np.abs(x)) + 1e-9) * 0.9
    with wave.open(os.path.join(out, name), 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((x * 32767).astype('<i2').tobytes())
    print(f'{name}: {len(x)/SR:.2f}s peak {np.max(np.abs(x)):.2f}')

thump = lowpass(noise(0.25), 500) * env(int(SR*0.25), 0.002, 0.05) * 3
clap = highpass(noise(0.12), 900) * env(int(SR*0.12), 0.001, 0.018)
save('hand.wav', mix(thump, clap))

flat = lowpass(highpass(noise(0.18), 400), 4000) * env(int(SR*0.18), 0.001, 0.03)
body = lowpass(noise(0.18), 300) * env(int(SR*0.18), 0.003, 0.04) * 2
save('slipper.wav', mix(flat, body))

n = int(SR * 0.22)
t = np.arange(n) / SR
swish = highpass(noise(0.22), 2500) * np.sin(np.pi * t / 0.22) ** 2 * 0.35
crack = highpass(noise(0.08), 3000) * env(int(SR*0.08), 0.0005, 0.006) * 2.5
save('whip.wav', mix(swish, pad(crack, 0.20)))

n = int(SR * 0.10)
t = np.arange(n) / SR
swoosh = highpass(noise(0.10), 1800) * np.sin(np.pi * t / 0.10) ** 2 * 0.3
snap = mix(highpass(noise(0.07), 1500) * env(int(SR*0.07), 0.0005, 0.010) * 2, lowpass(noise(0.07), 600) * env(int(SR*0.07), 0.001, 0.02))
save('crop.wav', mix(swoosh, pad(snap, 0.09)))

def tones(seconds, partials):
    t = np.arange(int(SR * seconds)) / SR
    return sum(a * np.sin(2 * np.pi * f * t) * np.exp(-t / d) for f, a, d in partials)

crack = highpass(noise(0.12), 700) * env(int(SR*0.12), 0.0005, 0.011) * 2.2
leather = lowpass(noise(0.12), 450) * env(int(SR*0.12), 0.002, 0.03) * 1.6
save('belt.wav', mix(crack, leather))

flat_rng = np.random.default_rng(11)
def flat_noise(seconds):
    return flat_rng.standard_normal(int(SR * seconds))
n = int(SR * 0.12)
thwack = highpass(flat_noise(0.12), 1600) * env(n, 0.0003, 0.005) * 2.6
smack = lowpass(highpass(flat_noise(0.12), 500), 5000) * env(n, 0.0008, 0.016) * 1.4
skin = lowpass(flat_noise(0.12), 260) * env(n, 0.002, 0.024) * 0.9
save('ruler.wav', mix(thwack, smack, skin))

n = int(SR * 0.08)
t = np.arange(n) / SR
whoosh = highpass(noise(0.08), 1400) * np.sin(np.pi * t / 0.08) ** 2 * 0.25
flap = highpass(noise(0.09), 1100) * env(int(SR*0.09), 0.0008, 0.016) * 1.8
save('swatter.wav', mix(whoosh, pad(flap, 0.07)))

bong = tones(0.9, [(330, 1.0, 0.32), (752, 0.55, 0.22), (1238, 0.35, 0.15), (1873, 0.2, 0.09)])
thud = lowpass(noise(0.2), 350) * env(int(SR*0.2), 0.002, 0.045) * 2.5
save('pan.wav', mix(bong, thud))

import base64
import numpy as np

def decode_audio(b64_str):
    raw = base64.b64decode(b64_str)
    audio = np.frombuffer(raw, dtype=np.float32)
    return audio

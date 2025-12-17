import asyncio
import websockets
import soundfile as sf
import numpy as np
import base64
import json

URI = "ws://localhost:8000/ws/emotion"

# ===== load wav =====
audio, sr = sf.read("angry.wav")
assert sr == 16000

# mono safety
if audio.ndim > 1:
    audio = audio.mean(axis=1)

audio = audio.astype(np.float32)

# ===== chunking =====
CHUNK_SIZE = 8000  # 0.5 detik

def to_base64(x: np.ndarray) -> str:
    return base64.b64encode(x.tobytes()).decode()

async def test():
    async with websockets.connect(URI) as ws:
        for i in range(0, len(audio), CHUNK_SIZE):
            chunk = audio[i:i + CHUNK_SIZE]

            if len(chunk) < CHUNK_SIZE:
                break

            msg = {
                "type": "audio_chunk",
                "data": to_base64(chunk)
            }

            await ws.send(json.dumps(msg))
            print("sent chunk", i // CHUNK_SIZE)

            # coba terima response (non-blocking)
            try:
                resp = await asyncio.wait_for(ws.recv(), timeout=0.2)
                print("received:", resp)
            except asyncio.TimeoutError:
                pass

        # tunggu sisa response
        for _ in range(5):
            try:
                resp = await asyncio.wait_for(ws.recv(), timeout=1)
                print("received:", resp)
            except asyncio.TimeoutError:
                break

asyncio.run(test())

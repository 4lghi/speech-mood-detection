import asyncio
import websockets
import base64
import numpy as np
import json

URI = "ws://localhost:8000/ws/emotion"

async def test():
    async with websockets.connect(URI) as ws:
        fake_audio = np.zeros(8000, dtype=np.float32)
        audio_b64 = base64.b64encode(fake_audio.tobytes()).decode()

        msg = {
            "type": "audio_chunk",
            "data": audio_b64
        }

        for i in range(8):
            await ws.send(json.dumps(msg))
            print("sent chunk", i)

        # tunggu response
        for _ in range(3):
            resp = await ws.recv()
            print("received:", resp)

asyncio.run(test())

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
import random

app = FastAPI()

@app.get("/health")
def health():
    return {"status": "ok"}

@app.websocket("/ws/test")
async def emotion_ws(ws: WebSocket):
    await ws.accept()
    try:
        while True:
            data = await ws.receive_text()  # nanti ini audio
            await ws.send_json({
                "emotion": random.choice(["senang", "sedih", "marah", "netral"]),
                "confidence": round(random.uniform(0.6, 0.95), 2)
            })
    except:
        await ws.close()

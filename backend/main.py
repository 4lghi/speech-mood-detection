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


@app.websocket("/ws/emotion")
async def ws_emotion(ws: WebSocket):
    await ws.accept()
    try:
        while True:
            msg = await ws.receive_json()

            if msg.get("type") != "audio_chunk":
                await ws.send_json({"error": "invalid type"})
                continue

            audio_b64 = msg["data"]
            sr = msg["sample_rate"]

            print("Chunk diterima:", len(audio_b64), "SR:", sr)

            # DUMMY inference
            await ws.send_json({
                "type": "emotion",
                "label": "neutral",
                "confidence": 0.9
            })
    except WebSocketDisconnect:
        print("Client disconnected")

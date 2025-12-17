from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from buffer import AudioBuffer
from audio import decode_audio
from model import infer_emotion

app = FastAPI()

@app.get("/health")
def health():
    return {"status": "ok"}

@app.websocket("/ws/emotion")
async def ws_emotion(ws: WebSocket):
    await ws.accept()

    buffer = AudioBuffer(
        window_size=16000 * 2,
        stride=16000
    )

    try:
        while True:
            msg = await ws.receive_json()

            if msg.get("type") != "audio_chunk":
                continue

            audio = decode_audio(msg["data"])

            window = buffer.add(audio.tolist())
            if window:
                result = infer_emotion(window)
                await ws.send_json({
                    "type": "emotion",
                    **result
                })

    except WebSocketDisconnect:
        print("Client disconnected")

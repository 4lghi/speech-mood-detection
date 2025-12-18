from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from buffer import AudioBuffer
from audio import decode_audio
from model import infer_emotion
import numpy as np

app = FastAPI()

# ================= CONFIG =================
CONFIDENCE_THRESHOLD = 0.55
SILENCE_RMS_THRESHOLD = 0.01
SILENCE_CHUNKS = 2  # window berturut-turut

silence_counter = 0

# ================= UTILS =================
def is_silence(audio_1d):
    global silence_counter
    rms = np.sqrt(np.mean(np.square(audio_1d)))

    if rms < SILENCE_RMS_THRESHOLD:
        silence_counter += 1
    else:
        silence_counter = 0

    return silence_counter >= SILENCE_CHUNKS


def postprocess_result(result):
    if result["confidence"] < CONFIDENCE_THRESHOLD:
        return {
            "emotion": "neutral",
            "confidence": result["confidence"],
            "probs": result.get("probs"),
            "reason": "low_confidence"
        }
    return result


# ================= ROUTES =================
@app.get("/health")
def health():
    return {"status": "ok"}


@app.websocket("/ws/emotion")
async def ws_emotion(ws: WebSocket):
    await ws.accept()

    buffer = AudioBuffer(
        window_size=16000 * 2,  # 2 detik
        stride=16000            # 1 detik overlap
    )

    try:
        while True:
            msg = await ws.receive_json()

            if msg.get("type") != "audio_chunk":
                continue

            audio = decode_audio(msg["data"])
            window = buffer.add(audio.tolist())

            if window:
                # 1. silence detection
                if is_silence(window):
                    await ws.send_json({
                        "type": "emotion",
                        "emotion": "neutral",
                        "confidence": 1.0,
                        "reason": "silence"
                    })
                    continue

                # 2. model inference
                result = infer_emotion(window)

                # 3. confidence filter
                result = postprocess_result(result)

                await ws.send_json({
                    "type": "emotion",
                    **result
                })

    except WebSocketDisconnect:
        print("Client disconnected")

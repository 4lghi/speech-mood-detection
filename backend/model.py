# model.py
import torch
import numpy as np
from transformers import AutoFeatureExtractor, AutoModelForAudioClassification

# =========================
# Load model SEKALI SAJA
# =========================
MODEL_NAME = "alianurrahman/wav2vec2-base-indonesian-speech-emotion-recognition"

device = torch.device("cpu")  # nanti bisa ganti cuda

feature_extractor = AutoFeatureExtractor.from_pretrained(MODEL_NAME)
model = AutoModelForAudioClassification.from_pretrained(MODEL_NAME)
model.to(device)
model.eval()

# Optional: biar CPU nggak ngelock semua core
torch.set_num_threads(1)


# =========================
# Inference function
# =========================
def infer_emotion(audio_1d):
    """
    audio_1d: list / numpy array / torch tensor
              shape: (N,)
              sample rate: 16kHz
              dtype: float32 (-1.0 ~ 1.0)
    """

    # pastikan numpy float32
    if isinstance(audio_1d, list):
        audio_1d = np.array(audio_1d, dtype=np.float32)
    elif isinstance(audio_1d, torch.Tensor):
        audio_1d = audio_1d.cpu().numpy().astype(np.float32)

    # feature extraction
    inputs = feature_extractor(
        audio_1d,
        sampling_rate=16000,
        return_tensors="pt",
        padding=True
    )

    inputs = {k: v.to(device) for k, v in inputs.items()}

    # inference
    with torch.no_grad():
        logits = model(**inputs).logits

    probs = torch.softmax(logits, dim=-1)[0]

    pred_id = int(torch.argmax(probs))
    label = model.config.id2label[pred_id]

    return {
        "emotion": label,
        "confidence": float(probs[pred_id]),
        "probs": {
            model.config.id2label[i]: float(p)
            for i, p in enumerate(probs)
        }
    }

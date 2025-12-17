# OFFLINE TEST ONLY
# DO NOT USE IN WEBSOCKET

import torch
import soundfile as sf
from transformers import AutoFeatureExtractor, AutoModelForAudioClassification

MODEL_NAME = "alianurrahman/wav2vec2-base-indonesian-speech-emotion-recognition"
AUDIO_PATH = "angry.wav"

print("Loading model...")
feature_extractor = AutoFeatureExtractor.from_pretrained(MODEL_NAME)
model = AutoModelForAudioClassification.from_pretrained(MODEL_NAME)
model.eval()
print("Model loaded")

# load audio (TANPA torchaudio.load)
waveform, sr = sf.read(AUDIO_PATH)

if waveform.ndim > 1:
    waveform = waveform.mean(axis=1)

waveform = torch.tensor(waveform, dtype=torch.float32)

if sr != 16000:
    import torchaudio
    waveform = torchaudio.functional.resample(waveform, sr, 16000)

inputs = feature_extractor(
    waveform.numpy(),
    sampling_rate=16000,
    return_tensors="pt",
    padding=True
)

with torch.no_grad():
    logits = model(**inputs).logits

pred_id = torch.argmax(logits, dim=-1).item()
label = model.config.id2label[pred_id]

print("Predicted emotion:", label)

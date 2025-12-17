# experiments/test_model_only.py
from model import infer_emotion
import soundfile as sf

audio, sr = sf.read("experiments/angry.wav")
assert sr == 16000

print(infer_emotion(audio))

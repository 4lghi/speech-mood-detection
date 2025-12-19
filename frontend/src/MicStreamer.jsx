import { useEffect, useRef, useState } from "react";

const WS_URL = import.meta.env.VITE_WS_URL;
const TARGET_SR = 16000;
const CHUNK_SIZE = 8000; // 0.5 detik

const EMOTION_THEME = {
  angry: {
    bg: "#8B0000",
    label: "Angry",
  },
  happy: {
    bg: "#2E8B57",
    label: "Happy",
  },
  sad: {
    bg: "#1E3A8A",
    label: "Sad",
  },
  fear: {
    bg: "#4B0082",
    label: "Fear",
  },
  disgust: {
    bg: "#556B2F",
    label: "Disgust",
  },
};

// fallback AMAN
const FALLBACK_EMOTION = "happy";

export default function MicStreamer() {
  const wsRef = useRef(null);
  const audioCtxRef = useRef(null);
  const processorRef = useRef(null);
  const bufferRef = useRef([]);

  const [emotion, setEmotion] = useState(FALLBACK_EMOTION);
  const [confidence, setConfidence] = useState(0);
  const [started, setStarted] = useState(false);

  // ================== WebSocket ==================
  useEffect(() => {
    wsRef.current = new WebSocket(WS_URL);

    wsRef.current.onmessage = (evt) => {
      const data = JSON.parse(evt.data);

      if (data.type === "emotion" && data.confidence > 0.5) {
        setEmotion(data.emotion);
        setConfidence(data.confidence);
      }
    };

    return () => {
      wsRef.current?.close();
    };
  }, []);

  // ================== MIC ==================
  async function startMic() {
    if (started) return;
    setStarted(true);

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const audioCtx = new AudioContext();
    audioCtxRef.current = audioCtx;

    const source = audioCtx.createMediaStreamSource(stream);
    const processor = audioCtx.createScriptProcessor(4096, 1, 1);
    processorRef.current = processor;

    source.connect(processor);
    processor.connect(audioCtx.destination);

    processor.onaudioprocess = (e) => {
      const input = e.inputBuffer.getChannelData(0);
      const resampled = resampleTo16k(input, audioCtx.sampleRate);

      bufferRef.current.push(...resampled);

      if (bufferRef.current.length >= CHUNK_SIZE) {
        const chunk = bufferRef.current.slice(0, CHUNK_SIZE);
        bufferRef.current = bufferRef.current.slice(CHUNK_SIZE);
        sendChunk(chunk);
      }
    };
  }

  // ================== SEND AUDIO ==================
  function sendChunk(floatArray) {
    if (!wsRef.current || wsRef.current.readyState !== 1) return;

    const buffer = new Float32Array(floatArray).buffer;
    const bytes = new Uint8Array(buffer);
    let binary = "";
    bytes.forEach((b) => (binary += String.fromCharCode(b)));

    wsRef.current.send(
      JSON.stringify({
        type: "audio_chunk",
        data: btoa(binary),
      })
    );
  }

  // ================== UI ==================
  const theme = EMOTION_THEME[emotion] || EMOTION_THEME[FALLBACK_EMOTION];

  return (
    <div
      className="
        fixed inset-0 
        flex flex-col items-center justify-center
        transition-colors duration-700
        text-white
        font-sans
      "
      style={{ backgroundColor: theme.bg }}
    >
      {/* EMOTION LABEL */}
      <div className="text-6xl font-semibold tracking-widest drop-shadow-lg">
        {theme.label}
      </div>

      {/* CONFIDENCE */}
      <div className="mt-4 text-sm opacity-70">
        confidence {confidence.toFixed(2)}
      </div>

      {/* START BUTTON */}
      {!started && (
        <button
          onClick={startMic}
          className="
            mt-10
            px-6 py-2
            rounded-md
            border border-white/20
            bg-white/10
            hover:bg-white/20
            transition
            text-sm
          "
        >
          Start Mic
        </button>
      )}
    </div>
  );
}

// ================== RESAMPLER ==================
function resampleTo16k(input, inputRate) {
  if (inputRate === TARGET_SR) return input;

  const ratio = inputRate / TARGET_SR;
  const newLength = Math.round(input.length / ratio);
  const output = new Float32Array(newLength);

  for (let i = 0; i < newLength; i++) {
    output[i] = input[Math.round(i * ratio)];
  }

  return output;
}

import { useEffect, useRef, useState } from "react";

const WS_URL = "ws://localhost:8000/ws/emotion";
const TARGET_SR = 16000;
const CHUNK_SIZE = 8000; // 0.5 detik

export default function MicStreamer() {
  const wsRef = useRef(null);
  const audioCtxRef = useRef(null);
  const processorRef = useRef(null);
  const bufferRef = useRef([]);

  const [emotion, setEmotion] = useState("—");
  const [confidence, setConfidence] = useState(0);

  useEffect(() => {
    wsRef.current = new WebSocket(WS_URL);

    wsRef.current.onmessage = (evt) => {
      const data = JSON.parse(evt.data);
      if (data.type === "emotion") {
        setEmotion(data.emotion);
        setConfidence(data.confidence);
      }
    };

    return () => {
      wsRef.current?.close();
    };
  }, []);

  async function startMic() {
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

  return (
    <div style={{ padding: 20 }}>
      <h2>Realtime Speech Emotion</h2>
      <button onClick={startMic}>Start Mic</button>
      <p>Emotion: <b>{emotion}</b></p>
      <p>Confidence: {confidence.toFixed(2)}</p>
    </div>
  );
}


function resampleTo16k(input, inputRate) {
  if (inputRate === 16000) return input;

  const ratio = inputRate / 16000;
  const newLength = Math.round(input.length / ratio);
  const output = new Float32Array(newLength);

  for (let i = 0; i < newLength; i++) {
    output[i] = input[Math.round(i * ratio)];
  }

  return output;
}

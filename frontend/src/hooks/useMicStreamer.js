import { useRef, useState } from "react";

const TARGET_SR = 16000;
const CHUNK_SIZE = 8000;

export function useMicStreamer(wsRef) {
  const audioCtxRef = useRef(null);
  const processorRef = useRef(null);
  const bufferRef = useRef([]);
  const [started, setStarted] = useState(false);

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
        const chunk = bufferRef.current.splice(0, CHUNK_SIZE);
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

  return { startMic, started };
}

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

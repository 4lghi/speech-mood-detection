import { useEffect, useRef, useState } from "react";

export function useEmotionWS(url, threshold = 0.5) {
  const wsRef = useRef(null);
  const [emotion, setEmotion] = useState(null);
  const [confidence, setConfidence] = useState(0);

  useEffect(() => {
    wsRef.current = new WebSocket(url);

    wsRef.current.onmessage = (evt) => {
      const data = JSON.parse(evt.data);
      if (data.type === "emotion" && data.confidence > threshold) {
        setEmotion(data.emotion);
        setConfidence(data.confidence);
      }
    };

    return () => wsRef.current?.close();
  }, [url, threshold]);

  return { wsRef, emotion, confidence };
}

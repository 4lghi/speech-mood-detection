import { useEmotionWS } from "./hooks/useEmotionWS";
import { useMicStreamer } from "./hooks/useMicStreamer";
import EmotionScreen from "./ui/EmotionScreen";

const WS_URL = import.meta.env.VITE_WS_URL;

export default function App() {
  const { wsRef, emotion, confidence } = useEmotionWS(WS_URL, 0.5);
  const { startMic, started } = useMicStreamer(wsRef);

  return (
    <EmotionScreen
      emotion={emotion}
      confidence={confidence}
      started={started}
      onStart={startMic}
    />
  );
}

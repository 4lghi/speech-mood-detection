import { EMOTION_THEME, FALLBACK_EMOTION } from "../constants/emotionTheme";

export default function EmotionScreen({
  emotion,
  confidence,
  started,
  onStart,
}) {
  const theme =
    EMOTION_THEME[emotion] || EMOTION_THEME[FALLBACK_EMOTION];

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center
                 text-white font-sans transition-colors duration-700"
      style={{ backgroundColor: theme.bg }}
    >
      <div className="text-6xl font-semibold tracking-widest drop-shadow-lg">
        {theme.label}
      </div>

      <div className="mt-4 text-sm opacity-70">
        confidence {confidence.toFixed(2)}
      </div>

      {!started && (
        <button
          onClick={onStart}
          className="mt-10 px-6 py-2 rounded-md
                     border border-white/20 bg-white/10
                     hover:bg-white/20 transition text-sm"
        >
          Start Mic
        </button>
      )}
    </div>
  );
}

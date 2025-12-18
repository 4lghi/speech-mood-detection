"use client"

import { EMOTION_THEME, FALLBACK_EMOTION } from "../constants/emotionTheme"

export default function EmotionScreen({ emotion, confidence, started, onStart }) {
  const theme = EMOTION_THEME[emotion] || EMOTION_THEME[FALLBACK_EMOTION]
  const isListening = started && emotion !== FALLBACK_EMOTION

  return (
    <div
      className="fixed inset-0 transition-colors duration-700 overflow-hidden"
      style={{
        backgroundColor: theme.bg,
      }}
    >
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-20 blur-3xl animate-float"
        style={{ backgroundColor: theme.accent }}
      />
      <div
        className="absolute bottom-0 left-0 w-96 h-96 rounded-full opacity-20 blur-3xl animate-float"
        style={{ backgroundColor: theme.accent, animationDelay: "1s" }}
      />

      <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-bold text-white tracking-tight">Voice Emotion</h1>
        </div>

        {started && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/10 backdrop-blur-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-white animate-glow" />
            <span className="text-xs text-white font-medium tracking-wide">LIVE</span>
          </div>
        )}
      </div>

      <div className="absolute inset-0 flex items-center justify-center p-8">
        <div className="relative max-w-2xl w-full">
          {!started ? (
            <div className="flex flex-col items-start gap-8 animate-slide-up">
              <div className="space-y-3">
                <div className="inline-block px-3 py-1 bg-black/10 rounded-full">
                  <span className="text-sm text-white/90 font-medium">AI-Powered</span>
                </div>
                <h2 className="text-7xl font-black text-white leading-none tracking-tighter">
                  Detect
                  <br />
                  emotions
                  <br />
                  from voice
                </h2>
                <p className="text-xl text-white/70 max-w-md leading-relaxed">
                  Real-time analysis of vocal patterns to understand emotional states
                </p>
              </div>

              <button
                onClick={onStart}
                className="group relative overflow-hidden px-8 py-4 rounded-2xl bg-black/20 backdrop-blur-sm
                         hover:bg-black/30 transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                    <svg className="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                      />
                    </svg>
                  </div>
                  <span className="text-lg font-bold text-white tracking-tight">Start listening</span>
                </div>
              </button>

              <div className="flex items-center gap-2 text-white/50 text-sm">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Microphone access required</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-6 animate-slide-up">
              <div className="relative">
                <div className="text-[12rem] leading-none animate-float">{theme.icon}</div>
              </div>

              <div className="text-center space-y-2">
                <h2 className="text-6xl font-black text-white tracking-tighter">{theme.label}</h2>
                <p className="text-xl text-white/70 font-medium">{theme.description}</p>
              </div>

              <div className="w-full max-w-md space-y-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-white/60 font-medium tracking-wide uppercase">Confidence</span>
                  <span className="text-3xl font-black text-white tabular-nums">
                    {Math.round(confidence * 100)}
                    <span className="text-xl">%</span>
                  </span>
                </div>
                <div className="h-3 bg-black/10 rounded-full overflow-hidden backdrop-blur-sm">
                  <div
                    className="h-full bg-white rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${confidence * 100}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {started && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-end gap-1.5">
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              className="w-1.5 bg-white/60 rounded-full animate-wave"
              style={{
                height: `${20 + Math.random() * 30}px`,
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

import { useContext } from "react";
import { SoundContext } from "../context/SoundContext";

/** Speaker icon that shows the current mute state. */
function SoundIcon({ muted }) {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M4 9v6h4l5 4V5L8 9z" fill="currentColor" />
      {muted ? (
        <path d="M17 9l5 6m0-6l-5 6" strokeLinecap="round" />
      ) : (
        <path d="M16.5 8.5a5 5 0 010 7M19 6a8.5 8.5 0 010 12" strokeLinecap="round" />
      )}
    </svg>
  );
}

/** Global sound on/off toggle (state lives in SoundContext). */
export default function MuteButton({ className = "" }) {
  const { muted, toggleMute } = useContext(SoundContext);
  const label = muted ? "Unmute sounds" : "Mute sounds";
  return (
    <button
      type="button"
      onClick={toggleMute}
      aria-pressed={muted}
      aria-label={label}
      title={label}
      className={`rounded p-2 text-steel transition hover:bg-silver/10 hover:text-silver ${className}`}
    >
      <SoundIcon muted={muted} />
    </button>
  );
}

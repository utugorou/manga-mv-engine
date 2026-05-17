import { withBasePath } from "../lib/assetPath";

type Props = {
  isPlaying: boolean;
  isRecording: boolean;
  chorusBoost: boolean;
  isMobile?: boolean;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
};

const mobileButtonClass =
  "flex h-10 w-10 items-center justify-center bg-transparent p-0.5 transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-40";

const mobileIconClass = "h-9 w-9 object-contain";

export default function ControlButtons({ isPlaying, isRecording, chorusBoost, isMobile = false, onPlay, onPause, onReset }: Props) {
  if (isMobile) {
    const statusIconClass = "h-8 w-8 object-contain transition duration-200";
    const recordingStateClass = isRecording ? "grayscale-0 opacity-100" : "grayscale opacity-70";
    const chorusStateClass = chorusBoost
      ? "grayscale-0 opacity-100 brightness-110 saturate-150 mobile-bakusou-active"
      : "grayscale opacity-70";

    return (
      <div className="flex w-full items-center justify-between gap-2 pr-0.5">
        <div className="flex items-center gap-1.5">
          <img
            src={withBasePath("/ui/recording_badge_transparent.png")}
            alt={isRecording ? "録画中" : "録画待機"}
            className={`${statusIconClass} ${recordingStateClass}`}
          />
          <img
            src={withBasePath("/ui/bousouchu_bakusouchu_transparent.png")}
            alt={chorusBoost ? "暴走中" : "暴走待機"}
            className={`${statusIconClass} ${chorusStateClass}`}
          />
        </div>
        <div className="ml-auto flex items-center justify-end gap-1">
          <button onClick={onPlay} aria-label="再生" className={mobileButtonClass}>
            <img src={withBasePath("/ui/play_button_graffiti_transparent.png")} alt="" aria-hidden="true" className={mobileIconClass} />
          </button>
          <button onClick={onPause} aria-label="一時停止" className={mobileButtonClass}>
            <img src={withBasePath("/ui/neon_pause_button_TRUE_TRANSPARENT.png")} alt="" aria-hidden="true" className={mobileIconClass} />
          </button>
          <button onClick={onReset} aria-label="最初から" className={mobileButtonClass}>
            <img src={withBasePath("/ui/start_over_hexagon_graffiti_transparent.png")} alt="" aria-hidden="true" className={mobileIconClass} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-fuchsia-500/30 bg-zinc-950/70 p-2.5 sm:gap-3 sm:p-3">
      <button
        onClick={onPlay}
        className={`h-8 w-8 rounded-full border text-xs font-black transition-all sm:h-14 sm:w-14 sm:text-lg ${
          isPlaying
            ? "bg-gradient-to-br from-fuchsia-500 to-pink-500 border-fuchsia-200 shadow-[0_0_24px_#d946ef] text-white"
            : "bg-zinc-900 border-fuchsia-500/70 hover:bg-fuchsia-500/20 text-fuchsia-200"
        }`}
      >
        ▶
      </button>
      <button
        onClick={onPause}
        className="rounded-lg border border-cyan-400/70 bg-zinc-900 px-3 py-1.5 text-[11px] font-bold text-cyan-200 hover:bg-cyan-500/20 sm:rounded-xl sm:px-6 sm:py-2 sm:text-base"
      >
        一時停止
      </button>
      <button
        onClick={onReset}
        className="rounded-lg border border-yellow-300/70 bg-zinc-900 px-3 py-1.5 text-[11px] font-bold text-yellow-100 hover:bg-yellow-400/20 sm:rounded-xl sm:px-6 sm:py-2 sm:text-base"
      >
        最初から
      </button>
    </div>
  );
}

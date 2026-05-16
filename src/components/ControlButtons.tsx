type Props = { isPlaying: boolean; onPlay: () => void; onPause: () => void; onReset: () => void };

export default function ControlButtons({ isPlaying, onPlay, onPause, onReset }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        onClick={onPlay}
        className={`px-6 py-2 rounded-lg font-bold border transition-all ${
          isPlaying
            ? "bg-pink-500/85 border-pink-300 shadow-[0_0_20px_#ec4899] text-white"
            : "bg-zinc-900 border-pink-500/70 hover:bg-pink-500/20 text-pink-200"
        }`}
      >
        {isPlaying ? "再生中" : "再生"}
      </button>
      <button
        onClick={onPause}
        className="px-6 py-2 rounded-lg font-bold border border-cyan-400/70 bg-zinc-900 hover:bg-cyan-500/20 text-cyan-200"
      >
        一時停止
      </button>
      <button
        onClick={onReset}
        className="px-6 py-2 rounded-lg font-bold border border-yellow-300/70 bg-zinc-900 hover:bg-yellow-400/20 text-yellow-100"
      >
        最初から
      </button>
    </div>
  );
}

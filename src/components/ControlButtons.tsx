type Props = { isPlaying: boolean; onPlay: () => void; onPause: () => void; onReset: () => void };

export default function ControlButtons({ isPlaying, onPlay, onPause, onReset }: Props) {
  return <div className="flex gap-3">
    <button onClick={onPlay} className={`px-6 py-2 rounded font-bold ${isPlaying ? "bg-pink-700" : "bg-pink-500 hover:bg-pink-600"}`}>{isPlaying ? "再生中" : "再生"}</button>
    <button onClick={onPause} className="bg-zinc-700 hover:bg-zinc-600 px-6 py-2 rounded font-bold">一時停止</button>
    <button onClick={onReset} className="bg-cyan-700 hover:bg-cyan-600 px-6 py-2 rounded font-bold">最初から</button>
  </div>;
}

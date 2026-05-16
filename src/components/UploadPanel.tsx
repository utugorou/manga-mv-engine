import type { AspectRatio, AudioMood, AudioSourceMode, BackgroundMode, MotionType, PresetName } from "../types/mv";

type UploadPanelProps = {
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleAudioUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleVideoUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  audioName: string;
  videoName: string;
  videoFitMode: "cover" | "contain";
  setVideoFitMode: (mode: "cover" | "contain") => void;
  aspectRatio: AspectRatio;
  formatTime: (time: number) => string;
  audioDuration: number;
  currentTime: number;
  images: string[];
  currentImageIndex: number;
  isPlaying: boolean;
  chorusBoost: boolean;
  activePreset: PresetName | null;
  audioMood: AudioMood;
  imageMotions: MotionType[];
  onSelectImage: (image: string, index: number) => void;
  backgroundMode: BackgroundMode;
  setBackgroundMode: (mode: BackgroundMode) => void;
  audioSourceMode: AudioSourceMode;
  setAudioSourceMode: (mode: AudioSourceMode) => void;
};

export default function UploadPanel(props: UploadPanelProps) {
  const { handleImageUpload, handleAudioUpload, handleVideoUpload, audioName, videoName, videoFitMode, setVideoFitMode, aspectRatio, formatTime, audioDuration, currentTime, images, currentImageIndex, isPlaying, chorusBoost, activePreset, audioMood, imageMotions, onSelectImage, backgroundMode, setBackgroundMode, audioSourceMode, setAudioSourceMode } = props;
  const getMotionLabel = (motion?: MotionType) => {
    const labels: Record<MotionType, string> = { zoomIn: "ズームイン", zoomOut: "ズームアウト", panLeft: "左パン", panRight: "右パン", shake: "シェイク", comic: "漫画揺れ", panUp: "上パン", panDown: "下パン", diagonalPan: "斜めパン", slowZoomIn: "ゆっくりズームイン", breathZoom: "呼吸ズーム", impactZoom: "インパクトズーム", glitchJump: "グリッチジャンプ", grooveBounce: "グルーヴバウンス", sideGroove: "横ノリ", handheld: "手持ちカメラ風" };
    return motion ? labels[motion] : "ズームイン";
  };

  return (
    <div className="h-full rounded-2xl border border-fuchsia-500/30 bg-zinc-950/90 p-4 overflow-y-auto space-y-4">
      <h2 className="text-lg font-black text-fuchsia-300">素材マネージャー</h2>
      <div className="rounded-xl border border-zinc-700 bg-zinc-900/80 p-3 text-xs space-y-2">
        <p className="text-zinc-200 font-bold">背景モード</p>
        <div className="grid grid-cols-3 gap-2">
          <button onClick={() => setBackgroundMode("none")} className={`rounded-lg px-2 py-1 ${backgroundMode === "none" ? "bg-zinc-200 text-zinc-900" : "bg-zinc-800 text-zinc-300 border border-zinc-600"}`}>背景なし</button>
          <button onClick={() => setBackgroundMode("video")} className={`rounded-lg px-2 py-1 ${backgroundMode === "video" ? "bg-green-500/40 text-green-100 border border-green-300/80" : "bg-zinc-800 text-zinc-300 border border-zinc-600"}`}>動画背景</button>
          <button onClick={() => setBackgroundMode("image")} className={`rounded-lg px-2 py-1 ${backgroundMode === "image" ? "bg-fuchsia-500/40 text-fuchsia-100 border border-fuchsia-300/80" : "bg-zinc-800 text-zinc-300 border border-zinc-600"}`}>画像背景</button>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-700 bg-zinc-900/80 p-3 text-xs space-y-2">
        <p className="text-zinc-200 font-bold">音声ソース</p>
        <div className="grid grid-cols-1 gap-2">
          <button onClick={() => setAudioSourceMode("bgm")} className={`rounded-lg px-2 py-1 text-left ${audioSourceMode === "bgm" ? "bg-cyan-500/30 text-cyan-100 border border-cyan-300/80" : "bg-zinc-800 text-zinc-300 border border-zinc-600"}`}>BGMを使う</button>
          <button disabled={backgroundMode !== "video"} onClick={() => setAudioSourceMode("video")} className={`rounded-lg px-2 py-1 text-left ${audioSourceMode === "video" ? "bg-green-500/30 text-green-100 border border-green-300/80" : "bg-zinc-800 text-zinc-300 border border-zinc-600"} disabled:cursor-not-allowed disabled:opacity-40`}>動画音声を使う</button>
          <button onClick={() => setAudioSourceMode("silent")} className={`rounded-lg px-2 py-1 text-left ${audioSourceMode === "silent" ? "bg-zinc-200 text-zinc-900" : "bg-zinc-800 text-zinc-300 border border-zinc-600"}`}>無音で録画する</button>
        </div>
      </div>

      <label className={`block ${backgroundMode === "video" ? "scale-[1.01]" : "opacity-70"}`}><p className="mb-1 text-xs text-green-300">動画アップロード (MP4 / WebM)</p><div className="w-full cursor-pointer rounded-xl border border-green-400/70 bg-green-500/15 p-2 text-center text-sm font-bold text-green-100 hover:bg-green-500/30">動画アップロード</div><input type="file" accept="video/mp4,video/webm" className="hidden" onChange={handleVideoUpload} /></label>
      <label className={`block ${backgroundMode === "image" ? "scale-[1.01]" : "opacity-70"}`}><p className="mb-1 text-xs text-fuchsia-300">画像アップロード</p><div className="w-full cursor-pointer rounded-xl border border-fuchsia-400/70 bg-fuchsia-500/15 p-2 text-center text-sm font-bold text-fuchsia-100 hover:bg-fuchsia-500/30">画像アップロード</div><input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} /></label>
      <label className="block"><p className="mb-1 text-xs text-cyan-300">BGMアップロード</p><div className="w-full cursor-pointer rounded-xl border border-cyan-400/70 bg-cyan-500/15 p-2 text-center text-sm font-bold text-cyan-100 hover:bg-cyan-500/30">音楽アップロード</div><input type="file" accept="audio/*" className="hidden" onChange={handleAudioUpload} /></label>

      <div className="rounded-xl border border-zinc-700 bg-zinc-900/80 p-3 text-xs space-y-1">
        <div className="text-cyan-200 break-all">🎧 {audioName || "未選択"}</div>
        <div className="text-green-200 break-all">🎬 {videoName || "未選択"}</div>
        <div className="text-zinc-300">尺：{formatTime(currentTime)} / {formatTime(audioDuration)}</div>
        <div className="text-zinc-400">画角：{aspectRatio} / 画像 {images.length}枚</div>
        <div className="text-yellow-300">背景：{backgroundMode === "none" ? "背景なし" : backgroundMode === "video" ? "動画背景" : "画像背景"}</div>
        <div className="text-yellow-300">音声：{audioSourceMode === "bgm" ? "BGM" : audioSourceMode === "video" ? "動画音声" : "無音"}</div>
        <div className={isPlaying ? "text-fuchsia-300" : "text-zinc-500"}>再生：{isPlaying ? "ON" : "OFF"}</div>
        <div className={chorusBoost ? "text-pink-300" : "text-zinc-500"}>サビ暴走：{chorusBoost ? "ON" : "OFF"}</div>
        <div className="text-cyan-300">プリセット：{activePreset ?? "手動設定"}</div>
        <div className="text-fuchsia-300">文字状態：{audioMood}</div>
      </div>

      {backgroundMode === "video" && <div className="rounded-xl border border-zinc-700 bg-zinc-900/80 p-3 text-xs space-y-2"><p className="text-zinc-300 font-bold">動画の表示モード</p><div className="grid grid-cols-2 gap-2"><button onClick={() => setVideoFitMode("cover")} className={`rounded-lg px-2 py-1 ${videoFitMode === "cover" ? "bg-green-500/30 text-green-100 border border-green-300/70" : "bg-zinc-800 text-zinc-300 border border-zinc-600"}`}>cover</button><button onClick={() => setVideoFitMode("contain")} className={`rounded-lg px-2 py-1 ${videoFitMode === "contain" ? "bg-green-500/30 text-green-100 border border-green-300/70" : "bg-zinc-800 text-zinc-300 border border-zinc-600"}`}>contain</button></div></div>}

      <p className="text-xs font-bold text-zinc-300">画像サムネイル</p>
      <div className="grid grid-cols-2 gap-2">
        {images.map((image, index) => (
          <button key={index} className={`rounded-xl border p-1 text-left ${currentImageIndex === index ? "border-fuchsia-300 shadow-[0_0_14px_#d946ef]" : "border-zinc-700"}`} onClick={() => onSelectImage(image, index)}>
            <img src={image} alt="" className="h-20 w-full rounded-lg object-cover" />
            <p className="mt-1 text-[10px] text-zinc-400">#{index + 1} / {getMotionLabel(imageMotions[index])}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

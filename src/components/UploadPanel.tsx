import type {
  AspectRatio,
  AudioMood,
  MotionType,
  PresetName,
} from "../types/mv";

type UploadPanelProps = {
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleAudioUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  audioName: string;
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
};

export default function UploadPanel({
  handleImageUpload,
  handleAudioUpload,
  audioName,
  aspectRatio,
  formatTime,
  audioDuration,
  currentTime,
  images,
  currentImageIndex,
  isPlaying,
  chorusBoost,
  activePreset,
  audioMood,
  imageMotions,
  onSelectImage,
}: UploadPanelProps) {
  const getMotionLabel = (motion?: MotionType) => {
    const labels: Record<MotionType, string> = {
      zoomIn: "ズームイン",
      zoomOut: "ズームアウト",
      panLeft: "左パン",
      panRight: "右パン",
      shake: "シェイク",
      comic: "漫画揺れ",
      panUp: "上パン",
      panDown: "下パン",
      diagonalPan: "斜めパン",
      slowZoomIn: "ゆっくりズームイン",
      breathZoom: "呼吸ズーム",
      impactZoom: "インパクトズーム",
      glitchJump: "グリッチジャンプ",
      grooveBounce: "グルーヴバウンス",
      sideGroove: "横ノリ",
      handheld: "手持ちカメラ風",
    };
    if (!motion) return "ズームイン";
    return labels[motion];
  };

  return (
    <div className="h-full rounded-2xl border border-pink-500/30 bg-zinc-950/90 p-4 overflow-y-auto">
      <h2 className="mb-3 text-lg font-black text-pink-300">素材</h2>

      <label className="mb-3 block">
        <div className="w-full cursor-pointer rounded-lg border border-pink-400/70 bg-pink-500/20 p-2 text-center text-sm font-bold text-pink-100 hover:bg-pink-500/35">画像アップロード</div>
        <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
      </label>

      <label className="mb-4 block">
        <div className="w-full cursor-pointer rounded-lg border border-cyan-400/70 bg-cyan-500/20 p-2 text-center text-sm font-bold text-cyan-100 hover:bg-cyan-500/35">音楽アップロード</div>
        <input type="file" accept="audio/*" className="hidden" onChange={handleAudioUpload} />
      </label>

      <div className="mb-4 space-y-1 text-xs">
        <div className="text-cyan-300 break-all">現在の音楽名：{audioName || "未選択"}</div>
        <div className="text-zinc-400">画像枚数：{images.length}枚</div>
        <div className="text-zinc-400">画角：{aspectRatio}</div>
        <div className="text-zinc-400">再生位置：{formatTime(currentTime)} / {formatTime(audioDuration)}</div>
        <div className={`${isPlaying ? "text-pink-300" : "text-zinc-500"}`}>再生：{isPlaying ? "ON" : "OFF"}</div>
        <div className={`${chorusBoost ? "text-yellow-300" : "text-zinc-500"}`}>サビ暴走：{chorusBoost ? "ON" : "OFF"}</div>
        <div className="text-cyan-300">プリセット：{activePreset ?? "手動設定"}</div>
        <div className="text-pink-300">文字状態：{audioMood}</div>
      </div>

      <p className="mb-2 text-xs font-bold text-zinc-300">サムネイル一覧</p>
      <div className="space-y-2">
        {images.map((image, index) => (
          <button key={index} className={`block w-full text-left rounded-lg border p-1 ${currentImageIndex === index ? "border-yellow-300 shadow-[0_0_14px_#facc15]" : "border-zinc-700"}`} onClick={() => onSelectImage(image, index)}>
            <img src={image} alt="" className="h-24 w-full rounded object-cover" />
            <p className="mt-1 text-xs text-zinc-400">#{index + 1} / {getMotionLabel(imageMotions[index])}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

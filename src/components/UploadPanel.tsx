import type { AspectRatio, AudioMood, MotionType, PresetName } from "../types/mv";

type UploadPanelProps = {
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleAudioUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  audioName: string;
  audioUploadError: string;
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

type FileUploadButtonProps = {
  label: string;
  buttonText: string;
  inputId: string;
  accept: string;
  multiple?: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  tone: "cyan" | "fuchsia";
};

function FileUploadButton(props: FileUploadButtonProps) {
  const { label, buttonText, inputId, accept, multiple = false, onChange, tone } = props;
  const toneClasses = tone === "cyan"
    ? "border-cyan-400/70 bg-cyan-500/15 text-cyan-100"
    : "border-fuchsia-400/70 bg-fuchsia-500/15 text-fuchsia-100";

  return (
    <div className="block">
      <p className={`mb-1 text-xs ${tone === "cyan" ? "text-cyan-300" : "text-fuchsia-300"}`}>{label}</p>
      <label htmlFor={inputId} className={`relative flex min-h-11 w-full cursor-pointer items-center justify-center rounded-xl border p-2 text-center text-sm font-bold ${toneClasses} active:scale-[0.99]`}>
        <span>{buttonText}</span>
        <input
          id={inputId}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={onChange}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
      </label>
    </div>
  );
}

export default function UploadPanel(props: UploadPanelProps) {
  const { handleImageUpload, handleAudioUpload, audioName, audioUploadError, aspectRatio, formatTime, audioDuration, currentTime, images, currentImageIndex, isPlaying, chorusBoost, activePreset, audioMood, imageMotions, onSelectImage } = props;
  const audioInputId = "bgm-upload-input";
  const imageInputId = "image-upload-input";
  const getMotionLabel = (motion?: MotionType) => {
    const labels: Record<MotionType, string> = { zoomIn: "ズームイン", zoomOut: "ズームアウト", panLeft: "左パン", panRight: "右パン", shake: "シェイク", comic: "漫画揺れ", panUp: "上パン", panDown: "下パン", diagonalPan: "斜めパン", slowZoomIn: "ゆっくりズームイン", breathZoom: "呼吸ズーム", impactZoom: "インパクトズーム", glitchJump: "グリッチジャンプ", grooveBounce: "グルーヴバウンス", sideGroove: "横ノリ", handheld: "手持ちカメラ風" };
    return motion ? labels[motion] : "ズームイン";
  };

  return (<div className="relative z-20 h-full rounded-2xl border border-fuchsia-500/30 bg-zinc-950/90 p-4 overflow-y-auto space-y-4">
    <h2 className="text-lg font-black text-fuchsia-300">1. 素材</h2>
    <FileUploadButton label="BGMアップロード" buttonText="音楽アップロード" inputId={audioInputId} accept="audio/*,.mp3,.wav,.m4a,.aac,.ogg,.webm" onChange={handleAudioUpload} tone="cyan" />
    <FileUploadButton label="背景画像アップロード" buttonText="画像アップロード" inputId={imageInputId} accept="image/*" multiple onChange={handleImageUpload} tone="fuchsia" />
    {audioUploadError ? <p className="rounded-xl border border-red-300/40 bg-red-500/15 p-2 text-xs font-bold text-red-200">{audioUploadError}</p> : null}

    <div className="rounded-xl border border-zinc-700 bg-zinc-900/80 p-3 text-xs space-y-1">
      <div className="text-cyan-200 break-all">🎧 {audioName || "BGMをアップロードしてください"}</div>
      <div className={audioName ? "text-emerald-300" : "text-zinc-500"}>{audioName ? "BGM設定済み" : "BGM未設定"}</div>
      <div className="text-zinc-300">尺：{formatTime(currentTime)} / {formatTime(audioDuration)}</div>
      <div className="text-zinc-400">画角：{aspectRatio} / 画像 {images.length}枚</div>
      <div className={isPlaying ? "text-fuchsia-300" : "text-zinc-500"}>再生：{isPlaying ? "ON" : "OFF"}</div>
      <div className={chorusBoost ? "text-pink-300" : "text-zinc-500"}>サビ暴走：{chorusBoost ? "ON" : "OFF"}</div>
      <div className="text-cyan-300">プリセット：{activePreset ?? "手動設定"}</div>
      <div className="text-fuchsia-300">文字状態：{audioMood}</div>
    </div>

    <p className="text-xs font-bold text-zinc-300">画像サムネイル</p>
    <div className="grid grid-cols-2 gap-2">{images.map((image, index) => (<button key={index} className={`rounded-xl border p-1 text-left ${currentImageIndex === index ? "border-fuchsia-300 shadow-[0_0_14px_#d946ef]" : "border-zinc-700"}`} onClick={() => onSelectImage(image, index)}><img src={image} alt="" className="h-20 w-full rounded-lg object-cover" /><p className="mt-1 text-[10px] text-zinc-400">#{index + 1} / {getMotionLabel(imageMotions[index])}</p></button>))}</div>
  </div>);
}

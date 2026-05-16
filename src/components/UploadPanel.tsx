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
  return (
    <div className="w-64 border-r border-purple-500 p-4 overflow-y-auto">
      <h2 className="text-xl font-bold mb-4 text-pink-400">Manga MV Engine</h2>

      <label className="block mb-3">
        <div className="w-full bg-pink-500 hover:bg-pink-600 p-2 rounded text-center cursor-pointer">
          画像アップロード
        </div>

        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleImageUpload}
        />
      </label>

      <label className="block mb-4">
        <div className="w-full bg-cyan-500 hover:bg-cyan-600 p-2 rounded text-center cursor-pointer">
          音楽アップロード
        </div>

        <input
          type="file"
          accept="audio/*"
          className="hidden"
          onChange={handleAudioUpload}
        />
      </label>

      {audioName && <div className="mb-2 text-xs text-cyan-300 break-all">音楽：{audioName}</div>}

      <div className="text-xs text-zinc-400 mb-2">画角：{aspectRatio}</div>
      <div className="text-xs text-zinc-400 mb-2">長さ：{formatTime(audioDuration)}</div>
      <div className="text-xs text-zinc-400 mb-2">
        再生位置：{formatTime(currentTime)} / {formatTime(audioDuration)}
      </div>

      <div className="text-xs text-zinc-400 mb-3">
        画像：{images.length > 0 ? currentImageIndex + 1 : 0} / {images.length}
      </div>

      <div className={`text-xs mb-2 font-bold ${isPlaying ? "text-pink-400" : "text-zinc-500"}`}>
        状態：{isPlaying ? "再生中" : "停止中"}
      </div>

      <div className={`text-xs mb-2 font-bold ${chorusBoost ? "text-yellow-300" : "text-zinc-500"}`}>
        サビ暴走：{chorusBoost ? "発動中" : "待機中"}
      </div>

      <div className="text-xs mb-2 text-cyan-300">プリセット：{activePreset ?? "手動設定"}</div>
      <div className="text-xs mb-3 text-pink-300">文字状態：{audioMood}</div>

      <div className="space-y-2">
        {images.map((image, index) => (
          <div key={index}>
            <img
              src={image}
              alt=""
              className={`w-full h-24 object-cover rounded cursor-pointer border ${
                currentImageIndex === index ? "border-pink-500" : "border-zinc-700"
              }`}
              onClick={() => onSelectImage(image, index)}
            />

            <p className="text-xs text-zinc-400 mt-1">{imageMotions[index]}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

import EffectOverlays from "./EffectOverlays";

type PositionType = "topLeft" | "topRight" | "bottomLeft" | "bottomRight" | "center";
type PanelPattern = "classic" | "vertical" | "horizontal" | "diagonal" | "action";

type PreviewStageProps = {
  previewSizeClass: string;
  chorusBoost: boolean;
  showGlitch: boolean;
  selectedImage: string | null;
  isPlaying: boolean;
  isRecording: boolean;
  getMotionStyle: () => string;
  showPanels: boolean;
  panelBurst: boolean;
  panelPattern: PanelPattern;
  showEqualizer: boolean;
  eqBars: number[];
  showSfx: boolean;
  sfxPosition: PositionType;
  sfxText: string;
  sfxScale: number;
  getPositionClass: (position: PositionType) => string;
  showBubble: boolean;
  bubblePosition: PositionType;
  bubbleText: string;
  flashActive: boolean;
};

export default function PreviewStage(props: PreviewStageProps) {
  const { previewSizeClass, chorusBoost, showGlitch, selectedImage, isPlaying, isRecording, getMotionStyle } = props;

  return (
    <div className="relative flex w-full items-center justify-center">
      <div className="absolute left-2 top-2 z-20 flex gap-2 text-xs font-bold">
        <span className={`rounded-full border px-3 py-1 ${isPlaying ? "border-fuchsia-300 bg-fuchsia-500/30 text-fuchsia-100 shadow-[0_0_14px_#ec4899]" : "border-zinc-600 bg-zinc-900 text-zinc-400"}`}>再生中</span>
        <span className={`rounded-full border px-3 py-1 ${isRecording ? "border-rose-300 bg-rose-500/30 text-rose-100 shadow-[0_0_14px_#f43f5e]" : "border-zinc-600 bg-zinc-900 text-zinc-400"}`}>録画中</span>
        <span className={`rounded-full border px-3 py-1 ${chorusBoost ? "border-yellow-200 bg-yellow-400/30 text-yellow-100 shadow-[0_0_14px_#facc15]" : "border-zinc-600 bg-zinc-900 text-zinc-400"}`}>サビ暴走中</span>
      </div>

      <div className={`${previewSizeClass} mt-10 bg-zinc-900 border-2 border-cyan-300/80 rounded-2xl relative overflow-hidden flex items-center justify-center transition-all duration-150 shadow-[0_0_40px_rgba(34,211,238,0.2)] ${chorusBoost ? "shadow-[0_0_70px_#ec4899] scale-[1.02]" : showGlitch ? "shadow-[0_0_40px_#ec4899]" : ""}`}>
        {selectedImage ? (
          <img src={selectedImage} alt="" className={`w-full h-full object-cover ${showGlitch || chorusBoost ? "contrast-125 saturate-150" : ""}`} style={{ animation: isPlaying ? getMotionStyle() : "none" }} />
        ) : (
          <p className="text-3xl text-fuchsia-400">MV Preview</p>
        )}
        <EffectOverlays {...props} selectedImage={selectedImage} isPlaying={isPlaying} />
      </div>
    </div>
  );
}

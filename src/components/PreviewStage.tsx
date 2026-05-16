import EffectOverlays from "./EffectOverlays";

type PositionType =
  | "topLeft"
  | "topRight"
  | "bottomLeft"
  | "bottomRight"
  | "center";

type PanelPattern =
  | "classic"
  | "vertical"
  | "horizontal"
  | "diagonal"
  | "action";

type PreviewStageProps = {
  previewSizeClass: string;
  chorusBoost: boolean;
  showGlitch: boolean;
  selectedImage: string | null;
  isPlaying: boolean;
  getMotionStyle: () => string;
  showPanels: boolean;
  panelBurst: boolean;
  panelPattern: PanelPattern;
  showEqualizer: boolean;
  eqBars: number[];
  showSfx: boolean;
  sfxPosition: PositionType;
  sfxText: string;
  getPositionClass: (position: PositionType) => string;
  showBubble: boolean;
  bubblePosition: PositionType;
  bubbleText: string;
  flashActive: boolean;
};

export default function PreviewStage(props: PreviewStageProps) {
  const {
    previewSizeClass,
    chorusBoost,
    showGlitch,
    selectedImage,
    isPlaying,
    getMotionStyle,
  } = props;

  return (
    <div
      className={`${previewSizeClass} bg-zinc-900 border border-pink-500 rounded-xl relative overflow-hidden flex items-center justify-center transition-all duration-150 ${
        chorusBoost
          ? "shadow-[0_0_70px_#ec4899] scale-[1.02]"
          : showGlitch
          ? "shadow-[0_0_30px_#ec4899]"
          : ""
      }`}
    >
      {selectedImage ? (
        <img
          src={selectedImage}
          alt=""
          className={`w-full h-full object-cover ${
            showGlitch || chorusBoost ? "contrast-125 saturate-150" : ""
          }`}
          style={{ animation: isPlaying ? getMotionStyle() : "none" }}
        />
      ) : (
        <p className="text-3xl text-pink-400">MV Preview</p>
      )}

      <EffectOverlays {...props} selectedImage={selectedImage} isPlaying={isPlaying} />
    </div>
  );
}

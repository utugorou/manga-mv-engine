import EffectOverlays from "./EffectOverlays";
import type { SfxItem } from "../types/mv";
import type { EqualizerType } from "../types/mv";
import type { BubbleVariant } from "../types/mv";
import type { CSSProperties } from "react";

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
  getMotionAmplitude: () => number;
  showPanels: boolean;
  panelBurst: boolean;
  panelPattern: PanelPattern;
  showEqualizer: boolean;
  eqBars: number[];
  equalizerType: EqualizerType;
  showSfx: boolean;
  sfxItems: SfxItem[];
  sfxPosition: PositionType;
  sfxText: string;
  sfxScale: number;
  getPositionClass: (position: PositionType) => string;
  showBubble: boolean;
  bubblePosition: PositionType;
  bubbleText: string;
  bubbleVariant: BubbleVariant;
  bubbleScale: 1 | 2;
  flashActive: boolean;
  showStatusOverlay?: boolean;
};

export default function PreviewStage(props: PreviewStageProps) {
  const { previewSizeClass, chorusBoost, showGlitch, selectedImage, isPlaying, isRecording, getMotionStyle, getMotionAmplitude, showStatusOverlay = true } = props;

  const imageStyle = { animation: isPlaying ? getMotionStyle() : "none", ["--motion-amp"]: String(getMotionAmplitude()) } as CSSProperties;
  return (
    <div className="relative flex w-full items-center justify-center">
      {showStatusOverlay ? (
        <div className="absolute left-2 top-2 z-20 flex gap-2 text-xs font-bold">
          {isPlaying ? <span className="rounded-full border border-fuchsia-300 bg-fuchsia-500/30 px-3 py-1 text-fuchsia-100 shadow-[0_0_14px_#ec4899]">再生中</span> : null}
          {isRecording ? <span className="rounded-full border border-rose-300 bg-rose-500/30 px-3 py-1 text-rose-100 shadow-[0_0_14px_#f43f5e]">録画中</span> : null}
          {chorusBoost ? <span className="rounded-full border border-yellow-200 bg-yellow-400/30 px-3 py-1 text-yellow-100 shadow-[0_0_14px_#facc15]">サビ暴走中</span> : null}
        </div>
      ) : null}

      <div className={`${previewSizeClass} mt-2 md:mt-10 bg-zinc-900 border-2 border-cyan-300/80 rounded-xl md:rounded-2xl relative overflow-hidden flex items-center justify-center transition-all duration-150 shadow-[0_0_30px_rgba(34,211,238,0.18)] md:shadow-[0_0_40px_rgba(34,211,238,0.2)] ${chorusBoost ? "shadow-[0_0_55px_#ec4899] scale-[1.015] md:shadow-[0_0_70px_#ec4899] md:scale-[1.02]" : showGlitch ? "shadow-[0_0_36px_#ec4899] md:shadow-[0_0_40px_#ec4899]" : ""}`}>
        {selectedImage ? (
          <img src={selectedImage} alt="" className={`w-full h-full object-cover ${showGlitch || chorusBoost ? "contrast-125 saturate-150" : ""}`} style={imageStyle} />
        ) : (
          <div className="text-center"><p className="text-2xl text-fuchsia-300 font-black">背景画像をアップロードしてください</p><p className="text-sm text-zinc-400 mt-2">デフォルト背景を表示中</p></div>
        )}
        <EffectOverlays {...props} selectedImage={selectedImage} isPlaying={isPlaying} />
      </div>
    </div>
  );
}

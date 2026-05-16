import type { CSSProperties } from "react";

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

type EffectOverlaysProps = {
  selectedImage: string | null;
  showPanels: boolean;
  panelBurst: boolean;
  panelPattern: PanelPattern;
  chorusBoost: boolean;
  isPlaying: boolean;
  showGlitch: boolean;
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

export default function EffectOverlays({
  selectedImage,
  showPanels,
  panelBurst,
  panelPattern,
  chorusBoost,
  isPlaying,
  showGlitch,
  showEqualizer,
  eqBars,
  showSfx,
  sfxPosition,
  sfxText,
  getPositionClass,
  showBubble,
  bubblePosition,
  bubbleText,
  flashActive,
}: EffectOverlaysProps) {
  const playOrNone = (animation: string): CSSProperties => ({
    animation: isPlaying ? animation : "none",
  });

  return (
    <>
      {showPanels && selectedImage && (
        <div
          className={`absolute inset-0 pointer-events-none ${
            panelBurst ? "opacity-100" : "opacity-70"
          }`}
          style={{
            animation:
              isPlaying && panelBurst ? "panelBurstAnim 0.26s ease-out" : "none",
          }}
        >
          <div className="absolute inset-0 border-[10px] border-black/70" />

          {panelPattern === "classic" && (
            <>
              <div className="absolute top-0 left-[34%] w-[10px] h-full bg-black/80 rotate-[8deg]" />
              <div className="absolute top-[48%] left-0 w-full h-[9px] bg-black/75 rotate-[-4deg]" />
              <div className="absolute top-0 right-[18%] w-[7px] h-full bg-black/55 rotate-[-12deg]" />
            </>
          )}

          {panelPattern === "vertical" && (
            <>
              <div className="absolute top-0 left-[28%] w-[12px] h-full bg-black/85 rotate-[2deg]" />
              <div className="absolute top-0 left-[62%] w-[10px] h-full bg-black/80 rotate-[-3deg]" />
              <div className="absolute top-0 left-[82%] w-[7px] h-full bg-black/60 rotate-[5deg]" />
            </>
          )}

          {panelPattern === "horizontal" && (
            <>
              <div className="absolute top-[28%] left-0 w-full h-[11px] bg-black/85 rotate-[-2deg]" />
              <div className="absolute top-[63%] left-0 w-full h-[10px] bg-black/80 rotate-[3deg]" />
              <div className="absolute top-[82%] left-0 w-full h-[7px] bg-black/60 rotate-[-1deg]" />
            </>
          )}

          {panelPattern === "diagonal" && (
            <>
              <div className="absolute top-[15%] left-[-10%] w-[120%] h-[12px] bg-black/85 rotate-[18deg]" />
              <div className="absolute top-[55%] left-[-10%] w-[120%] h-[10px] bg-black/75 rotate-[-14deg]" />
              <div className="absolute top-0 left-[45%] w-[9px] h-full bg-black/70 rotate-[20deg]" />
            </>
          )}

          {panelPattern === "action" && (
            <>
              <div className="absolute top-[8%] left-[-10%] w-[120%] h-[9px] bg-black/90 rotate-[8deg]" />
              <div className="absolute top-[30%] left-[-10%] w-[120%] h-[8px] bg-black/80 rotate-[-12deg]" />
              <div className="absolute top-[55%] left-[-10%] w-[120%] h-[11px] bg-black/90 rotate-[16deg]" />
              <div className="absolute top-[76%] left-[-10%] w-[120%] h-[7px] bg-black/75 rotate-[-7deg]" />
              <div className="absolute top-0 left-[18%] w-[8px] h-full bg-black/70 rotate-[-18deg]" />
              <div className="absolute top-0 right-[22%] w-[8px] h-full bg-black/70 rotate-[14deg]" />
            </>
          )}

          {chorusBoost && (
            <>
              <div className="absolute top-[18%] left-0 w-full h-[5px] bg-white/30 rotate-[2deg]" />
              <div className="absolute bottom-[22%] left-0 w-full h-[5px] bg-pink-400/30 rotate-[-2deg]" />
            </>
          )}
        </div>
      )}

      {showGlitch && (
        <>
          <div className="absolute inset-0 bg-cyan-400/10 mix-blend-screen" style={playOrNone("glitchMove 0.35s steps(2) infinite")} />
          <div className="absolute inset-0 bg-pink-500/10 mix-blend-screen" style={playOrNone("glitchMove 0.25s steps(2) infinite reverse")} />
          <div className="absolute top-16 left-0 w-full h-2 bg-white/30" style={playOrNone("glitchLine 0.8s linear infinite")} />
          <div className="absolute top-44 left-0 w-full h-1 bg-cyan-300/50" style={playOrNone("glitchLine 1.1s linear infinite")} />
          <div className="absolute bottom-24 left-0 w-full h-2 bg-pink-400/40" style={playOrNone("glitchLine 0.65s linear infinite")} />
        </>
      )}

      {showEqualizer && (
        <div
          className={`absolute bottom-4 right-4 flex items-end gap-1 ${
            chorusBoost ? "h-32 scale-125" : "h-24"
          } transition-all duration-150`}
        >
          {eqBars.map((height, index) => (
            <div
              key={index}
              className="w-3 origin-bottom rounded-t bg-cyan-300 shadow-[0_0_12px_#22d3ee]"
              style={{
                height: `${height}px`,
                animation: isPlaying ? `eqMove ${0.3 + index * 0.05}s infinite` : "none",
              }}
            />
          ))}
        </div>
      )}

      {showSfx && (
        <div
          className={`absolute ${getPositionClass(sfxPosition)} ${
            chorusBoost ? "text-7xl" : "text-5xl"
          } font-black text-white drop-shadow-[0_0_10px_#ec4899]`}
          style={playOrNone("sfxShake 0.45s ease-in-out infinite")}
        >
          {sfxText}
        </div>
      )}

      {showBubble && (
        <div
          className={`absolute ${getPositionClass(
            bubblePosition
          )} bg-white text-black px-6 py-4 rounded-full border-4 border-black max-w-[260px] text-center font-bold`}
          style={playOrNone("bubbleFloat 1.4s ease-in-out infinite")}
        >
          {bubbleText}
        </div>
      )}

      {flashActive && (
        <div
          className="absolute inset-0 bg-white pointer-events-none z-50"
          style={{ animation: `flashAnim ${chorusBoost ? "0.18s" : "0.12s"} ease-out` }}
        />
      )}
    </>
  );
}

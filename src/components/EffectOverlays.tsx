import type { CSSProperties } from "react";
import type { SfxItem } from "../types/mv";
import type { EqualizerType } from "../types/mv";
import type { BubbleVariant } from "../types/mv";

type PositionType =
  | "topLeft"
  | "topRight"
  | "bottomLeft"
  | "bottomRight"
  | "center";

type PanelPattern =
  | "full"
  | "split-horizontal"
  | "split-vertical"
  | "triple-vertical"
  | "triple-horizontal"
  | "big-plus-small"
  | "diagonal"
  | "four-panel"
  | "center-focus"
  | "battle-break";

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
  equalizerType: EqualizerType;
  showSfx: boolean;
  sfxItems: SfxItem[];
  getPositionClass: (position: PositionType) => string;
  showBubble: boolean;
  bubblePosition: PositionType;
  bubbleText: string;
  bubbleVariant: BubbleVariant;
  bubbleScale: 1 | 2;
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
  equalizerType,
  showSfx,
  sfxItems,
  getPositionClass,
  showBubble,
  bubblePosition,
  bubbleText,
  bubbleVariant,
  bubbleScale,
  flashActive,
}: EffectOverlaysProps) {
  const playOrNone = (animation: string): CSSProperties => ({
    animation: isPlaying ? animation : "none",
  });
  const minSide = selectedImage ? 405 : 360;
  const baseSize = chorusBoost ? 64 : 48;
  const maxFontSize = minSide * 0.4;
  const normalizedSfxItems = sfxItems.slice(0, 4);
  const unifiedSfxText = normalizedSfxItems[0]?.text ?? "";
  const unifiedSfxScale = normalizedSfxItems[0]?.scale ?? 1;
  const getSfxPositionClass = (position: SfxItem["position"]) => {
    const map: Record<SfxItem["position"], PositionType> = {
      topLeft: "topLeft",
      top: "topLeft",
      topRight: "topRight",
      left: "bottomLeft",
      center: "center",
      right: "bottomRight",
      bottomLeft: "bottomLeft",
      bottom: "bottomRight",
      bottomRight: "bottomRight",
      random: "center",
    };
    return getPositionClass(map[position]);
  };

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

          {panelPattern === "split-vertical" && <div className="absolute top-0 left-1/2 w-[10px] h-full -translate-x-1/2 bg-black/80" />}
          {panelPattern === "split-horizontal" && <div className="absolute left-0 top-1/2 h-[10px] w-full -translate-y-1/2 bg-black/80" />}
          {panelPattern === "triple-vertical" && <><div className="absolute top-0 left-1/3 w-[9px] h-full bg-black/80" /><div className="absolute top-0 left-2/3 w-[9px] h-full bg-black/80" /></>}
          {panelPattern === "triple-horizontal" && <><div className="absolute top-1/3 left-0 w-full h-[9px] bg-black/80" /><div className="absolute top-2/3 left-0 w-full h-[9px] bg-black/80" /></>}
          {panelPattern === "big-plus-small" && <><div className="absolute top-0 left-[62%] w-[10px] h-full bg-black/85" /><div className="absolute top-1/2 left-[62%] w-[38%] h-[10px] -translate-y-1/2 bg-black/85" /></>}
          {panelPattern === "diagonal" && <><div className="absolute top-[16%] left-[-10%] w-[120%] h-[10px] bg-black/85 rotate-[18deg]" /><div className="absolute top-[55%] left-[-10%] w-[120%] h-[10px] bg-black/75 rotate-[-15deg]" /></>}
          {panelPattern === "four-panel" && <><div className="absolute top-0 left-1/2 w-[9px] h-full -translate-x-1/2 bg-black/80" /><div className="absolute left-0 top-1/2 h-[9px] w-full -translate-y-1/2 bg-black/80" /></>}
          {panelPattern === "center-focus" && <><div className="absolute top-[18%] left-[18%] w-[64%] h-[64%] border-[9px] border-black/80" /><div className="absolute top-0 left-[50%] w-[8px] h-[18%] -translate-x-1/2 bg-black/65" /><div className="absolute bottom-0 left-[50%] w-[8px] h-[18%] -translate-x-1/2 bg-black/65" /></>}
          {panelPattern === "battle-break" && <><div className="absolute top-[8%] left-[-10%] w-[120%] h-[9px] bg-black/90 rotate-[11deg]" /><div className="absolute top-[35%] left-[-10%] w-[120%] h-[8px] bg-black/80 rotate-[-10deg]" /><div className="absolute top-[62%] left-[-10%] w-[120%] h-[10px] bg-black/90 rotate-[16deg]" /><div className="absolute top-0 left-[22%] w-[7px] h-full bg-black/75 rotate-[-17deg]" /></>}

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
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {equalizerType === "wave" ? (
            <svg className="absolute bottom-0 left-0 h-[22%] w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <polyline fill="none" stroke="rgba(34,211,238,0.88)" strokeWidth="4" points={eqBars.map((v, i) => `${(i / Math.max(1, eqBars.length - 1)) * 100},${50 - (v / 100) * 38}`).join(" ")} />
            </svg>
          ) : null}
          <div className={`absolute inset-x-0 bottom-0 ${equalizerType === "mirror" ? "h-[24%] items-center" : "h-[20%] items-end"} flex gap-[0.35vw] px-[1.2%] transition-all duration-150 bg-gradient-to-t from-black/35 via-black/15 to-transparent`}>
          {eqBars.map((height, index) => (
            <div
              key={index}
              className={`origin-bottom rounded-t ${equalizerType === "glitchEq" && index % 3 === 0 ? "bg-pink-400" : "bg-cyan-300"} shadow-[0_0_12px_#22d3ee]`}
              style={{
                width: `${equalizerType === "wideBars" ? 100 / Math.max(1, eqBars.length * 0.95) : 100 / Math.max(1, eqBars.length * 1.6)}%`,
                height: `${Math.max(8, (height / 100) * (equalizerType === "pulse" ? 95 : 82))}%`,
                animation: isPlaying ? `eqMove ${0.3 + index * 0.05}s infinite` : "none",
                transform: equalizerType === "mirror" ? "translateY(0)" : undefined,
                borderRadius: equalizerType === "circle" ? "999px" : undefined,
              }}
            />
          ))}
          </div>
        </div>
      )}

      {showSfx && normalizedSfxItems.map((item) => (
        <div key={item.id} className={`absolute ${getSfxPositionClass(item.position)} font-black text-white drop-shadow-[0_0_10px_#ec4899] text-center`}
          style={{ ...playOrNone("sfxShake 0.45s ease-in-out infinite"), fontSize: `min(${Math.min(baseSize * unifiedSfxScale, maxFontSize)}px, calc(44vw * var(--mobile-sfx-scale, 1)))`, maxWidth: "82%", lineHeight: 1.05, transform: `rotate(${item.rotation}deg)` }}>
          {unifiedSfxText}
        </div>
      ))}

      {showBubble && (
        <div
          className={`absolute ${getPositionClass(
            bubblePosition
          )} bg-white/50 text-black px-6 py-4 border-4 border-black text-center font-bold [text-shadow:0_1px_0_rgba(255,255,255,0.35)] ${
            bubbleVariant === "spiky"
              ? "clip-path-bubble-spiky rounded-[20%]"
              : bubbleVariant === "thought"
                ? "rounded-[45%] before:absolute before:-bottom-3 before:right-8 before:h-4 before:w-4 before:rounded-full before:border-4 before:border-black before:bg-white/50 after:absolute after:-bottom-8 after:right-4 after:h-3 after:w-3 after:rounded-full after:border-2 after:border-black after:bg-white/50"
                : "rounded-full"
          }`}
          style={{ ...playOrNone("bubbleFloat 1.4s ease-in-out infinite"), fontSize: `${bubbleScale}rem`, maxWidth: `${Math.min(420, 260 * bubbleScale)}px`, lineHeight: 1.25 }}
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

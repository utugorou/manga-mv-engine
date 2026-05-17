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

type EffectOverlaysProps = {
  selectedImage: string | null;
  chorusBoost: boolean;
  isPlaying: boolean;
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
  chorusBoost,
  isPlaying,
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
  const baseSize = chorusBoost ? 56 : 44;
  const maxFontSize = minSide * 0.32;
  const normalizedSfxItems = sfxItems.slice(0, 2);
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
      {chorusBoost && selectedImage ? <div className="absolute inset-0 border-[6px] border-white/25 pointer-events-none" /> : null}

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

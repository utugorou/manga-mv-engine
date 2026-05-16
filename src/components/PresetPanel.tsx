"use client";

type PresetName =
  | "ROCK"
  | "POP"
  | "FUNK"
  | "JAZZ"
  | "DANCE"
  | "DISCO"
  | "Synth Vocal"
  | "BALLADE"
  | "漫画BATTLE"
  | "SIMPLE";

type PresetPanelProps = {
  presetList: PresetName[];
  activePreset: PresetName | null;
  applyPreset: (preset: PresetName) => void;
};

export default function PresetPanel({
  presetList,
  activePreset,
  applyPreset,
}: PresetPanelProps) {
  return (
    <div className="pt-1 pb-3 border-b border-zinc-700">
      <p className="text-sm mb-2 text-pink-300 font-bold">演出プリセット</p>

      <div className="grid grid-cols-2 gap-2">
        {presetList.map((preset) => (
          <button
            key={preset}
            onClick={() => applyPreset(preset)}
            className={`p-2 rounded text-xs font-bold ${
              activePreset === preset
                ? "bg-pink-500 text-white shadow-[0_0_12px_#ec4899]"
                : "bg-zinc-800 hover:bg-zinc-700"
            }`}
          >
            {preset}
          </button>
        ))}
      </div>
    </div>
  );
}

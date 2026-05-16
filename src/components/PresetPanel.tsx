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

const presetDescriptions: Partial<Record<PresetName, string>> = {
  FUNK: "グルーヴ重視のノリ系",
  ROCK: "勢い重視の激しめ演出",
  "漫画BATTLE": "強いコマ割りと擬音",
};

export default function PresetPanel({ presetList, activePreset, applyPreset }: PresetPanelProps) {
  return (
    <div>
      <p className="mb-3 text-sm font-bold text-fuchsia-300">演出プリセット</p>
      <div className="grid grid-cols-2 gap-2">
        {presetList.map((preset) => (
          <button key={preset} onClick={() => applyPreset(preset)} className={`rounded-xl border p-2 text-left transition-all ${activePreset === preset ? "border-fuchsia-300 bg-fuchsia-500/20 text-white shadow-[0_0_16px_#d946ef]" : "border-zinc-700 bg-zinc-900 hover:border-fuchsia-500/50 text-zinc-200"}`}>
            <p className="text-xs font-black">{preset}</p>
            <p className="mt-1 text-[10px] text-zinc-400">{presetDescriptions[preset] ?? "スタイルを自動調整"}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

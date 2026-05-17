"use client";

import type { EffectPresetName } from "../types/mv";

type PresetPanelProps = {
  presetList: EffectPresetName[];
  activePreset: EffectPresetName;
  applyPreset: (preset: EffectPresetName) => void;
};

const presetDescriptions: Record<EffectPresetName, string> = {
  標準: "現在のバランスに近い基準演出",
  バトル: "擬音・集中線・揺れを強化",
  エモ: "余白と揺らぎを活かした繊細演出",
  ライブ: "テンポ重視でサビを派手に",
  グリッチ: "ノイズ・ブレ・点滅を強化",
  サビ爆発: "通常は抑えめ、サビで一気に爆発",
};

export default function PresetPanel({ presetList, activePreset, applyPreset }: PresetPanelProps) {
  return (
    <div>
      <p className="mb-3 text-sm font-bold text-fuchsia-300">演出プリセット</p>
      <div className="grid grid-cols-2 gap-2">
        {presetList.map((preset) => (
          <button key={preset} onClick={() => applyPreset(preset)} className={`rounded-xl border p-2 text-left transition-all ${activePreset === preset ? "border-fuchsia-300 bg-fuchsia-500/20 text-white shadow-[0_0_16px_#d946ef]" : "border-zinc-700 bg-zinc-900 hover:border-fuchsia-500/50 text-zinc-200"}`}>
            <p className="text-xs font-black">{preset}</p>
            <p className="mt-1 text-[10px] text-zinc-400">{presetDescriptions[preset]}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

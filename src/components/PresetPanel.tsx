"use client";

import type { EffectPresetName } from "../types/mv";

type PresetPanelProps = {
  presetList: EffectPresetName[];
  activePreset: EffectPresetName;
  isCustomAdjusted: boolean;
  applyPreset: (preset: EffectPresetName) => void;
  customControls: {
    sfxAmount: number;
    sfxSize: number;
    focusLine: number;
    glitch: number;
    shake: number;
    textFrequency: number;
    chorusMultiplier: number;
  };
  onCustomControlChange: (
    key: "sfxAmount" | "sfxSize" | "focusLine" | "glitch" | "shake" | "textFrequency" | "chorusMultiplier",
    value: number,
  ) => void;
};

const presetDescriptions: Record<EffectPresetName, string> = {
  標準: "現在のバランスに近い基準演出",
  バトル: "擬音・集中線・揺れを強化",
  エモ: "余白と揺らぎを活かした繊細演出",
  ライブ: "テンポ重視でサビを派手に",
  グリッチ: "ノイズ・ブレ・点滅を強化",
  サビ爆発: "通常は抑えめ、サビで一気に爆発",
};

const sliderClass = "w-full accent-fuchsia-400";

export default function PresetPanel({ presetList, activePreset, isCustomAdjusted, applyPreset, customControls, onCustomControlChange }: PresetPanelProps) {
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
      <div className="mt-4 rounded-xl border border-fuchsia-500/30 bg-zinc-950/60 p-3">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm font-bold text-cyan-300">カスタム調整</p>
          <span className={`text-[10px] font-bold ${isCustomAdjusted ? "text-yellow-300" : "text-zinc-400"}`}>
            {isCustomAdjusted ? "調整済み" : "プリセット値"}
          </span>
        </div>
        <div className="space-y-2 text-xs">
          <label>擬音の量 {customControls.sfxAmount}
            <input className={sliderClass} type="range" min={0} max={100} value={customControls.sfxAmount} onChange={(e) => onCustomControlChange("sfxAmount", Number(e.target.value))} />
          </label>
          <label>擬音の大きさ {customControls.sfxSize}
            <input className={sliderClass} type="range" min={0} max={100} value={customControls.sfxSize} onChange={(e) => onCustomControlChange("sfxSize", Number(e.target.value))} />
          </label>
          <label>集中線の強さ {customControls.focusLine}
            <input className={sliderClass} type="range" min={0} max={100} value={customControls.focusLine} onChange={(e) => onCustomControlChange("focusLine", Number(e.target.value))} />
          </label>
          <label>グリッチの強さ {customControls.glitch}
            <input className={sliderClass} type="range" min={0} max={100} value={customControls.glitch} onChange={(e) => onCustomControlChange("glitch", Number(e.target.value))} />
          </label>
          <label>画面揺れの強さ {customControls.shake}
            <input className={sliderClass} type="range" min={0} max={100} value={customControls.shake} onChange={(e) => onCustomControlChange("shake", Number(e.target.value))} />
          </label>
          <label>テキスト出現頻度 {customControls.textFrequency}
            <input className={sliderClass} type="range" min={0} max={100} value={customControls.textFrequency} onChange={(e) => onCustomControlChange("textFrequency", Number(e.target.value))} />
          </label>
          <label>サビ演出倍率 {customControls.chorusMultiplier.toFixed(1)}x
            <input className={sliderClass} type="range" min={1} max={3} step={0.1} value={customControls.chorusMultiplier} onChange={(e) => onCustomControlChange("chorusMultiplier", Number(e.target.value))} />
          </label>
        </div>
      </div>
    </div>
  );
}

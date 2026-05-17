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
  標準: "使いやすいバランス型",
  バトル: "擬音・動き・フラッシュ強め",
  エモ: "余白とセリフ重視で落ち着いた演出",
  ライブ: "音反応とテンポ感を強調",
  サビ爆発: "見せ場を最大火力で演出",
};

const sliderClass = "w-full accent-fuchsia-400";

function valueHint(level: number) {
  if (level <= 33) return "低め（落ち着いた演出）";
  if (level <= 66) return "標準（バランス型）";
  return "高め（派手な演出）";
}

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
        <p className="mb-2 text-[11px] text-zinc-400">左右のラベルを目安に、右にするほど派手な演出になります。</p>
        <div className="space-y-3 text-xs">
          <label className="block">擬音量 {customControls.sfxAmount}
            <p className="text-[10px] text-zinc-400">擬音の出る量を調整します。</p>
            <input className={sliderClass} type="range" min={0} max={100} value={customControls.sfxAmount} onChange={(e) => onCustomControlChange("sfxAmount", Number(e.target.value))} />
            <p className="mt-1 flex justify-between text-[10px] text-zinc-500"><span>少なめ</span><span>多め</span></p>
            <p className="text-[10px] text-zinc-400">現在: {valueHint(customControls.sfxAmount)}</p>
          </label>
          <label className="block">擬音サイズ {customControls.sfxSize}
            <p className="text-[10px] text-zinc-400">擬音1つあたりの大きさです。</p>
            <input className={sliderClass} type="range" min={0} max={100} value={customControls.sfxSize} onChange={(e) => onCustomControlChange("sfxSize", Number(e.target.value))} />
            <p className="mt-1 flex justify-between text-[10px] text-zinc-500"><span>小さめ</span><span>大きめ</span></p>
            <p className="text-[10px] text-zinc-400">現在: {valueHint(customControls.sfxSize)}</p>
          </label>
          <label className="block">集中線 {customControls.focusLine}
            <p className="text-[10px] text-zinc-400">緊張感を出す線エフェクトの強さです。</p>
            <input className={sliderClass} type="range" min={0} max={100} value={customControls.focusLine} onChange={(e) => onCustomControlChange("focusLine", Number(e.target.value))} />
            <p className="mt-1 flex justify-between text-[10px] text-zinc-500"><span>控えめ</span><span>強め</span></p>
            <p className="text-[10px] text-zinc-400">現在: {valueHint(customControls.focusLine)}</p>
          </label>
          <label className="block">画面揺れ {customControls.shake}
            <p className="text-[10px] text-zinc-400">カメラが揺れるような動きの強さです。</p>
            <input className={sliderClass} type="range" min={0} max={100} value={customControls.shake} onChange={(e) => onCustomControlChange("shake", Number(e.target.value))} />
            <p className="mt-1 flex justify-between text-[10px] text-zinc-500"><span>安定</span><span>激しく</span></p>
            <p className="text-[10px] text-zinc-400">現在: {valueHint(customControls.shake)}</p>
          </label>
          <label className="block">テキスト頻度 {customControls.textFrequency}
            <p className="text-[10px] text-zinc-400">セリフや文字演出が出る回数の目安です。</p>
            <input className={sliderClass} type="range" min={0} max={100} value={customControls.textFrequency} onChange={(e) => onCustomControlChange("textFrequency", Number(e.target.value))} />
            <p className="mt-1 flex justify-between text-[10px] text-zinc-500"><span>少なめ</span><span>多め</span></p>
            <p className="text-[10px] text-zinc-400">現在: {valueHint(customControls.textFrequency)}</p>
          </label>
          <label className="block">サビ演出倍率 {customControls.chorusMultiplier.toFixed(1)}x
            <p className="text-[10px] text-zinc-400">サビでどれだけ演出を強めるかを調整します。</p>
            <input className={sliderClass} type="range" min={1} max={3} step={0.1} value={customControls.chorusMultiplier} onChange={(e) => onCustomControlChange("chorusMultiplier", Number(e.target.value))} />
            <p className="mt-1 flex justify-between text-[10px] text-zinc-500"><span>自然</span><span>サビ爆発</span></p>
            <p className="text-[10px] text-zinc-400">現在: {customControls.chorusMultiplier < 1.5 ? "控えめ" : customControls.chorusMultiplier < 2.3 ? "標準" : "かなり派手"}</p>
          </label>
        </div>
      </div>
    </div>
  );
}

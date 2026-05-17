"use client";

import { MutableRefObject } from "react";
import {
  MotionType,
  PositionType,
  PanelMode,
  PanelPattern,
  PresetName,
  SwitchMode,
  TextMode,
  MotionAmplitude,
  EqualizerType,
  EqualizerColorTheme,
} from "../types/mv";

type SettingsPanelProps = {
  switchMode: SwitchMode;
  setSwitchMode: (mode: SwitchMode) => void;
  wasAboveThresholdRef: MutableRefObject<boolean>;
  lastLowEnergyRef: MutableRefObject<number>;
  setActivePreset: (preset: PresetName | null) => void;
  imageDuration: number;
  setImageDuration: (duration: number) => void;
  handleAutoDuration: () => void;
  peakSensitivity: number;
  setPeakSensitivity: (value: number) => void;
  kickSensitivity: number;
  setKickSensitivity: (value: number) => void;
  minSwitchInterval: number;
  setMinSwitchInterval: (value: number) => void;
  idealSwitchInterval: number;
  setIdealSwitchInterval: (value: number) => void;
  fallbackSwitchInterval: number;
  setFallbackSwitchInterval: (value: number) => void;
  showBubble: boolean;
  setShowBubble: (value: boolean) => void;
  autoBubble: boolean;
  setAutoBubble: (value: boolean) => void;
  textMode: TextMode;
  setTextMode: (mode: TextMode) => void;
  showSfx: boolean;
  setShowSfx: (value: boolean) => void;
  showEqualizer: boolean;
  setShowEqualizer: (value: boolean) => void;
  equalizerType: EqualizerType;
  setEqualizerType: (value: EqualizerType) => void;
  equalizerColorTheme: EqualizerColorTheme;
  setEqualizerColorTheme: (value: EqualizerColorTheme) => void;
  showFlash: boolean;

  bubbleText?: string;
  setBubbleText?: (value: string) => void;
  sfxText?: string;
  setSfxText?: (value: string) => void;
  randomSfxScaleEnabled?: boolean;
  randomSfxCountEnabled?: boolean;
  setRandomSfxScaleEnabled?: (value: boolean) => void;
  setRandomSfxCountEnabled?: (value: boolean) => void;
  regenerateSfxItems?: () => void;
  setBubblePosition?: (position: PositionType) => void;
  bubbleTexts?: string[];
  positions?: PositionType[];
  randomItem?: <T>(list: T[]) => T;
  showGlitch?: boolean;
  setShowGlitch?: (value: boolean) => void;
  showPanels?: boolean;
  setShowPanels?: (value: boolean) => void;
  panelMode?: string;
  setPanelMode?: (mode: PanelMode) => void;
  panelPattern?: string;
  setPanelPattern?: (pattern: PanelPattern) => void;
  chorusBoost?: boolean;
  audioMood?: string;
  setShowFlash: (value: boolean) => void;
  chorusSensitivity: number;
  setChorusSensitivity: (value: number) => void;
  selectedMotion: MotionType;
  setSelectedMotion: (motion: MotionType) => void;
  applyMotionToCurrent: () => void;
  applyRandomMotions: () => void;
  randomMotionApplied: boolean;
  motionAmplitude: MotionAmplitude;
  setMotionAmplitude: (value: MotionAmplitude) => void;
};

const cardClass = "rounded-xl border border-zinc-700 bg-zinc-900/70 p-3 space-y-2";

export default function SettingsPanel(props: SettingsPanelProps) {
  const {
    switchMode, setSwitchMode, wasAboveThresholdRef, lastLowEnergyRef, setActivePreset,
    imageDuration, setImageDuration, handleAutoDuration, peakSensitivity, setPeakSensitivity,
    kickSensitivity, setKickSensitivity, minSwitchInterval, setMinSwitchInterval,
    idealSwitchInterval, setIdealSwitchInterval, fallbackSwitchInterval, setFallbackSwitchInterval,
    showBubble, setShowBubble, autoBubble, setAutoBubble, textMode, setTextMode,
    showSfx, setShowSfx, showEqualizer, setShowEqualizer,
    equalizerType, setEqualizerType, equalizerColorTheme, setEqualizerColorTheme,
    showFlash, setShowFlash, chorusSensitivity, setChorusSensitivity, selectedMotion,
    setSelectedMotion, applyMotionToCurrent, applyRandomMotions, randomMotionApplied,
    motionAmplitude, setMotionAmplitude,
  } = props;

  return <div className="space-y-3">
    <section className={cardClass}>
      <p className="text-sm font-bold text-cyan-300">画面切り替え</p><p className="text-xs text-zinc-400">一定間隔で切り替えるか、音の盛り上がりで切り替えるかを選びます。</p>
      <div className="grid grid-cols-1 gap-2 text-sm">
        <button onClick={() => { setSwitchMode("equal"); wasAboveThresholdRef.current = false; setActivePreset(null); }} className={`p-2 rounded font-bold ${switchMode === "equal" ? "bg-pink-600" : "bg-zinc-800"}`}>一定間隔</button>
        <button onClick={() => { setSwitchMode("peak"); wasAboveThresholdRef.current = false; setActivePreset(null); }} className={`p-2 rounded font-bold ${switchMode === "peak" ? "bg-cyan-600 text-black" : "bg-zinc-800"}`}>音に合わせる</button>
        <button onClick={() => { setSwitchMode("kick"); wasAboveThresholdRef.current = false; lastLowEnergyRef.current = 0; setActivePreset(null); }} className={`p-2 rounded font-bold ${switchMode === "kick" ? "bg-yellow-400 text-black" : "bg-zinc-800"}`}>サビ重視</button>
      </div>
      <p className="text-xs text-zinc-300">画面切り替えタイミング: {(imageDuration / 1000).toFixed(1)}秒</p>
      <input type="range" min="500" max="10000" step="100" value={imageDuration} onChange={(e) => { setImageDuration(Number(e.target.value)); setActivePreset(null); }} className="w-full" />
      <p className="flex justify-between text-[10px] text-zinc-500"><span>速い</span><span>遅い</span></p>
      {switchMode !== "equal" ? <>
        <p className="text-xs text-zinc-300">音反応の敏感さ: {switchMode === "peak" ? peakSensitivity : kickSensitivity}%</p>
        <input type="range" min={switchMode === "peak" ? 5 : 2} max={switchMode === "peak" ? 35 : 20} step="1" value={switchMode === "peak" ? peakSensitivity : kickSensitivity} onChange={(e) => { const v = Number(e.target.value); if (switchMode === "peak") { setPeakSensitivity(v); } else { setKickSensitivity(v); } setActivePreset(null); }} className="w-full" />
        <p className="flex justify-between text-[10px] text-zinc-500"><span>大きな音だけ</span><span>小さな音にも反応</span></p>
      </> : null}
      <button onClick={handleAutoDuration} className="w-full rounded bg-pink-600 p-2 font-bold">曲尺に合わせる</button>
    </section>

    <section className={cardClass}><p className="text-sm font-bold text-cyan-300">モーション</p><p className="text-xs text-zinc-400">背景や画面の動きの大きさを調整します。</p>
    <div className="grid grid-cols-3 gap-2">{(["normal","x2","x3"] as MotionAmplitude[]).map((v) => <button key={v} onClick={() => { setMotionAmplitude(v); setActivePreset(null); }} className={`rounded p-2 ${motionAmplitude===v?"bg-cyan-500 text-black font-bold":"bg-zinc-800"}`}>{v === "normal" ? "通常" : v === "x2" ? "2倍" : "3倍"}</button>)}</div>
    <select value={selectedMotion} onChange={(e)=>{setSelectedMotion(e.target.value as MotionType); setActivePreset(null);}} className="w-full rounded border border-zinc-700 bg-black p-2">
      <option value="zoomIn">ズームイン</option><option value="zoomOut">ズームアウト</option><option value="panLeft">左パン</option><option value="panRight">右パン</option><option value="shake">シェイク</option><option value="comic">漫画揺れ</option><option value="panUp">上パン</option><option value="panDown">下パン</option><option value="diagonalPan">斜めパン</option><option value="slowZoomIn">ゆっくりズームイン</option><option value="breathZoom">呼吸ズーム</option><option value="impactZoom">インパクトズーム</option><option value="grooveBounce">グルーヴバウンス</option><option value="sideGroove">横ノリ</option><option value="handheld">手持ちカメラ風</option>
    </select><button onClick={applyMotionToCurrent} className="w-full rounded bg-pink-600 p-2">この画像に適用</button><button onClick={applyRandomMotions} className={`w-full rounded p-2 ${randomMotionApplied?"bg-cyan-500 text-black font-bold":"bg-zinc-800"}`}>全画像ランダム {randomMotionApplied ? "適用中" : "未適用"}</button></section>

    <section className={cardClass}><p className="text-sm font-bold text-cyan-300">音反応 / エコライザー</p><p className="text-xs text-zinc-400">曲の音に合わせて下部のエコライザーを動かします。</p>
    <button onClick={()=>{setShowEqualizer(!showEqualizer); setActivePreset(null);}} className={`w-full rounded p-2 ${showEqualizer?"bg-cyan-600 text-black":"bg-zinc-800"}`}>エコライザー {showEqualizer?"ON":"OFF"}</button>
    <select value={equalizerType} onChange={(e)=>{setEqualizerType(e.target.value as EqualizerType); setActivePreset(null);}} className="w-full rounded border border-zinc-700 bg-black p-2"><option value="bars">バー</option><option value="wideBars">ワイドバー</option><option value="mirror">ミラー</option><option value="wave">波形</option><option value="block">ブロック</option><option value="dot">ドット</option><option value="laser">レーザー</option></select>
    <select value={equalizerColorTheme} onChange={(e)=>{setEqualizerColorTheme(e.target.value as EqualizerColorTheme); setActivePreset(null);}} className="w-full rounded border border-zinc-700 bg-black p-2"><option value="neon">ネオン</option><option value="redBlue">赤青</option><option value="yellowBlack">黄黒</option><option value="green">緑</option><option value="pink">ピンク</option><option value="mono">白黒</option><option value="rainbow">レインボー</option></select>
    </section>

    <section className={cardClass}><p className="text-sm font-bold text-yellow-300">フラッシュ</p><p className="text-xs text-zinc-400">音のピークやサビで一瞬光らせて、インパクトを出します。</p>
    <button onClick={()=>{setShowFlash(!showFlash); setActivePreset(null);}} className={`w-full rounded p-2 ${showFlash?"bg-yellow-400 text-black font-bold":"bg-zinc-800"}`}>フラッシュ {showFlash ? "ON" : "OFF"}</button>
    </section>

    <section className={cardClass}><p className="text-sm font-bold text-pink-300">文字演出の表示ON/OFF</p><p className="text-xs text-zinc-400">画面に出す文字演出を選びます。</p>
    <button onClick={()=>{setShowBubble(!showBubble); setActivePreset(null);}} className={`w-full rounded p-2 ${showBubble?"bg-pink-600":"bg-zinc-800"}`}>タイトル表示 {showBubble?"ON":"OFF"}</button>
    <button onClick={()=>{setShowSfx(!showSfx); setActivePreset(null);}} className={`w-full rounded p-2 ${showSfx?"bg-pink-600":"bg-zinc-800"}`}>擬音表示 {showSfx?"ON":"OFF"}</button>
    <button onClick={()=>{setShowBubble(!showBubble); setActivePreset(null);}} className={`w-full rounded p-2 ${showBubble?"bg-cyan-600 text-black":"bg-zinc-800"}`}>セリフ表示 {showBubble?"ON":"OFF"}</button>
    <button onClick={()=>{setAutoBubble(!autoBubble); setActivePreset(null);}} className={`w-full rounded p-2 ${autoBubble?"bg-zinc-700":"bg-zinc-800"}`}>セリフ自動生成 {autoBubble?"ON":"OFF"}</button>
    <button onClick={()=>{setTextMode(textMode === "smart" ? "random" : "smart"); setActivePreset(null);}} className={`w-full rounded p-2 ${textMode === "smart" ? "bg-cyan-500 text-black font-bold" : "bg-zinc-800"}`}>スマート文字 {textMode === "smart" ? "ON" : "OFF"}</button>
    </section>

    <details className={cardClass}><summary className="cursor-pointer text-sm font-bold text-cyan-300">詳細調整 / カスタム調整</summary><p className="mt-2 text-xs text-zinc-400">細かく調整したい人向けの設定です。</p>
      <div className="space-y-2 pt-2">
        <p className="text-xs text-zinc-300">最短切替間隔: {(minSwitchInterval / 1000).toFixed(1)}秒</p><input type="range" min="200" max="3000" step="100" value={minSwitchInterval} onChange={(e) => { setMinSwitchInterval(Number(e.target.value)); setActivePreset(null); }} className="w-full" />
        <p className="text-xs text-zinc-300">理想切替間隔: {(idealSwitchInterval / 1000).toFixed(1)}秒</p><input type="range" min="400" max="4000" step="100" value={idealSwitchInterval} onChange={(e) => { setIdealSwitchInterval(Number(e.target.value)); setActivePreset(null); }} className="w-full" />
        <p className="text-xs text-zinc-300">補助切替間隔: {(fallbackSwitchInterval / 1000).toFixed(1)}秒</p><input type="range" min="400" max="5000" step="100" value={fallbackSwitchInterval} onChange={(e) => { setFallbackSwitchInterval(Number(e.target.value)); setActivePreset(null); }} className="w-full" />
        <p className="text-xs text-zinc-300">サビ演出倍率感度: {chorusSensitivity}%</p><input type="range" min="10" max="45" step="1" value={chorusSensitivity} onChange={(e)=>{setChorusSensitivity(Number(e.target.value)); setActivePreset(null);}} className="w-full" />
      </div>
    </details>
  </div>;
}

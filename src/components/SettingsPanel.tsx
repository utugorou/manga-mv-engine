"use client";

import { MutableRefObject } from "react";
import {
  AudioMood,
  MotionType,
  PanelMode,
  PanelPattern,
  PositionType,
  PresetName,
  SwitchMode,
  TextMode,
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
  bubbleText: string;
  setBubbleText: (value: string) => void;
  autoBubble: boolean;
  setAutoBubble: (value: boolean) => void;
  textMode: TextMode;
  setTextMode: (mode: TextMode) => void;
  audioMood: AudioMood;
  showSfx: boolean;
  setShowSfx: (value: boolean) => void;
  sfxText: string;
  setSfxText: (value: string) => void;
  autoSfx: boolean;
  setAutoSfx: (value: boolean) => void;
  randomSfxScaleEnabled: boolean;
  randomSfxCountEnabled: boolean;
  setRandomSfxScaleEnabled: (value: boolean) => void;
  setRandomSfxCountEnabled: (value: boolean) => void;
  regenerateSfxItems: () => void;
  setBubblePosition: (position: PositionType) => void;
  bubbleTexts: string[];
  positions: PositionType[];
  randomItem: <T>(list: T[]) => T;
  showGlitch: boolean;
  setShowGlitch: (value: boolean) => void;
  showEqualizer: boolean;
  setShowEqualizer: (value: boolean) => void;
  showFlash: boolean;
  setShowFlash: (value: boolean) => void;
  showPanels: boolean;
  setShowPanels: (value: boolean) => void;
  panelMode: PanelMode;
  setPanelMode: (mode: PanelMode) => void;
  panelPattern: PanelPattern;
  setPanelPattern: (pattern: PanelPattern) => void;
  chorusBoost: boolean;
  chorusSensitivity: number;
  setChorusSensitivity: (value: number) => void;
  selectedMotion: MotionType;
  setSelectedMotion: (motion: MotionType) => void;
  applyMotionToCurrent: () => void;
  applyRandomMotions: () => void;
  randomMotionApplied: boolean;
};

export default function SettingsPanel({
  switchMode,
  setSwitchMode,
  wasAboveThresholdRef,
  lastLowEnergyRef,
  setActivePreset,
  imageDuration,
  setImageDuration,
  handleAutoDuration,
  peakSensitivity,
  setPeakSensitivity,
  kickSensitivity,
  setKickSensitivity,
  minSwitchInterval,
  setMinSwitchInterval,
  idealSwitchInterval,
  setIdealSwitchInterval,
  fallbackSwitchInterval,
  setFallbackSwitchInterval,
  showBubble,
  setShowBubble,
  bubbleText,
  setBubbleText,
  autoBubble,
  setAutoBubble,
  textMode,
  setTextMode,
  audioMood,
  showSfx,
  setShowSfx,
  sfxText,
  setSfxText,
  autoSfx,
  setAutoSfx,
  randomSfxScaleEnabled,
  randomSfxCountEnabled,
  setRandomSfxScaleEnabled,
  setRandomSfxCountEnabled,
  regenerateSfxItems,
  setBubblePosition,
  bubbleTexts,
  positions,
  randomItem,
  showGlitch,
  setShowGlitch,
  showEqualizer,
  setShowEqualizer,
  showFlash,
  setShowFlash,
  showPanels,
  setShowPanels,
  panelMode,
  setPanelMode,
  panelPattern,
  setPanelPattern,
  chorusBoost,
  chorusSensitivity,
  setChorusSensitivity,
  selectedMotion,
  setSelectedMotion,
  applyMotionToCurrent,
  applyRandomMotions,
  randomMotionApplied,
}: SettingsPanelProps) {
  return (
    <>
      <div className="pt-1 pb-3 border-b border-zinc-700">
        <p className="text-sm mb-2 text-cyan-300">画像切替方式</p>

        <div className="grid grid-cols-1 gap-2">
          <button
            onClick={() => {
              setSwitchMode("equal");
              wasAboveThresholdRef.current = false;
              setActivePreset(null);
            }}
            className={`p-2 rounded text-sm font-bold ${
              switchMode === "equal"
                ? "bg-pink-600"
                : "bg-zinc-800 hover:bg-zinc-700"
            }`}
          >
            均等切替
          </button>

          <button
            onClick={() => {
              setSwitchMode("peak");
              wasAboveThresholdRef.current = false;
              setActivePreset(null);
            }}
            className={`p-2 rounded text-sm font-bold ${
              switchMode === "peak"
                ? "bg-cyan-600 text-black"
                : "bg-zinc-800 hover:bg-zinc-700"
            }`}
          >
            音量ピーク＋補助
          </button>

          <button
            onClick={() => {
              setSwitchMode("kick");
              wasAboveThresholdRef.current = false;
              lastLowEnergyRef.current = 0;
              setActivePreset(null);
            }}
            className={`p-2 rounded text-sm font-bold ${
              switchMode === "kick"
                ? "bg-yellow-400 text-black"
                : "bg-zinc-800 hover:bg-zinc-700"
            }`}
          >
            低音キック＋補助
          </button>
        </div>
      </div>

      {switchMode === "equal" ? (
        <div className="pt-2 border-b border-zinc-700 pb-4">
          <p className="text-sm mb-2 text-cyan-300">画像切替秒数</p>

          <input
            type="range"
            min="500"
            max="10000"
            step="100"
            value={imageDuration}
            onChange={(e) => {
              setImageDuration(Number(e.target.value));
              setActivePreset(null);
            }}
            className="w-full"
          />

          <p className="text-xs text-zinc-400 mt-1">
            {(imageDuration / 1000).toFixed(1)} 秒
          </p>

          <button
            onClick={handleAutoDuration}
            className="w-full bg-pink-600 hover:bg-pink-500 p-2 rounded mt-3 font-bold"
          >
            曲尺に合わせる
          </button>
        </div>
      ) : (
        <div className="pt-2 border-b border-zinc-700 pb-4 space-y-3">
          {switchMode === "peak" && (
            <div>
              <p className="text-sm mb-2 text-cyan-300">ピーク感度</p>

              <input
                type="range"
                min="5"
                max="35"
                step="1"
                value={peakSensitivity}
                onChange={(e) => {
                  setPeakSensitivity(Number(e.target.value));
                  setActivePreset(null);
                }}
                className="w-full"
              />

              <p className="text-xs text-zinc-400 mt-1">{peakSensitivity}%</p>
            </div>
          )}

          {switchMode === "kick" && (
            <div>
              <p className="text-sm mb-2 text-yellow-300">低音キック感度</p>

              <input
                type="range"
                min="2"
                max="20"
                step="1"
                value={kickSensitivity}
                onChange={(e) => {
                  setKickSensitivity(Number(e.target.value));
                  setActivePreset(null);
                }}
                className="w-full"
              />

              <p className="text-xs text-zinc-400 mt-1">{kickSensitivity}%</p>
            </div>
          )}

          <div>
            <p className="text-sm mb-2 text-cyan-300">最短切替間隔</p>

            <input
              type="range"
              min="200"
              max="3000"
              step="100"
              value={minSwitchInterval}
              onChange={(e) => {
                setMinSwitchInterval(Number(e.target.value));
                setActivePreset(null);
              }}
              className="w-full"
            />

            <p className="text-xs text-zinc-400 mt-1">
              {(minSwitchInterval / 1000).toFixed(1)} 秒
            </p>
          </div>

          <div>
            <p className="text-sm mb-2 text-yellow-300">理想切替間隔</p>

            <input
              type="range"
              min="400"
              max="4000"
              step="100"
              value={idealSwitchInterval}
              onChange={(e) => {
                setIdealSwitchInterval(Number(e.target.value));
                setActivePreset(null);
              }}
              className="w-full"
            />

            <p className="text-xs text-zinc-400 mt-1">
              {(idealSwitchInterval / 1000).toFixed(1)} 秒
            </p>
          </div>

          <div>
            <p className="text-sm mb-2 text-pink-300">補助切替間隔</p>

            <input
              type="range"
              min="400"
              max="5000"
              step="100"
              value={fallbackSwitchInterval}
              onChange={(e) => {
                setFallbackSwitchInterval(Number(e.target.value));
                setActivePreset(null);
              }}
              className="w-full"
            />

            <p className="text-xs text-zinc-400 mt-1">
              {(fallbackSwitchInterval / 1000).toFixed(1)} 秒
            </p>
          </div>
        </div>
      )}

      <button
        onClick={() => {
          setShowBubble(true);
          setActivePreset(null);
        }}
        className={`w-full p-2 rounded ${
          showBubble
            ? "bg-pink-600 hover:bg-pink-500"
            : "bg-zinc-800 hover:bg-zinc-700"
        }`}
      >
        吹き出し {showBubble ? "ON" : "追加"}
      </button>

      <input
        value={bubbleText}
        onChange={(e) => {
          setBubbleText(e.target.value);
          setActivePreset(null);
        }}
        className="w-full bg-black border border-zinc-600 p-2 rounded text-white"
      />

      <button
        onClick={() => {
          setAutoBubble(!autoBubble);
          setActivePreset(null);
        }}
        className={`w-full p-2 rounded ${
          autoBubble
            ? "bg-pink-600 hover:bg-pink-500"
            : "bg-zinc-800 hover:bg-zinc-700"
        }`}
      >
        セリフ全自動 {autoBubble ? "ON" : "OFF"}
      </button>

      <div className="pt-3 pb-3 border-b border-zinc-700">
        <p className="text-sm mb-2 text-pink-300 font-bold">文字生成モード</p>

        <div className="grid grid-cols-1 gap-2">
          <button
            onClick={() => {
              setTextMode("fixed");
              setActivePreset(null);
            }}
            className={`p-2 rounded text-sm ${
              textMode === "fixed"
                ? "bg-white text-black font-bold"
                : "bg-zinc-800 hover:bg-zinc-700"
            }`}
          >
            固定
          </button>

          <button
            onClick={() => {
              setTextMode("random");
              setActivePreset(null);
            }}
            className={`p-2 rounded text-sm ${
              textMode === "random"
                ? "bg-cyan-500 text-black font-bold"
                : "bg-zinc-800 hover:bg-zinc-700"
            }`}
          >
            ランダム
          </button>

          <button
            onClick={() => {
              setTextMode("smart");
              setActivePreset(null);
            }}
            className={`p-2 rounded text-sm ${
              textMode === "smart"
                ? "bg-pink-600 font-bold"
                : "bg-zinc-800 hover:bg-zinc-700"
            }`}
          >
            スマート
          </button>
        </div>

        <p className="text-xs text-zinc-400 mt-2">
          現在：{textMode} / 状態：{audioMood}
        </p>
      </div>

      <button
        onClick={() => {
          setShowBubble(true);
          setBubbleText(randomItem(bubbleTexts));
          setBubblePosition(randomItem(positions));
          setActivePreset(null);
        }}
        className="w-full bg-zinc-800 hover:bg-zinc-700 p-2 rounded"
      >
        セリフだけランダム
      </button>

      <button
        onClick={() => {
          setShowSfx(!showSfx);
          setActivePreset(null);
        }}
        className={`w-full p-2 rounded ${
          showSfx
            ? "bg-pink-600 hover:bg-pink-500"
            : "bg-zinc-800 hover:bg-zinc-700"
        }`}
      >
        擬音 {showSfx ? "ON" : "OFF"}
      </button>

      <input
        value={sfxText}
        onChange={(e) => {
          setSfxText(e.target.value);
          setActivePreset(null);
        }}
        className="w-full bg-black border border-zinc-600 p-2 rounded text-white"
      />

      <button
        onClick={() => {
          setAutoSfx(!autoSfx);
          setActivePreset(null);
        }}
        className={`w-full p-2 rounded ${
          autoSfx
            ? "bg-pink-600 hover:bg-pink-500"
            : "bg-zinc-800 hover:bg-zinc-700"
        }`}
      >
        擬音全自動 {autoSfx ? "ON" : "OFF"}
      </button>

      <button
        onClick={() => {
          setShowSfx(true);
          regenerateSfxItems();
          setActivePreset(null);
        }}
        className="w-full bg-zinc-800 hover:bg-zinc-700 p-2 rounded"
      >
        擬音だけランダム
      </button>
      <button
        onClick={() => {
          setRandomSfxCountEnabled(!randomSfxCountEnabled);
          setActivePreset(null);
        }}
        className={`w-full p-2 rounded ${randomSfxCountEnabled ? "bg-yellow-400 text-black font-bold" : "bg-zinc-800 hover:bg-zinc-700"}`}
      >
        擬音数ランダム {randomSfxCountEnabled ? "ON" : "OFF"}
      </button>

      <button
        onClick={() => {
          setRandomSfxScaleEnabled(!randomSfxScaleEnabled);
          setActivePreset(null);
        }}
        className={`w-full p-2 rounded ${
          randomSfxScaleEnabled
            ? "bg-yellow-400 text-black font-bold"
            : "bg-zinc-800 hover:bg-zinc-700"
        }`}
      >
        擬音巨大化 {randomSfxScaleEnabled ? "ON" : "OFF"}
      </button>

      <button
        onClick={() => {
          setShowGlitch(!showGlitch);
          setActivePreset(null);
        }}
        className={`w-full p-2 rounded ${
          showGlitch
            ? "bg-pink-600 hover:bg-pink-500"
            : "bg-zinc-800 hover:bg-zinc-700"
        }`}
      >
        グリッチ {showGlitch ? "ON" : "OFF"}
      </button>

      <button
        onClick={() => {
          setShowEqualizer(!showEqualizer);
          setActivePreset(null);
        }}
        className={`w-full p-2 rounded ${
          showEqualizer
            ? "bg-cyan-600 hover:bg-cyan-500 text-black"
            : "bg-zinc-800 hover:bg-zinc-700"
        }`}
      >
        イコライザー {showEqualizer ? "ON" : "OFF"}
      </button>

      <button
        onClick={() => {
          setShowFlash(!showFlash);
          setActivePreset(null);
        }}
        className={`w-full p-2 rounded ${
          showFlash
            ? "bg-yellow-400 text-black font-bold"
            : "bg-zinc-800 hover:bg-zinc-700"
        }`}
      >
        カメラフラッシュ {showFlash ? "ON" : "OFF"}
      </button>

      <button
        onClick={() => {
          setShowPanels(!showPanels);
          setActivePreset(null);
        }}
        className={`w-full p-2 rounded ${
          showPanels
            ? "bg-white text-black font-bold"
            : "bg-zinc-800 hover:bg-zinc-700"
        }`}
      >
        漫画コマ割り {showPanels ? "ON" : "OFF"}
      </button>

      <div className="pt-3 pb-3 border-b border-zinc-700">
        <p className="text-sm mb-2 text-cyan-300">コマ割り方式</p>
        <div className="grid grid-cols-1 gap-2">
          <button
            onClick={() => {
              setPanelMode("fixed");
              setPanelPattern("classic");
              setActivePreset(null);
            }}
            className={`p-2 rounded text-sm ${
              panelMode === "fixed"
                ? "bg-white text-black font-bold"
                : "bg-zinc-800 hover:bg-zinc-700"
            }`}
          >
            固定
          </button>
          <button
            onClick={() => {
              setPanelMode("random");
              setActivePreset(null);
            }}
            className={`p-2 rounded text-sm ${
              panelMode === "random"
                ? "bg-cyan-500 text-black font-bold"
                : "bg-zinc-800 hover:bg-zinc-700"
            }`}
          >
            画像切替ごとにランダム
          </button>
          <button
            onClick={() => {
              setPanelMode("chorus");
              setActivePreset(null);
            }}
            className={`p-2 rounded text-sm ${
              panelMode === "chorus"
                ? "bg-pink-600 font-bold"
                : "bg-zinc-800 hover:bg-zinc-700"
            }`}
          >
            サビだけランダム
          </button>
        </div>
        <p className="text-xs text-zinc-400 mt-2">現在：{panelPattern}</p>
      </div>

      <div className="pt-4 border-t border-zinc-700">
        <p className="text-sm mb-2 text-pink-300">サビ暴走モード</p>
        <div
          className={`w-full p-2 rounded text-center font-bold mb-3 ${
            chorusBoost ? "bg-pink-600" : "bg-zinc-800 text-zinc-400"
          }`}
        >
          {chorusBoost ? "暴走中" : "待機中"}
        </div>
        <p className="text-xs text-zinc-400 mb-1">暴走感度：{chorusSensitivity}%</p>
        <input
          type="range"
          min="10"
          max="45"
          step="1"
          value={chorusSensitivity}
          onChange={(e) => {
            setChorusSensitivity(Number(e.target.value));
            setActivePreset(null);
          }}
          className="w-full"
        />
      </div>

      <div className="pt-4 border-t border-zinc-700">
        <p className="text-sm mb-2 text-cyan-300">現在画像のモーション</p>
        <select
          value={selectedMotion}
          onChange={(e) => {
            setSelectedMotion(e.target.value as MotionType);
            setActivePreset(null);
          }}
          className="w-full bg-black border border-zinc-600 p-2 rounded text-white"
        >
          <option value="zoomIn">ズームイン</option>
          <option value="zoomOut">ズームアウト</option>
          <option value="panLeft">左パン</option>
          <option value="panRight">右パン</option>
          <option value="shake">シェイク</option>
          <option value="comic">漫画揺れ</option>
          <option value="panUp">上パン</option>
          <option value="panDown">下パン</option>
          <option value="diagonalPan">斜めパン</option>
          <option value="slowZoomIn">ゆっくりズームイン</option>
          <option value="breathZoom">呼吸ズーム</option>
          <option value="impactZoom">インパクトズーム</option>
          <option value="glitchJump">グリッチジャンプ</option>
          <option value="grooveBounce">グルーヴバウンス</option>
          <option value="sideGroove">横ノリ</option>
          <option value="handheld">手持ちカメラ風</option>
        </select>
        <button
          onClick={applyMotionToCurrent}
          className="w-full bg-pink-600 hover:bg-pink-500 p-2 rounded mt-3"
        >
          この画像に適用
        </button>
        <button
          onClick={applyRandomMotions}
          className={`w-full p-2 rounded mt-3 ${
            randomMotionApplied
              ? "bg-cyan-500 text-black font-bold"
              : "bg-zinc-800 hover:bg-zinc-700"
          }`}
        >
          全画像ランダム {randomMotionApplied ? "適用中" : "未適用"}
        </button>
      </div>
    </>
  );
}

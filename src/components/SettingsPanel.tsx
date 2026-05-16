"use client";

import { MutableRefObject } from "react";

type SwitchMode = "equal" | "peak" | "kick";
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
    </>
  );
}

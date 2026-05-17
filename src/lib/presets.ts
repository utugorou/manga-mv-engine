import type { EffectPresetName } from "../types/mv";

export const effectPresetList: EffectPresetName[] = ["標準", "バトル", "エモ", "ライブ", "グリッチ", "サビ爆発"];

export type EffectPresetConfig = {
  sfxFrequency: number;
  sfxScale: number;
  focusLineIntensity: number;
  glitchIntensity: number;
  screenShakeIntensity: number;
  textFrequency: number;
  chorusEffectMultiplier: number;
};

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

export const effectPresetConfigs: Record<EffectPresetName, EffectPresetConfig> = {
  標準: {
    sfxFrequency: clamp(0.58, 0, 1),
    sfxScale: clamp(1.18, 0.8, 1.9),
    focusLineIntensity: clamp(1.0, 0.5, 2),
    glitchIntensity: clamp(0.2, 0, 1.8),
    screenShakeIntensity: clamp(0.95, 0.4, 1.9),
    textFrequency: clamp(0.52, 0, 1),
    chorusEffectMultiplier: clamp(1.25, 1, 2.4),
  },
  バトル: {
    sfxFrequency: clamp(0.86, 0, 1),
    sfxScale: clamp(1.62, 0.8, 1.9),
    focusLineIntensity: clamp(1.58, 0.5, 2),
    glitchIntensity: clamp(0.72, 0, 1.8),
    screenShakeIntensity: clamp(1.65, 0.4, 1.9),
    textFrequency: clamp(0.74, 0, 1),
    chorusEffectMultiplier: clamp(1.75, 1, 2.4),
  },
  エモ: {
    sfxFrequency: clamp(0.28, 0, 1),
    sfxScale: clamp(1.08, 0.8, 1.9),
    focusLineIntensity: clamp(0.62, 0.5, 2),
    glitchIntensity: clamp(0.06, 0, 1.8),
    screenShakeIntensity: clamp(0.52, 0.4, 1.9),
    textFrequency: clamp(0.44, 0, 1),
    chorusEffectMultiplier: clamp(1.15, 1, 2.4),
  },
  ライブ: {
    sfxFrequency: clamp(0.72, 0, 1),
    sfxScale: clamp(1.42, 0.8, 1.9),
    focusLineIntensity: clamp(1.2, 0.5, 2),
    glitchIntensity: clamp(0.34, 0, 1.8),
    screenShakeIntensity: clamp(1.28, 0.4, 1.9),
    textFrequency: clamp(0.82, 0, 1),
    chorusEffectMultiplier: clamp(1.62, 1, 2.4),
  },
  グリッチ: {
    sfxFrequency: clamp(0.66, 0, 1),
    sfxScale: clamp(1.46, 0.8, 1.9),
    focusLineIntensity: clamp(1.12, 0.5, 2),
    glitchIntensity: clamp(1.18, 0, 1.8),
    screenShakeIntensity: clamp(1.24, 0.4, 1.9),
    textFrequency: clamp(0.68, 0, 1),
    chorusEffectMultiplier: clamp(1.52, 1, 2.4),
  },
  サビ爆発: {
    sfxFrequency: clamp(0.88, 0, 1),
    sfxScale: clamp(1.72, 0.8, 1.9),
    focusLineIntensity: clamp(1.82, 0.5, 2),
    glitchIntensity: clamp(0.95, 0, 1.8),
    screenShakeIntensity: clamp(1.8, 0.4, 1.9),
    textFrequency: clamp(0.9, 0, 1),
    chorusEffectMultiplier: clamp(2.25, 1, 2.4),
  },
};

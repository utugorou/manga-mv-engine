import type { EffectPresetName } from "../types/mv";

export const effectPresetList: EffectPresetName[] = ["標準", "バトル", "エモ", "ライブ", "グリッチ", "サビ爆発"];

export type EffectPresetConfig = {
  sfxFrequency: number;
  sfxScale: number;
  sfxMaxCount: number;
  focusLineIntensity: number;
  glitchIntensity: number;
  screenShakeIntensity: number;
  textFrequency: number;
  chorusEffectMultiplier: number;
  fadeFlickerBlurIntensity: number;
  baseContrast: number;
  chorusThreshold: number;
};

export const effectPresetConfigs: Record<EffectPresetName, EffectPresetConfig> = {
  標準: {
    sfxFrequency: 0.65,
    sfxScale: 1.2,
    sfxMaxCount: 3,
    focusLineIntensity: 1,
    glitchIntensity: 0.45,
    screenShakeIntensity: 1,
    textFrequency: 0.55,
    chorusEffectMultiplier: 1.3,
    fadeFlickerBlurIntensity: 1,
    baseContrast: 1.05,
    chorusThreshold: 22,
  },
  バトル: {
    sfxFrequency: 0.95,
    sfxScale: 1.8,
    sfxMaxCount: 4,
    focusLineIntensity: 1.6,
    glitchIntensity: 0.9,
    screenShakeIntensity: 1.8,
    textFrequency: 0.8,
    chorusEffectMultiplier: 1.75,
    fadeFlickerBlurIntensity: 1.5,
    baseContrast: 1.22,
    chorusThreshold: 20,
  },
  エモ: {
    sfxFrequency: 0.35,
    sfxScale: 1.35,
    sfxMaxCount: 2,
    focusLineIntensity: 0.7,
    glitchIntensity: 0.2,
    screenShakeIntensity: 0.6,
    textFrequency: 0.62,
    chorusEffectMultiplier: 1.2,
    fadeFlickerBlurIntensity: 1.35,
    baseContrast: 1,
    chorusThreshold: 26,
  },
  ライブ: {
    sfxFrequency: 0.75,
    sfxScale: 1.45,
    sfxMaxCount: 3,
    focusLineIntensity: 1.3,
    glitchIntensity: 0.65,
    screenShakeIntensity: 1.35,
    textFrequency: 0.85,
    chorusEffectMultiplier: 1.65,
    fadeFlickerBlurIntensity: 1.4,
    baseContrast: 1.14,
    chorusThreshold: 21,
  },
  グリッチ: {
    sfxFrequency: 0.6,
    sfxScale: 1.5,
    sfxMaxCount: 3,
    focusLineIntensity: 0.95,
    glitchIntensity: 2,
    screenShakeIntensity: 1.25,
    textFrequency: 0.7,
    chorusEffectMultiplier: 1.45,
    fadeFlickerBlurIntensity: 1.8,
    baseContrast: 1.2,
    chorusThreshold: 23,
  },
  サビ爆発: {
    sfxFrequency: 0.45,
    sfxScale: 1.15,
    sfxMaxCount: 2,
    focusLineIntensity: 0.9,
    glitchIntensity: 0.5,
    screenShakeIntensity: 0.9,
    textFrequency: 0.5,
    chorusEffectMultiplier: 2.2,
    fadeFlickerBlurIntensity: 1,
    baseContrast: 1.06,
    chorusThreshold: 19,
  },
};

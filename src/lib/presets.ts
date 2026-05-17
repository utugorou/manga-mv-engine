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

export const effectPresetConfigs: Record<EffectPresetName, EffectPresetConfig> = {
  標準: {
    sfxFrequency: 0.6,
    sfxScale: 1.2,
    focusLineIntensity: 1,
    glitchIntensity: 0.3,
    screenShakeIntensity: 1,
    textFrequency: 0.55,
    chorusEffectMultiplier: 1.3,
  },
  バトル: {
    sfxFrequency: 0.85,
    sfxScale: 1.6,
    focusLineIntensity: 1.5,
    glitchIntensity: 0.7,
    screenShakeIntensity: 1.7,
    textFrequency: 0.75,
    chorusEffectMultiplier: 1.7,
  },
  エモ: {
    sfxFrequency: 0.35,
    sfxScale: 1.3,
    focusLineIntensity: 0.7,
    glitchIntensity: 0.15,
    screenShakeIntensity: 0.6,
    textFrequency: 0.6,
    chorusEffectMultiplier: 1.2,
  },
  ライブ: {
    sfxFrequency: 0.75,
    sfxScale: 1.4,
    focusLineIntensity: 1.2,
    glitchIntensity: 0.45,
    screenShakeIntensity: 1.3,
    textFrequency: 0.85,
    chorusEffectMultiplier: 1.6,
  },
  グリッチ: {
    sfxFrequency: 0.65,
    sfxScale: 1.5,
    focusLineIntensity: 1,
    glitchIntensity: 1.8,
    screenShakeIntensity: 1.2,
    textFrequency: 0.7,
    chorusEffectMultiplier: 1.45,
  },
  サビ爆発: {
    sfxFrequency: 0.45,
    sfxScale: 1.15,
    focusLineIntensity: 0.9,
    glitchIntensity: 0.5,
    screenShakeIntensity: 0.9,
    textFrequency: 0.5,
    chorusEffectMultiplier: 2.2,
  },
};

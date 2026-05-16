import type { MotionGroup, PanelMode, PresetName, SwitchMode, TextMode } from "../types/mv";

export const presetList: PresetName[] = ["ROCK", "POP", "FUNK", "JAZZ", "DANCE", "DISCO", "Synth Vocal", "BALLADE", "漫画BATTLE", "SIMPLE"];

export type PresetConfig = {
  switchMode: SwitchMode;
  peakSensitivity: number;
  kickSensitivity: number;
  minSwitchInterval: number;
  idealSwitchInterval: number;
  fallbackSwitchInterval: number;
  imageDuration: number;
  showGlitch: boolean;
  showEqualizer: boolean;
  showFlash: boolean;
  showPanels: boolean;
  panelMode: PanelMode;
  autoBubble: boolean;
  showBubble: boolean;
  autoSfx: boolean;
  showSfx: boolean;
  textMode: TextMode;
  chorusSensitivity: number;
  motionGroup: MotionGroup;
};

const defaultPresetConfig: PresetConfig = {
  switchMode: "equal",
  peakSensitivity: 8,
  kickSensitivity: 3,
  minSwitchInterval: 450,
  idealSwitchInterval: 900,
  fallbackSwitchInterval: 1300,
  imageDuration: 2000,
  showGlitch: false,
  showEqualizer: false,
  showFlash: true,
  showPanels: true,
  panelMode: "random",
  autoBubble: false,
  showBubble: false,
  autoSfx: false,
  showSfx: true,
  textMode: "random",
  chorusSensitivity: 22,
  motionGroup: "all",
};

export const presetConfigs: Record<PresetName, PresetConfig> = {
  ROCK: { ...defaultPresetConfig, switchMode: "peak", peakSensitivity: 9, minSwitchInterval: 500, idealSwitchInterval: 1000, fallbackSwitchInterval: 1500, showGlitch: true, showEqualizer: true, showFlash: true, showPanels: true, panelMode: "random", autoBubble: false, showBubble: false, autoSfx: true, showSfx: true, textMode: "smart", chorusSensitivity: 20, motionGroup: "battle" },
  POP: { ...defaultPresetConfig, switchMode: "equal", imageDuration: 2200, idealSwitchInterval: 2200, fallbackSwitchInterval: 2200, showGlitch: false, showEqualizer: true, showFlash: true, showPanels: false, panelMode: "fixed", autoBubble: true, showBubble: true, autoSfx: false, showSfx: false, textMode: "random", chorusSensitivity: 28, motionGroup: "calm" },
  FUNK: { ...defaultPresetConfig, switchMode: "peak", peakSensitivity: 8, minSwitchInterval: 450, idealSwitchInterval: 900, fallbackSwitchInterval: 1300, showGlitch: true, showEqualizer: true, showFlash: true, showPanels: true, panelMode: "random", autoBubble: true, showBubble: true, autoSfx: true, showSfx: true, textMode: "smart", chorusSensitivity: 21, motionGroup: "groove" },
  JAZZ: { ...defaultPresetConfig, switchMode: "equal", imageDuration: 3500, idealSwitchInterval: 3500, fallbackSwitchInterval: 3500, showGlitch: false, showEqualizer: true, showFlash: false, showPanels: false, panelMode: "fixed", autoBubble: true, showBubble: true, autoSfx: false, showSfx: false, textMode: "random", chorusSensitivity: 35, motionGroup: "calm" },
  DANCE: { ...defaultPresetConfig, switchMode: "peak", peakSensitivity: 8, minSwitchInterval: 400, idealSwitchInterval: 800, fallbackSwitchInterval: 1200, showGlitch: true, showEqualizer: true, showFlash: true, showPanels: true, panelMode: "chorus", autoBubble: false, showBubble: false, autoSfx: true, showSfx: true, textMode: "smart", chorusSensitivity: 20, motionGroup: "groove" },
  DISCO: { ...defaultPresetConfig, switchMode: "peak", peakSensitivity: 9, minSwitchInterval: 450, idealSwitchInterval: 900, fallbackSwitchInterval: 1300, showGlitch: true, showEqualizer: true, showFlash: true, showPanels: true, panelMode: "chorus", autoBubble: true, showBubble: true, autoSfx: true, showSfx: true, textMode: "smart", chorusSensitivity: 24, motionGroup: "groove" },
  "Synth Vocal": { ...defaultPresetConfig, switchMode: "peak", peakSensitivity: 8, minSwitchInterval: 400, idealSwitchInterval: 800, fallbackSwitchInterval: 1200, showGlitch: true, showEqualizer: true, showFlash: true, showPanels: true, panelMode: "random", autoBubble: true, showBubble: true, autoSfx: true, showSfx: true, textMode: "smart", chorusSensitivity: 20, motionGroup: "groove" },
  BALLADE: { ...defaultPresetConfig, switchMode: "equal", imageDuration: 4200, idealSwitchInterval: 4200, fallbackSwitchInterval: 4200, showGlitch: false, showEqualizer: false, showFlash: false, showPanels: false, panelMode: "fixed", autoBubble: true, showBubble: true, autoSfx: false, showSfx: false, textMode: "random", chorusSensitivity: 38, motionGroup: "simpleZoom" },
  "漫画BATTLE": { ...defaultPresetConfig, switchMode: "peak", peakSensitivity: 7, minSwitchInterval: 350, idealSwitchInterval: 700, fallbackSwitchInterval: 1000, showGlitch: true, showEqualizer: true, showFlash: true, showPanels: true, panelMode: "random", autoBubble: true, showBubble: true, autoSfx: true, showSfx: true, textMode: "smart", chorusSensitivity: 18, motionGroup: "battle" },
  SIMPLE: { ...defaultPresetConfig, switchMode: "equal", imageDuration: 2500, idealSwitchInterval: 2500, fallbackSwitchInterval: 2500, showGlitch: false, showEqualizer: false, showFlash: false, showPanels: false, panelMode: "fixed", autoBubble: false, showBubble: false, autoSfx: false, showSfx: false, textMode: "fixed", chorusSensitivity: 45, motionGroup: "simpleZoom" },
};

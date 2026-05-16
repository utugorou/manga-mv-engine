import type { PanelMode, PresetName, SwitchMode, TextMode } from "../types/mv";

export const presetList: PresetName[] = ["ROCK", "POP", "FUNK", "JAZZ", "DANCE", "DISCO", "Synth Vocal", "BALLADE", "漫画BATTLE", "SIMPLE"];

export type PresetConfig = {
  switchMode: SwitchMode;
  peakSensitivity: number;
  kickSensitivity: number;
  minSwitchInterval: number;
  idealSwitchInterval: number;
  fallbackSwitchInterval: number;
  imageDuration: number;
  chorusSensitivity: number;
  showGlitch: boolean;
  showEqualizer: boolean;
  showFlash: boolean;
  showPanels: boolean;
  panelMode: PanelMode;
  autoBubble: boolean;
  autoSfx: boolean;
  textMode: TextMode;
};

export const presetConfigs: Record<PresetName, Partial<PresetConfig>> = {
  ROCK: { switchMode: "peak", peakSensitivity: 9, minSwitchInterval: 500, idealSwitchInterval: 1000, fallbackSwitchInterval: 1500, chorusSensitivity: 20, showGlitch: true, showEqualizer: true, showFlash: true, showPanels: true, panelMode: "random", autoBubble: false, autoSfx: true, textMode: "smart" },
  POP: { switchMode: "equal", imageDuration: 2200, idealSwitchInterval: 2200, fallbackSwitchInterval: 2200, chorusSensitivity: 28, showGlitch: false, showEqualizer: true, showFlash: true, showPanels: false, panelMode: "fixed", autoBubble: true, autoSfx: false, textMode: "random" },
  FUNK: { switchMode: "peak", peakSensitivity: 8, minSwitchInterval: 450, idealSwitchInterval: 900, fallbackSwitchInterval: 1300, chorusSensitivity: 21, showGlitch: true, showEqualizer: true, showFlash: true, showPanels: true, panelMode: "random", autoBubble: true, autoSfx: true, textMode: "smart" },
  JAZZ: { switchMode: "equal", imageDuration: 3500, idealSwitchInterval: 3500, fallbackSwitchInterval: 3500, chorusSensitivity: 35, showGlitch: false, showEqualizer: true, showFlash: false, showPanels: false, panelMode: "fixed", autoBubble: true, autoSfx: false, textMode: "random" },
  DANCE: { switchMode: "peak", peakSensitivity: 8, minSwitchInterval: 400, idealSwitchInterval: 800, fallbackSwitchInterval: 1200, chorusSensitivity: 20, showGlitch: true, showEqualizer: true, showFlash: true, showPanels: true, panelMode: "chorus", autoBubble: false, autoSfx: true, textMode: "smart" },
  DISCO: { switchMode: "peak", peakSensitivity: 9, minSwitchInterval: 450, idealSwitchInterval: 900, fallbackSwitchInterval: 1300, chorusSensitivity: 24, showGlitch: true, showEqualizer: true, showFlash: true, showPanels: true, panelMode: "chorus", autoBubble: true, autoSfx: true, textMode: "smart" },
  "Synth Vocal": { switchMode: "peak", peakSensitivity: 8, minSwitchInterval: 400, idealSwitchInterval: 800, fallbackSwitchInterval: 1200, chorusSensitivity: 20, showGlitch: true, showEqualizer: true, showFlash: true, showPanels: true, panelMode: "random", autoBubble: true, autoSfx: true, textMode: "smart" },
  BALLADE: { switchMode: "equal", imageDuration: 4200, idealSwitchInterval: 4200, fallbackSwitchInterval: 4200, chorusSensitivity: 38, showGlitch: false, showEqualizer: false, showFlash: false, showPanels: false, panelMode: "fixed", autoBubble: true, autoSfx: false, textMode: "random" },
  "漫画BATTLE": { switchMode: "peak", peakSensitivity: 7, minSwitchInterval: 350, idealSwitchInterval: 700, fallbackSwitchInterval: 1000, chorusSensitivity: 18, showGlitch: true, showEqualizer: true, showFlash: true, showPanels: true, panelMode: "random", autoBubble: true, autoSfx: true, textMode: "smart" },
  SIMPLE: { switchMode: "equal", imageDuration: 2500, idealSwitchInterval: 2500, fallbackSwitchInterval: 2500, chorusSensitivity: 45, showGlitch: false, showEqualizer: false, showFlash: false, showPanels: false, panelMode: "fixed", autoBubble: false, autoSfx: false, textMode: "fixed" },
};

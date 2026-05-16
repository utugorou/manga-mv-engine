export type MotionType = "zoomIn" | "zoomOut" | "panLeft" | "panRight" | "shake" | "comic" | "panUp" | "panDown" | "diagonalPan" | "slowZoomIn" | "breathZoom" | "impactZoom" | "glitchJump" | "grooveBounce" | "sideGroove" | "handheld";
export type MotionGroup = "all" | "calm" | "battle" | "simpleZoom" | "groove";
export type PositionType = "topLeft" | "topRight" | "bottomLeft" | "bottomRight" | "center";
export type SwitchMode = "equal" | "peak" | "kick";
export type PanelPattern = "classic" | "vertical" | "horizontal" | "diagonal" | "action";
export type PanelMode = "fixed" | "random" | "chorus";
export type AspectRatio = "16:9" | "9:16" | "1:1" | "4:5";
export type TextMode = "fixed" | "random" | "smart";
export type AudioMood = "quiet" | "peak" | "bass" | "chorus";
export type ExportQuality = "standard" | "high";
export type ExportMode = "preview" | "canvas" | "remotion";
export type ExportStatus = "idle" | "ready" | "recording" | "finished" | "error";
export type ExportAudioStatus = "with-audio" | "video-only" | "unknown";
export type RecordingMode = "manual" | "synced";
export type PresetName = "ROCK" | "POP" | "FUNK" | "JAZZ" | "DANCE" | "DISCO" | "Synth Vocal" | "BALLADE" | "漫画BATTLE" | "SIMPLE";

export type TimelineMarker = { index: number; percent: number };

export type AutoDirectionInput = {
  activePreset: PresetName | null;
  audioMood: AudioMood;
  chorusBoost: boolean;
  eqBars: number[];
  currentImageIndex: number;
  switchMode: SwitchMode;
  showSfx: boolean;
  showBubble: boolean;
  showGlitch: boolean;
  showPanels: boolean;
};

export type AutoDirectionDecision = {
  motionType: MotionType;
  sfxText: string;
  sfxScale: number;
  sfxPosition: PositionType;
  bubbleText: string;
  bubblePosition: PositionType;
  panelPattern: PanelPattern;
  flashEnabled: boolean;
  glitchEnabled: boolean;
};

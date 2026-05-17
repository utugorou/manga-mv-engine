export type MotionType = "zoomIn" | "zoomOut" | "panLeft" | "panRight" | "shake" | "comic" | "panUp" | "panDown" | "diagonalPan" | "slowZoomIn" | "breathZoom" | "impactZoom" | "glitchJump" | "grooveBounce" | "sideGroove" | "handheld";
export type MotionGroup = "all" | "calm" | "battle" | "simpleZoom" | "groove";
export type PositionType = "topLeft" | "topRight" | "bottomLeft" | "bottomRight" | "center";
export type SwitchMode = "equal" | "peak" | "kick";
export type PanelPattern = "full" | "split-horizontal" | "split-vertical" | "triple-vertical" | "triple-horizontal" | "big-plus-small" | "diagonal" | "four-panel" | "center-focus" | "battle-break";
export type PanelMode = "fixed" | "random" | "chorus";
export type AspectRatio = "16:9" | "9:16" | "1:1" | "4:5";
export type TextMode = "fixed" | "random" | "smart";
export type AudioMood = "quiet" | "peak" | "bass" | "chorus";
export type ExportQuality = "standard" | "high";
export type ExportMode = "preview" | "canvas" | "remotion";
export type ExportStatus = "idle" | "ready" | "recording" | "finished" | "error";
export type ExportAudioStatus = "with-audio" | "video-only" | "unknown";
export type RecordingMode = "manual" | "synced";
export type EffectPresetName = "標準" | "バトル" | "エモ" | "ライブ" | "グリッチ" | "サビ爆発";
export type MotionAmplitude = "normal" | "x2" | "x3";
export type EqualizerType = "bars" | "wideBars" | "mirror" | "wave" | "glitchEq" | "pulse" | "circle";
export type BubbleVariant = "normal" | "spiky" | "thought";

export type TimelineMarker = { index: number; percent: number };

export type SfxItem = {
  id: string;
  text: string;
  position: "topLeft" | "top" | "topRight" | "left" | "center" | "right" | "bottomLeft" | "bottom" | "bottomRight" | "random";
  scale: number;
  rotation: number;
};

export type PresetName = EffectPresetName;

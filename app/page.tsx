"use client";

import { useCallback, useEffect, useRef, useState, type SyntheticEvent } from "react";
import ControlButtons from "../src/components/ControlButtons";
import Timeline from "../src/components/Timeline";
import UploadPanel from "../src/components/UploadPanel";
import PreviewStage from "../src/components/PreviewStage";
import ExportPanel from "../src/components/ExportPanel";
import PresetPanel from "../src/components/PresetPanel";
import SettingsPanel from "../src/components/SettingsPanel";
import { effectPresetConfigs, effectPresetList } from "../src/lib/presets";
import {
  bubbleTexts,
  sfxTexts,
  smartBubbleTexts,
  smartSfxTexts,
} from "../src/lib/textEngine";
import { getExportQualityLabel, getExportResolution } from "../src/lib/exportHelpers";
import { withBasePath } from "../src/lib/assetPath";
import {
  createExportCanvas,
  drawImageToCanvas,
  drawEqualizerBars,
  drawFlash,
  drawSfxText,
  drawSpeechBubble,
  startCanvasRecording,
  stopCanvasRecording,
  selectRecordingFormat,
} from "../src/lib/canvasRecorder";
import type {
  AspectRatio,
  AudioMood,
  ExportMode,
  ExportAudioStatus,
  ExportQuality,
  RecordingMode,
  ExportStatus,
  MotionType,
  PanelMode,
  PanelPattern,
  PositionType,
  EffectPresetName,
  EqualizerType,
  EqualizerColorTheme,
  MotionAmplitude,
  SfxItem,
  SwitchMode,
  TextMode,
  BubbleVariant,
  ExportFormatPreference,
  RecordingContainer,
  RecordingStreamDiagnostics,
} from "../src/types/mv";

const randomItem = <T,>(list: T[]): T => {
  return list[Math.floor(Math.random() * list.length)];
};

type AppLogoProps = {
  src: string;
  onError: (event: SyntheticEvent<HTMLImageElement>) => void;
  isError: boolean;
  className?: string;
};

const AppLogo = ({ src, onError, isError, className }: AppLogoProps) => {
  if (isError) {
    return (
      <span className="text-lg sm:text-xl md:text-2xl font-black tracking-[0.12em] md:tracking-[0.16em] leading-none">MANGA MV ENGINE</span>
    );
  }

  return (
    <img
      src={src}
      alt="manga-mv-engine"
      loading="eager"
      fetchPriority="high"
      onError={onError}
      className={className ?? "h-8 sm:h-9 md:h-10 lg:h-11 w-auto max-w-[70vw] md:max-w-[min(70vw,20rem)] object-contain opacity-95 drop-shadow-[0_0_14px_rgba(217,70,239,0.45)]"}
    />
  );
};

export default function Home() {
  const SETTINGS_STORAGE_KEY = "manga-mv-engine:settings:v1";
  const SETTINGS_LIST_STORAGE_KEY = "manga-mv-engine:settings-list:v1";
  const DEFAULT_PRESET: EffectPresetName = "標準";
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const recordingFrameRef = useRef<number | null>(null);
  const recordingCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingStopTimeoutRef = useRef<number | null>(null);
  const recordingEndedHandlerRef = useRef<(() => void) | null>(null);
  const latestSelectedImageRef = useRef<string | null>(null);
  const latestSfxTextRef = useRef("");
  const latestSfxItemsRef = useRef<SfxItem[]>([]);
  const latestBubbleTextRef = useRef("");
  const latestSfxPositionRef = useRef<PositionType>("bottomLeft");
  const latestBubblePositionRef = useRef<PositionType>("topRight");
  const latestBubbleVariantRef = useRef<BubbleVariant>("normal");
  const latestBubbleScaleRef = useRef<1 | 2>(1);
  const latestSfxViewportScaleRef = useRef(1);
  const latestShowSfxRef = useRef(true);
  const latestShowBubbleRef = useRef(false);
  const latestShowGlitchRef = useRef(false);
  const latestShowEqualizerRef = useRef(false);
  const latestEqBarsRef = useRef<number[]>(Array(12).fill(20));
  const latestShowPanelsRef = useRef(true);
  const latestPanelPatternRef = useRef<PanelPattern>("full");
  const latestSfxScaleRef = useRef(1);
  const latestFlashActiveRef = useRef(false);
  const latestChorusBoostRef = useRef(false);
  const latestCurrentImageIndexRef = useRef(0);
  const latestImagesRef = useRef<string[]>([]);
  const latestSwitchModeRef = useRef<SwitchMode>("equal");
  const latestImageDurationRef = useRef(2000);
  const latestImageMotionsRef = useRef<MotionType[]>([]);
  const latestTextSceneIndexRef = useRef<number | null>(null);
  const recordingStartedAtRef = useRef<number | null>(null);
  const recordingElapsedMsRef = useRef(0);
  const recordingFpsRef = useRef(30);
  const equalModeFallbackStartedAtRef = useRef<number | null>(null);

  const lastSwitchTimeRef = useRef(0);
  const wasAboveThresholdRef = useRef(false);
  const lastLowEnergyRef = useRef(0);
  const audioMoodRef = useRef<AudioMood>("quiet");

  const [images, setImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [imageMotions, setImageMotions] = useState<MotionType[]>([]);
  const [randomMotionApplied, setRandomMotionApplied] = useState(false);

  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioName, setAudioName] = useState("");
  const [audioUploadError, setAudioUploadError] = useState("");
  const [audioDuration, setAudioDuration] = useState(0);
  const [audioDurationState, setAudioDurationState] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [currentTime, setCurrentTime] = useState(0);

  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("16:9");

  const [exportMode] = useState<ExportMode>("preview");
  const [exportQuality, setExportQuality] =
    useState<ExportQuality>("standard");
  const qualityProfiles: Record<ExportQuality, { fps: number; videoBitsPerSecond: number; audioBitsPerSecond: number }> = {
    stable: { fps: 24, videoBitsPerSecond: 2_500_000, audioBitsPerSecond: 128_000 },
    standard: { fps: 30, videoBitsPerSecond: 5_000_000, audioBitsPerSecond: 160_000 },
    high: { fps: 30, videoBitsPerSecond: 8_000_000, audioBitsPerSecond: 192_000 },
  };
  const [exportStatus, setExportStatus] = useState<ExportStatus>("idle");
  const [exportMessage, setExportMessage] = useState("未準備");
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);
  const [exportAudioStatus, setExportAudioStatus] = useState<ExportAudioStatus>("unknown");
  const [recordingMode, setRecordingMode] = useState<RecordingMode | null>(null);
  const [autoRecordEnabled, setAutoRecordEnabled] = useState(true);
  const [exportFormatPreference, setExportFormatPreference] = useState<ExportFormatPreference>("auto");
  const [recordedFileExtension, setRecordedFileExtension] = useState<RecordingContainer | null>(null);
  const [mp4FallbackMessage, setMp4FallbackMessage] = useState<string | null>(null);
  const [recordingStreamDiagnostics, setRecordingStreamDiagnostics] = useState<RecordingStreamDiagnostics | null>(null);
  const autoStopTriggeredRef = useRef(false);

  const [showBubble, setShowBubble] = useState(false);
  const [bubbleText, setBubbleText] = useState("ここにセリフ");
  const [bubblePosition, setBubblePosition] =
    useState<PositionType>("topRight");
  const [autoBubble, setAutoBubble] = useState(false);
  const [bubbleVariant, setBubbleVariant] = useState<BubbleVariant>("normal");
  const [bubbleScale, setBubbleScale] = useState<1 | 2>(1);

  const [showSfx, setShowSfx] = useState(true);
  const [sfxText, setSfxText] = useState("ドン!!");
  const [sfxItems, setSfxItems] = useState<SfxItem[]>([]);
  const [sfxPosition, setSfxPosition] =
    useState<PositionType>("bottomLeft");
  const [autoSfx, setAutoSfx] = useState(false);
  const [randomSfxScaleEnabled, setRandomSfxScaleEnabled] = useState(true);
  const [randomSfxCountEnabled, setRandomSfxCountEnabled] = useState(true);
  const [sfxScale, setSfxScale] = useState(1);

  const [textMode, setTextMode] = useState<TextMode>("random");

  const [showGlitch, setShowGlitch] = useState(false);
  const [showEqualizer, setShowEqualizer] = useState(false);
  const [equalizerType, setEqualizerType] = useState<EqualizerType>("bars");
  const [equalizerColorTheme, setEqualizerColorTheme] = useState<EqualizerColorTheme>("neon");
  const [eqBars, setEqBars] = useState<number[]>(Array(16).fill(20));

  const [showFlash, setShowFlash] = useState(true);
  const [flashActive, setFlashActive] = useState(false);

  const [showPanels, setShowPanels] = useState(true);
  const [panelBurst, setPanelBurst] = useState(false);
  const [panelPattern, setPanelPattern] =
    useState<PanelPattern>("full");
  const [panelMode, setPanelMode] = useState<PanelMode>("random");

  const [chorusBoost, setChorusBoost] = useState(false);
  const [audioMood, setAudioMood] = useState<AudioMood>("quiet");
  const [chorusSensitivity, setChorusSensitivity] = useState(22);

  const [sfxFrequency, setSfxFrequency] = useState(0.65);
  const [sfxMaxCount, setSfxMaxCount] = useState(2);
  const [focusLineIntensity, setFocusLineIntensity] = useState(1);
  const [, setGlitchIntensity] = useState(0.45);
  const [, setScreenShakeIntensity] = useState(1);
  const [textFrequency, setTextFrequency] = useState(0.55);
  const [, setChorusEffectMultiplier] = useState(1.3);
  const [fadeFlickerBlurIntensity] = useState(1);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isLogoLoadError, setIsLogoLoadError] = useState(false);
  const [logoErrorSrc, setLogoErrorSrc] = useState("");
  const logoSrc = withBasePath("/ui/manga-mv-engine-logo.png?v=1");

  const handleLogoLoadError = useCallback((event: SyntheticEvent<HTMLImageElement>) => {
    const failedSrc = event.currentTarget.currentSrc || event.currentTarget.src || logoSrc;
    setLogoErrorSrc(failedSrc);
    setIsLogoLoadError(true);
    console.error("[AppLogo] Failed to load logo image", { failedSrc });
  }, [logoSrc]);

  const [switchMode, setSwitchMode] = useState<SwitchMode>("equal");
  const [imageDuration, setImageDuration] = useState(2000);
  const [peakSensitivity, setPeakSensitivity] = useState(8);
  const [kickSensitivity, setKickSensitivity] = useState(3);
  const [minSwitchInterval, setMinSwitchInterval] = useState(450);
  const [idealSwitchInterval, setIdealSwitchInterval] = useState(900);
  const [fallbackSwitchInterval, setFallbackSwitchInterval] = useState(1300);

  const [selectedMotion, setSelectedMotion] =
    useState<MotionType>("zoomIn");
  const [motionAmplitude, setMotionAmplitude] = useState<MotionAmplitude>("normal");

  const [activePreset, setActivePreset] = useState<EffectPresetName>("標準");
  const [customControls, setCustomControls] = useState({
    sfxAmount: 65,
    sfxSize: 24,
    focusLine: 33,
    glitch: 23,
    shake: 33,
    textFrequency: 55,
    chorusMultiplier: 1.3,
  });
  const [isCustomAdjusted, setIsCustomAdjusted] = useState(false);
  const [settingsName, setSettingsName] = useState("マイ設定");
  const [settingsStatus, setSettingsStatus] = useState("");
  type SavedSettingsSlot = {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    settings: {
      activePreset: EffectPresetName;
      customControls: typeof customControls;
      textMode: TextMode;
      bubbleText: string;
      sfxText: string;
      settingsName: string;
    };
  };
  const [savedSettingsList, setSavedSettingsList] = useState<SavedSettingsSlot[]>([]);
  const [selectedSettingsId, setSelectedSettingsId] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState<"assets" | "text" | "effects" | "export">("assets");
  const [isMobileViewport, setIsMobileViewport] = useState(false);

  const getEqualModeElapsedSeconds = (
    fallbackStartedAtRef: React.MutableRefObject<number | null>
  ): number => {
    const audioCurrentTime = audioRef.current?.currentTime;
    if (
      typeof audioCurrentTime === "number" &&
      Number.isFinite(audioCurrentTime) &&
      audioCurrentTime >= 0
    ) {
      return audioCurrentTime;
    }
    const startedAt = fallbackStartedAtRef.current ?? performance.now();
    if (fallbackStartedAtRef.current === null) fallbackStartedAtRef.current = startedAt;
    return Math.max(0, (performance.now() - startedAt) / 1000);
  };

  const getEqualModeSceneIndex = (
    elapsedSeconds: number,
    intervalSeconds: number,
    sceneCountRaw: number
  ): number => {
    const safeSceneCount = Math.max(1, sceneCountRaw);
    const safeIntervalSeconds = Math.max(0.001, intervalSeconds);
    return (
      Math.floor(Math.max(0, elapsedSeconds) / safeIntervalSeconds) %
      safeSceneCount
    );
  };


  const mapPresetToControls = (config: (typeof effectPresetConfigs)[EffectPresetName]) => ({
    sfxAmount: Math.round(config.sfxFrequency * 100),
    sfxSize: Math.round(Math.min(100, Math.max(0, (config.sfxScale - 1) * 30))),
    focusLine: Math.round(Math.min(100, config.focusLineIntensity * 33)),
    glitch: Math.round(Math.min(100, config.glitchIntensity * 50)),
    shake: Math.round(Math.min(100, config.screenShakeIntensity * 33)),
    textFrequency: Math.round(config.textFrequency * 100),
    chorusMultiplier: Math.min(3, Math.max(1, config.chorusEffectMultiplier)),
  });

  const applyCustomControls = (controls: typeof customControls) => {
    const sfxAmountNormalized = controls.sfxAmount / 100;
    setSfxFrequency(sfxAmountNormalized);
    setSfxMaxCount(Math.min(4, Math.round(sfxAmountNormalized * 4)));
    setSfxScale(1 + controls.sfxSize / 30);
    setFocusLineIntensity(Math.max(0, controls.focusLine / 33));
    const glitchValue = Math.max(0, controls.glitch / 50);
    setGlitchIntensity(glitchValue);
    setShowGlitch(glitchValue > 0);
    setScreenShakeIntensity(Math.max(0, controls.shake / 33));
    setTextFrequency(controls.textFrequency / 100);
    setChorusEffectMultiplier(controls.chorusMultiplier);
  };



  const motionAmplitudeValue = motionAmplitude === "x2" ? 2 : motionAmplitude === "x3" ? 3 : 1;
  const presetMotionMultiplier: Record<EffectPresetName, number> = { "標準": 1, "エモ": 0.9, "バトル": 1.35, "ライブ": 1.5, "サビ爆発": 1.8 };
  const eqPresetType: Record<EffectPresetName, EqualizerType> = { "標準": "bars", "エモ": "wave", "バトル": "mirror", "ライブ": "wideBars", "サビ爆発": "laser" };
  const eqPresetColor: Record<EffectPresetName, EqualizerColorTheme> = { "標準": "neon", "エモ": "pink", "バトル": "redBlue", "ライブ": "rainbow", "サビ爆発": "yellowBlack" };
  const getActiveMediaElement = () => audioRef.current;

  const getRecordingAudioElement = () => audioRef.current;

  useEffect(() => {
    latestSelectedImageRef.current = selectedImage;
  }, [selectedImage]);

  useEffect(() => {
    latestSfxTextRef.current = sfxText;
  }, [sfxText]);
  useEffect(() => { latestSfxItemsRef.current = sfxItems; }, [sfxItems]);

  useEffect(() => {
    latestBubbleTextRef.current = bubbleText;
  }, [bubbleText]);

  useEffect(() => { latestSfxPositionRef.current = sfxPosition; }, [sfxPosition]);
  useEffect(() => { latestBubblePositionRef.current = bubblePosition; }, [bubblePosition]);
  useEffect(() => { latestBubbleVariantRef.current = bubbleVariant; }, [bubbleVariant]);
  useEffect(() => { latestBubbleScaleRef.current = bubbleScale; }, [bubbleScale]);
  useEffect(() => { latestSfxViewportScaleRef.current = isMobileViewport ? 0.5 : 1; }, [isMobileViewport]);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobileViewport(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  useEffect(() => { latestShowSfxRef.current = showSfx; }, [showSfx]);
  useEffect(() => { latestShowBubbleRef.current = showBubble; }, [showBubble]);
  useEffect(() => { latestShowGlitchRef.current = showGlitch; }, [showGlitch]);
  useEffect(() => { latestShowEqualizerRef.current = showEqualizer; }, [showEqualizer]);
  useEffect(() => { latestEqBarsRef.current = eqBars; }, [eqBars]);
  useEffect(() => { latestShowPanelsRef.current = showPanels; }, [showPanels]);
  useEffect(() => { latestPanelPatternRef.current = panelPattern; }, [panelPattern]);
  useEffect(() => { latestSfxScaleRef.current = sfxScale; }, [sfxScale]);
  useEffect(() => { latestFlashActiveRef.current = flashActive; }, [flashActive]);
  useEffect(() => { latestChorusBoostRef.current = chorusBoost; }, [chorusBoost]);
  useEffect(() => { latestCurrentImageIndexRef.current = currentImageIndex; }, [currentImageIndex]);
  useEffect(() => { latestImagesRef.current = images; }, [images]);
  useEffect(() => { latestSwitchModeRef.current = switchMode; }, [switchMode]);
  useEffect(() => { latestImageDurationRef.current = imageDuration; }, [imageDuration]);
  useEffect(() => { latestImageMotionsRef.current = imageMotions; }, [imageMotions]);
  const motionList: MotionType[] = [
    "zoomIn",
    "zoomOut",
    "panLeft",
    "panRight",
    "shake",
    "comic",
    "panUp",
    "panDown",
    "diagonalPan",
    "slowZoomIn",
    "breathZoom",
    "impactZoom",
    "glitchJump",
    "grooveBounce",
    "sideGroove",
    "handheld",
  ];

  const calmMotionList: MotionType[] = [
    "slowZoomIn",
    "breathZoom",
    "zoomIn",
    "zoomOut",
    "panDown",
  ];

  const battleMotionList: MotionType[] = ["shake", "comic", "impactZoom", "glitchJump"];
  const grooveMotionList: MotionType[] = ["grooveBounce", "sideGroove", "diagonalPan", "panUp"];

  const panelPatternByPreset: Record<EffectPresetName, PanelPattern[]> = {
    標準: ["full", "split-horizontal", "split-vertical", "four-panel"],
    バトル: ["diagonal", "big-plus-small", "battle-break", "center-focus"],
    エモ: ["full", "split-horizontal", "center-focus"],
    ライブ: ["triple-vertical", "triple-horizontal", "split-vertical", "full"],
    サビ爆発: ["center-focus", "battle-break", "big-plus-small", "diagonal"],
  };
  const getSafePanelCandidates = useCallback((preset: EffectPresetName): PanelPattern[] => {
    const candidates = panelPatternByPreset[preset] ?? panelPatternByPreset[DEFAULT_PRESET];
    return candidates.length > 0 ? candidates : ["full", "split-horizontal"];
  }, [panelPatternByPreset]);
  const pickStablePanelPattern = useCallback((sceneIndexRaw: number, preset: EffectPresetName): PanelPattern => {
    const candidates = getSafePanelCandidates(preset);
    const sceneIndex = Number.isFinite(sceneIndexRaw) ? Math.max(0, Math.floor(sceneIndexRaw)) : 0;
    const seed = `${preset}:${sceneIndex}`;
    let hash = 2166136261;
    for (let i = 0; i < seed.length; i++) {
      hash ^= seed.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return candidates[Math.abs(hash) % candidates.length] ?? "full";
  }, [getSafePanelCandidates]);

  const positions: PositionType[] = [
    "topLeft",
    "topRight",
    "bottomLeft",
    "bottomRight",
    "center",
  ];
  const sfxScaleOptions = [1, 2, 3, 4, 5, 7] as const;



  const sfxPositions = ["topLeft", "top", "topRight", "left", "center", "right", "bottomLeft", "bottom", "bottomRight", "random"] as const;
  const aspectList: AspectRatio[] = ["16:9", "9:16", "1:1", "4:5"];
  const aspectLabels: Record<AspectRatio, string> = {
    "16:9": "横長 16:9",
    "9:16": "縦長 9:16",
    "1:1": "正方形 1:1",
    "4:5": "縦SNS 4:5",
  };

  const handleRandomSfxScaleEnabled = (value: boolean) => {
    setRandomSfxScaleEnabled(value);
    if (!value) {
      setSfxScale(1);
    }
  };


  const formatTime = (time: number) => {
    if (!Number.isFinite(time)) return "0:00";

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const formatPreview = typeof window === "undefined"
    ? { supportsMp4: false, actualFormat: "webm" as RecordingContainer, selectedMimeType: null }
    : selectRecordingFormat(exportFormatPreference);

  const getPreviewSizeClass = () => {
    switch (aspectRatio) {
      case "16:9":
        return "w-full max-w-[960px] aspect-[16/9]";
      case "9:16":
        return "w-full max-w-[460px] aspect-[9/16]";
      case "1:1":
        return "w-full max-w-[640px] aspect-square";
      case "4:5":
        return "w-full max-w-[560px] aspect-[4/5]";
      default:
        return "w-full max-w-[960px] aspect-[16/9]";
    }
  };

  const pickBubbleText = () => {
    if (textMode === "fixed") {
      return bubbleText;
    }

    if (textMode === "smart") {
      return smartBubbleTexts[audioMoodRef.current][Math.floor(Math.random() * smartBubbleTexts[audioMoodRef.current].length)];
    }

    return bubbleTexts[Math.floor(Math.random() * bubbleTexts.length)];
  };

  const pickSfxText = () => {
    if (textMode === "fixed") {
      return sfxText;
    }

    if (textMode === "smart") {
      return smartSfxTexts[audioMoodRef.current][Math.floor(Math.random() * smartSfxTexts[audioMoodRef.current].length)];
    }

    return sfxTexts[Math.floor(Math.random() * sfxTexts.length)];
  };

  const randomizeMotionsFromList = (list: MotionType[]) => {
    if (images.length === 0) {
      setRandomMotionApplied(false);
      return;
    }

    const updated = images.map(() => list[Math.floor(Math.random() * list.length)]);
    setImageMotions(updated);
    setRandomMotionApplied(true);
  };

  const applyPreset = (preset: EffectPresetName) => {
    setActivePreset(preset);
    setChorusBoost(false);

    wasAboveThresholdRef.current = false;
    lastLowEnergyRef.current = 0;
    lastSwitchTimeRef.current = 0;
    audioMoodRef.current = "quiet";
    setAudioMood("quiet");

    const config = effectPresetConfigs[preset];
    const controls = mapPresetToControls(config);
    setCustomControls(controls);
    setIsCustomAdjusted(false);

    setShowGlitch(config.glitchIntensity > 0);
    setShowEqualizer(true);
    setEqualizerType(eqPresetType[preset]);
    setEqualizerColorTheme(eqPresetColor[preset]);
    setShowFlash(true);
    setShowPanels(true);
    setPanelMode("random");
    setPanelPattern(pickStablePanelPattern(currentImageIndex, preset));
    setAutoBubble(true);
    setShowBubble(false);
    setAutoSfx(true);
    setShowSfx(true);
    setTextMode("smart");
    applyCustomControls(controls);

    if (preset === "エモ") {
      randomizeMotionsFromList(calmMotionList);
      return;
    }
    if (preset === "標準") {
      randomizeMotionsFromList(motionList);
      return;
    }
    if (preset === "ライブ") {
      randomizeMotionsFromList(grooveMotionList);
      return;
    }
    randomizeMotionsFromList(battleMotionList);
  };

  const applySavedSettings = (saved: {
    activePreset: EffectPresetName;
    customControls: typeof customControls;
    textMode?: TextMode;
    bubbleText?: string;
    sfxText?: string;
    settingsName?: string;
  }) => {
    const preset = effectPresetList.includes(saved.activePreset)
      ? saved.activePreset
      : DEFAULT_PRESET;
    applyPreset(preset);
    setCustomControls(saved.customControls);
    setIsCustomAdjusted(true);
    applyCustomControls(saved.customControls);
    if (saved.textMode) setTextMode(saved.textMode);
    if (typeof saved.bubbleText === "string") setBubbleText(saved.bubbleText);
    if (typeof saved.sfxText === "string") setSfxText(saved.sfxText);
    if (saved.settingsName) setSettingsName(saved.settingsName);
  };

  const createCurrentSettingsPayload = () => ({
    activePreset,
    customControls,
    textMode,
    bubbleText,
    sfxText,
    settingsName,
  });

  const syncSettingsList = (nextList: SavedSettingsSlot[]) => {
    setSavedSettingsList(nextList);
    try {
      localStorage.setItem(SETTINGS_LIST_STORAGE_KEY, JSON.stringify(nextList));
    } catch {
      setSettingsStatus("保存に失敗しました。ブラウザの保存容量を確認してください");
    }
  };

  const createSlotId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;




  const saveAsNewSlot = () => {
    const trimmedName = settingsName.trim() || "マイ設定";
    const now = new Date().toISOString();
    const newSlot: SavedSettingsSlot = {
      id: createSlotId(),
      name: trimmedName,
      createdAt: now,
      updatedAt: now,
      settings: { ...createCurrentSettingsPayload(), settingsName: trimmedName },
    };
    const nextList = [newSlot, ...savedSettingsList];
    syncSettingsList(nextList);
    setSelectedSettingsId(newSlot.id);
    setSettingsStatus(`「${trimmedName}」を新規保存しました`);
  };

  const overwriteSelectedSlot = () => {
    if (!selectedSettingsId) {
      setSettingsStatus("上書き対象のスロットを選択してください");
      return;
    }
    const trimmedName = settingsName.trim() || "マイ設定";
    const now = new Date().toISOString();
    const nextList = savedSettingsList.map((slot) => (slot.id === selectedSettingsId
      ? {
        ...slot,
        name: trimmedName,
        updatedAt: now,
        settings: { ...createCurrentSettingsPayload(), settingsName: trimmedName },
      }
      : slot));
    syncSettingsList(nextList);
    setSettingsStatus(`「${trimmedName}」を上書き保存しました`);
  };

  const loadSlot = (slotId: string) => {
    const slot = savedSettingsList.find((item) => item.id === slotId);
    if (!slot) {
      setSettingsStatus("保存設定が見つかりません");
      return;
    }
    applySavedSettings(slot.settings);
    setSelectedSettingsId(slot.id);
    setSettingsName(slot.name);
    setSettingsStatus(`「${slot.name}」を読み込みました`);
  };

  const deleteSlot = (slotId: string) => {
    const slot = savedSettingsList.find((item) => item.id === slotId);
    const nextList = savedSettingsList.filter((item) => item.id !== slotId);
    syncSettingsList(nextList);
    if (selectedSettingsId === slotId) {
      setSelectedSettingsId(null);
    }
    setSettingsStatus(slot ? `「${slot.name}」を削除しました` : "保存設定を削除しました");
  };

  const resetToDefaultSettings = () => {
    applyPreset(DEFAULT_PRESET);
    setTextMode("random");
    setBubbleText("ここにセリフ");
    setSfxText("ドン!!");
    setSettingsStatus("初期設定に戻しました");
  };



  const handleCustomControlChange = (
    key: keyof typeof customControls,
    value: number,
  ) => {
    const next = { ...customControls, [key]: value };
    setCustomControls(next);
    setIsCustomAdjusted(true);
    applyCustomControls(next);
  };


  const triggerFlash = () => {
    if (!showFlash) return;

    setFlashActive(true);

    setTimeout(() => {
      setFlashActive(false);
    }, (chorusBoost ? 180 : 120) * fadeFlickerBlurIntensity);
  };

  const triggerPanelBurst = () => {
    if (!showPanels) return;

    if (panelMode === "random" || (panelMode === "chorus" && chorusBoost)) {
      const safeIndex = Number.isFinite(latestCurrentImageIndexRef.current) ? latestCurrentImageIndexRef.current : 0;
      setPanelPattern(pickStablePanelPattern(safeIndex, activePreset));
    }

    setPanelBurst(true);

    setTimeout(() => {
      setPanelBurst(false);
    }, 260 / Math.max(0.6, focusLineIntensity));
  };


  const generateSfxItems = () => {
    const maxCount = Math.min(2, Math.max(0, sfxMaxCount));
    const count = sfxFrequency <= 0
      ? 0
      : (randomSfxCountEnabled
        ? Math.floor(Math.random() * (maxCount + 1))
        : Math.min(1, maxCount));
    const unifiedText = pickSfxText();
    const unifiedScale = randomSfxScaleEnabled
      ? [...sfxScaleOptions][Math.floor(Math.random() * sfxScaleOptions.length)] * sfxFrequency
      : sfxScale;

    return Array.from({ length: count }, (_, i) => ({
      id: `${Date.now()}-${i}-${Math.random().toString(36).slice(2, 8)}`,
      text: unifiedText,
      position: [...sfxPositions][Math.floor(Math.random() * sfxPositions.length)],
      scale: unifiedScale,
      rotation: Math.floor(Math.random() * 37) - 18,
    }));
  };

  const weightedBubbleVariant = useCallback(() => {
    const roll = Math.random();
    if (activePreset === "バトル" || activePreset === "サビ爆発") return roll < 0.6 ? "spiky" : roll < 0.8 ? "normal" : "thought";
    if (activePreset === "エモ") return roll < 0.5 ? "normal" : "thought";
    return roll < 0.55 ? "normal" : roll < 0.8 ? "spiky" : "thought";
  }, [activePreset]);

  const regenerateSceneTexts = useCallback(() => {
    if (autoBubble && Math.random() <= textFrequency) {
      setShowBubble(true);
      setBubbleText(pickBubbleText());
      setBubblePosition(positions[Math.floor(Math.random() * positions.length)]);
      setBubbleVariant(weightedBubbleVariant());
      setBubbleScale(Math.random() < 0.5 ? 1 : 2);
    }

    if (autoSfx && Math.random() <= sfxFrequency) {
      setShowSfx(true);
      const items = generateSfxItems();
      setSfxItems(items);
      setSfxText(items[0]?.text ?? pickSfxText());
      setSfxPosition((items[0]?.position === "random" ? "center" : (items[0]?.position ?? "bottomLeft")) as PositionType);
      setSfxScale(items[0]?.scale ?? 1);
    }
  }, [autoBubble, autoSfx, pickBubbleText, pickSfxText, positions, sfxFrequency, textFrequency, weightedBubbleVariant]);

  const updateScene = useCallback((nextIndex: number, nextImage: string | null, shouldRegenerateTexts: boolean) => {
    setCurrentImageIndex(nextIndex);
    setSelectedImage(nextImage);
    if (panelMode === "random") setPanelPattern(pickStablePanelPattern(nextIndex, activePreset));
    if (shouldRegenerateTexts && latestTextSceneIndexRef.current !== nextIndex) {
      latestTextSceneIndexRef.current = nextIndex;
      regenerateSceneTexts();
    }
  }, [activePreset, panelMode, pickStablePanelPattern, regenerateSceneTexts]);

  const stepToNextImage = useCallback(() => {
    if (images.length === 0) return;

    triggerFlash();
    triggerPanelBurst();

    setCurrentImageIndex((prev) => {
      const nextIndex = (prev + 1) % images.length;
      const nextImage = images[nextIndex] ?? null;
      setSelectedImage(nextImage);
      latestTextSceneIndexRef.current = nextIndex;
      regenerateSceneTexts();

      return nextIndex;
    });
  }, [
    images,
    regenerateSceneTexts,
    triggerFlash,
    triggerPanelBurst,
  ]);

  const stopAnalysisLoop = () => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };

  const setupAudioAnalysis = async () => {
    const mediaElement = getActiveMediaElement();
    if (!mediaElement) return;

    const AudioContextClass =
      window.AudioContext ||
      (window as typeof window & { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;

    if (!AudioContextClass) {
      throw new Error("AudioContext is not supported");
    }

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContextClass();
    }

    if (audioContextRef.current.state === "suspended") {
      await audioContextRef.current.resume();
    }

    if (!analyserRef.current) {
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 2048;
      analyserRef.current.smoothingTimeConstant = 0.82;
    }

    if (!sourceRef.current) {
      sourceRef.current = audioContextRef.current.createMediaElementSource(
        mediaElement
      );

      sourceRef.current.connect(analyserRef.current);
      analyserRef.current.connect(audioContextRef.current.destination);
    }
  };

  const startAnalysisLoop = () => {
    const mediaElement = getActiveMediaElement();
    if (!analyserRef.current || !mediaElement) return;

    stopAnalysisLoop();

    const analyser = analyserRef.current;
    const audio = mediaElement;

    const freqData = new Uint8Array(analyser.frequencyBinCount);
    const timeData = new Uint8Array(analyser.fftSize);

    const tick = () => {
      try {
        analyser.getByteFrequencyData(freqData);
        analyser.getByteTimeDomainData(timeData);
      } catch (error) {
        console.error("Audio analyser update failed", error);
      }

      const barCount = 16;
      const safeFreqLength = freqData.length;
      const chunkSize = Math.max(1, Math.floor(safeFreqLength / barCount));

      let sumSquares = 0;

      for (let i = 0; i < timeData.length; i++) {
        const normalized = (timeData[i] - 128) / 128;
        sumSquares += normalized * normalized;
      }

      const rms =
        timeData.length > 0 ? Math.sqrt(sumSquares / timeData.length) : 0;
      const overall = rms * 100;

      let nextBars: number[] = Array.from({ length: barCount }, () => 4);

      try {
        nextBars = Array.from({ length: barCount }, (_, index) => {
          const start = index * chunkSize;
          const end = Math.min(start + chunkSize, safeFreqLength);

          let sum = 0;
          let count = 0;

          for (let i = start; i < end; i++) {
            sum += freqData[i];
            count += 1;
          }

          const avg = count > 0 ? sum / count : 0;
          const boosted = (avg / 255) * 100 + overall * 0.35;
          return Math.max(4, Math.round(boosted));
        });
      } catch (error) {
        console.error("Equalizer bar calculation failed", error);
      }

      setEqBars(nextBars);
      setCurrentTime(audio.currentTime);

      const chorusThreshold = chorusSensitivity / 100;
      const isChorusNow = rms > chorusThreshold;

      setChorusBoost(isChorusNow);

      const lowBinCount = Math.min(
        safeFreqLength,
        Math.max(1, Math.floor(safeFreqLength * 0.06))
      );

      let lowSum = 0;

      for (let i = 0; i < lowBinCount; i++) {
        lowSum += freqData[i] ?? 0;
      }

      const lowEnergy = lowBinCount > 0 ? lowSum / lowBinCount / 255 : 0;
      const lowSpike = lowEnergy - lastLowEnergyRef.current;

      if (isChorusNow) {
        audioMoodRef.current = "chorus";
      } else if (lowEnergy > 0.22) {
        audioMoodRef.current = "bass";
      } else if (rms > peakSensitivity / 100) {
        audioMoodRef.current = "peak";
      } else {
        audioMoodRef.current = "quiet";
      }
      setAudioMood(audioMoodRef.current);

      lastLowEnergyRef.current =
        lowEnergy * 0.45 + lastLowEnergyRef.current * 0.55;

      const peakThreshold = peakSensitivity / 100;
      const kickThreshold = kickSensitivity / 100;

      const now = performance.now();

      let isAbove = false;

      if (switchMode === "peak") {
        isAbove = rms > peakThreshold;
      }

      if (switchMode === "kick") {
        isAbove =
          lowSpike > kickThreshold || lowEnergy > kickThreshold * 2.2;
      }

      if (switchMode === "equal" && images.length > 0) {
        const elapsedSeconds = getEqualModeElapsedSeconds(equalModeFallbackStartedAtRef);
        const intervalSeconds = Math.max(0.001, imageDuration / 1000);
        const nextIndex = getEqualModeSceneIndex(
          elapsedSeconds,
          intervalSeconds,
          images.length
        );
        const nextImage = images[nextIndex] ?? null;
        if (
          nextIndex !== latestCurrentImageIndexRef.current ||
          nextImage !== latestSelectedImageRef.current
        ) {
          updateScene(nextIndex, nextImage, true);
        }
      }

      const timeSinceLastSwitch = now - lastSwitchTimeRef.current;

      const passedMinInterval = timeSinceLastSwitch > minSwitchInterval;
      const passedIdealInterval = timeSinceLastSwitch > idealSwitchInterval;
      const passedFallbackInterval =
        timeSinceLastSwitch > fallbackSwitchInterval;

      const shouldSwitchByAudio =
        isAbove &&
        !wasAboveThresholdRef.current &&
        passedMinInterval &&
        passedIdealInterval;

      const shouldSwitchByFallback =
        (switchMode === "peak" || switchMode === "kick") &&
        passedFallbackInterval;

      if (
        (switchMode === "peak" || switchMode === "kick") &&
        (shouldSwitchByAudio || shouldSwitchByFallback)
      ) {
        stepToNextImage();
        lastSwitchTimeRef.current = now;
        wasAboveThresholdRef.current = false;
      } else {
        wasAboveThresholdRef.current = isAbove;
      }

      if (!audio.paused && !audio.ended) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const listRaw = localStorage.getItem(SETTINGS_LIST_STORAGE_KEY);
      if (listRaw) {
        try {
          const parsedList = JSON.parse(listRaw);
          if (Array.isArray(parsedList)) {
            setSavedSettingsList(parsedList);
            return;
          }
        } catch {
          setSettingsStatus("保存設定リストの読み込みに失敗しました");
        }
      }
      const legacyRaw = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (!legacyRaw) return;
      try {
        const legacy = JSON.parse(legacyRaw);
        const migratedName = legacy.settingsName || "移行済み設定";
        const now = legacy.savedAt || new Date().toISOString();
        const migratedList: SavedSettingsSlot[] = [{
          id: `migrated-${Date.now()}`,
          name: migratedName,
          createdAt: now,
          updatedAt: now,
          settings: {
            activePreset: legacy.activePreset || DEFAULT_PRESET,
            customControls: legacy.customControls || mapPresetToControls(effectPresetConfigs[DEFAULT_PRESET]),
            textMode: legacy.textMode || "random",
            bubbleText: legacy.bubbleText || "ここにセリフ",
            sfxText: legacy.sfxText || "ドン!!",
            settingsName: migratedName,
          },
        }];
        syncSettingsList(migratedList);
        setSettingsStatus("旧保存データを移行しました");
      } catch {
        setSettingsStatus("旧保存データの移行に失敗しました");
      }
    }, 0);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isPlaying) {
      stopAnalysisLoop();
    }
  }, [isPlaying]);

  useEffect(() => {
    return () => {
      if (recordingFrameRef.current !== null) {
        clearTimeout(recordingFrameRef.current);
      }

      if (recordedVideoUrl) {
        URL.revokeObjectURL(recordedVideoUrl);
      }
    };
  }, [recordedVideoUrl]);

  const handleImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;

    if (!files) return;

    const imageUrls = Array.from(files).map((file) =>
      URL.createObjectURL(file)
    );

    setImages(imageUrls);
    setImageMotions(imageUrls.map(() => "zoomIn"));
    setRandomMotionApplied(false);
    setCurrentImageIndex(0);

    if (imageUrls.length > 0) {
      setSelectedImage(imageUrls[0]);
    }
  };

  const handleAudioUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;
    const allowedExtensions = [".mp3", ".wav", ".m4a", ".aac", ".ogg", ".webm"];
    const lowerName = file.name.toLowerCase();
    const hasAllowedExtension = allowedExtensions.some((extension) =>
      lowerName.endsWith(extension)
    );
    const isAudioFile = file.type.startsWith("audio/");

    if (!isAudioFile && !hasAllowedExtension) {
      setAudioUploadError("音声ファイルを選択してください");
      event.target.value = "";
      return;
    }

    setAudioUploadError("");
    setAudioUrl(URL.createObjectURL(file));
    setAudioName(file.name);
    setAudioDuration(0);
    setAudioDurationState("loading");
    setCurrentTime(0);
    setIsPlaying(false);
    setChorusBoost(false);
    setAudioMood("quiet");

    sourceRef.current = null;
    analyserRef.current = null;
    audioContextRef.current = null;

    lastSwitchTimeRef.current = 0;
    wasAboveThresholdRef.current = false;
    lastLowEnergyRef.current = 0;
    audioMoodRef.current = "quiet";
  };

  const handleAutoDuration = () => {
    if (audioDuration <= 0 || images.length === 0) return;

    const durationMs = (audioDuration / images.length) * 1000;

    setImageDuration(Math.round(durationMs));
  };

  const handlePlay = async () => {
    if (images.length === 0 && !audioUrl) return;

    lastSwitchTimeRef.current = performance.now();
    wasAboveThresholdRef.current = false;
    lastLowEnergyRef.current = 0;

    if (audioRef.current && audioUrl) {
      equalModeFallbackStartedAtRef.current = performance.now();
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (error) {
        console.error("Audio play failed:", error);
        setIsPlaying(false);
        return;
      }

      try {
        await setupAudioAnalysis();
        startAnalysisLoop();
      } catch (error) {
        console.warn(
          "Audio analysis failed. Audio will continue without analysis:",
          error
        );
      }

      return;
    }

    equalModeFallbackStartedAtRef.current = performance.now();
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);

    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentImageIndex(0);
    setCurrentTime(0);
    setChorusBoost(false);
    setAudioMood("quiet");

    lastSwitchTimeRef.current = 0;
    wasAboveThresholdRef.current = false;
    lastLowEnergyRef.current = 0;
    audioMoodRef.current = "quiet";
    equalModeFallbackStartedAtRef.current = null;

    if (images.length > 0) {
      setSelectedImage(images[0]);
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    stopAnalysisLoop();
  };

  const handleSeek = (value: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value;
    }
    setCurrentTime(value);

    if (images.length > 0) {
      let nextIndex = 0;

      if (switchMode === "equal") {
        const intervalSeconds = Math.max(0.001, imageDuration / 1000);
        nextIndex = getEqualModeSceneIndex(value, intervalSeconds, images.length);
      } else {
        nextIndex = Math.floor((value / audioDuration) * images.length);
        nextIndex = Math.min(nextIndex, images.length - 1);
      }

      updateScene(nextIndex, images[nextIndex] ?? null, true);
    }

    lastSwitchTimeRef.current = performance.now();
    wasAboveThresholdRef.current = false;
    lastLowEnergyRef.current = 0;
  };

  useEffect(() => {
    latestTextSceneIndexRef.current = currentImageIndex;
  }, [currentImageIndex]);

  const handlePrepareExport = () => {
    const hasPlayableSource = Boolean(audioUrl);
    if (!hasPlayableSource || images.length === 0) {
      setExportStatus("error");
      setExportMessage("画像と音楽をアップロードしてください");
      return;
    }

    const resolution = getExportResolution(aspectRatio, exportQuality);

    setExportStatus("ready");
    setExportMessage(
      `準備OK：${aspectRatio} / ${getExportQualityLabel(exportQuality)} / ${resolution.width} x ${resolution.height} / ${formatTime(audioDuration)} / ${images.length}枚`
    );
  };

  const getRecordingActiveImage = (): { imageUrl: string | null; imageIndex: number } => {
    const recordingImages = latestImagesRef.current;
    if (recordingImages.length === 0) {
      return { imageUrl: latestSelectedImageRef.current, imageIndex: 0 };
    }

    if (latestSwitchModeRef.current === "equal") {
      const elapsedSeconds = getEqualModeElapsedSeconds(recordingStartedAtRef);
      const intervalSeconds = Math.max(0.001, latestImageDurationRef.current / 1000);
      const imageIndex = getEqualModeSceneIndex(
        elapsedSeconds,
        intervalSeconds,
        recordingImages.length
      );
      return {
        imageUrl: recordingImages[imageIndex] ?? latestSelectedImageRef.current,
        imageIndex,
      };
    }

    const imageIndex = latestCurrentImageIndexRef.current;
    return {
      imageUrl: recordingImages[imageIndex] ?? latestSelectedImageRef.current,
      imageIndex,
    };
  };

  const handleStartRecording = async () => {
    if (images.length === 0) {
      setExportStatus("error");
      setExportMessage("録画対象の画像がありません");
      return;
    }

    if (isRecording) return;

    const audio = audioRef.current;
    const canUseAutoRecord =
      autoRecordEnabled &&
      Boolean(audioUrl) &&
      audioDurationState === "ready" &&
      audioDuration > 0 &&
      Number.isFinite(audioDuration);

    if (recordedVideoUrl) {
      URL.revokeObjectURL(recordedVideoUrl);
      setRecordedVideoUrl(null);
    }

    const formatSelection = selectRecordingFormat(exportFormatPreference);
    setMp4FallbackMessage(formatSelection.fallbackMessage);

    try {
      setCurrentImageIndex(0);
      if (images.length > 0) {
        setSelectedImage(images[0]);
      }
      lastSwitchTimeRef.current = 0;
      wasAboveThresholdRef.current = false;
      lastLowEnergyRef.current = 0;

      const resolution = getExportResolution(aspectRatio, exportQuality, isMobileViewport);
      const safeWidth = Number.isFinite(resolution.width) && resolution.width > 0 ? resolution.width : 1280;
      const safeHeight = Number.isFinite(resolution.height) && resolution.height > 0 ? resolution.height : 720;
      const canvas = createExportCanvas(safeWidth, safeHeight);
      recordingCanvasRef.current = canvas;

      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("Canvas context の作成に失敗しました");
      }

      const activeQualityProfile = qualityProfiles[exportQuality];
      const recordingFps = activeQualityProfile.fps;
      recordingFpsRef.current = recordingFps;
      const recordingBitrates = {
        videoBitsPerSecond: activeQualityProfile.videoBitsPerSecond,
        audioBitsPerSecond: activeQualityProfile.audioBitsPerSecond,
      };
      let recordingInfo = { ...formatSelection };
      let fallbackReason: string | null = formatSelection.fallbackMessage;
      let recordingStartResult: { recorder: MediaRecorder; hasAudio: boolean };
      try {
        recordingStartResult = startCanvasRecording(canvas, recordingFps, getRecordingAudioElement(), true, formatSelection.selectedMimeType, recordingBitrates);
      } catch (error) {
        if (formatSelection.actualFormat === "mp4") {
          const fallbackSelection = selectRecordingFormat("webm");
          recordingInfo = { ...fallbackSelection, fallbackMessage: "MP4録画に失敗したため、WebMで録画します" };
          fallbackReason = recordingInfo.fallbackMessage;
          setMp4FallbackMessage(recordingInfo.fallbackMessage);
          recordingStartResult = startCanvasRecording(canvas, recordingFps, getRecordingAudioElement(), true, recordingInfo.selectedMimeType, recordingBitrates);
        } else { throw error; }
      }

      let { recorder, hasAudio } = recordingStartResult;
      const videoTrackCount = recorder.stream.getVideoTracks().length;
      const audioTrack = recorder.stream.getAudioTracks()[0] ?? null;
      const audioTrackCount = recorder.stream.getAudioTracks().length;
      const recorderMimeType = recorder.mimeType || (recordingInfo.selectedMimeType ?? null);
      setRecordingStreamDiagnostics({
        videoTrackCount,
        audioTrackCount,
        audioEnabled: audioTrack?.enabled ?? false,
        audioReadyState: audioTrack?.readyState ?? "missing",
        mimeType: recorderMimeType,
        format: recordingInfo.actualFormat,
        canvasWidth: safeWidth,
        canvasHeight: safeHeight,
        qualityMode: exportQuality,
        fps: recordingFps,
        videoBitsPerSecond: recordingBitrates.videoBitsPerSecond,
        audioBitsPerSecond: recordingBitrates.audioBitsPerSecond,
        hasBgm: Boolean(audioUrl),
        audioPaused: audio?.paused ?? true,
        audioMuted: audio?.muted ?? false,
        audioVolume: audio?.volume ?? 1,
        fallbackReason,
        blobSizeBytes: null,
        durationMs: null,
      });
      if (recordingInfo.actualFormat === "mp4" && audioTrackCount === 0) {
        setMp4FallbackMessage("録画音声トラックが取得できません。音声ありWebMを試してください。");
        const fallbackSelection = selectRecordingFormat("webm");
        if (fallbackSelection.selectedMimeType) {
          recorder.stream.getTracks().forEach((track) => track.stop());
          const webmStartResult = startCanvasRecording(canvas, recordingFps, getRecordingAudioElement(), true, fallbackSelection.selectedMimeType, recordingBitrates);
          recordingInfo = { ...fallbackSelection, fallbackMessage: "MP4では音声を取得できないため、音声ありWebMで録画します" };
          fallbackReason = recordingInfo.fallbackMessage;
          setMp4FallbackMessage(recordingInfo.fallbackMessage);
          const webmVideoTrackCount = webmStartResult.recorder.stream.getVideoTracks().length;
          const webmAudioTrack = webmStartResult.recorder.stream.getAudioTracks()[0] ?? null;
          const webmAudioTrackCount = webmStartResult.recorder.stream.getAudioTracks().length;
          setRecordingStreamDiagnostics({
            videoTrackCount: webmVideoTrackCount,
            audioTrackCount: webmAudioTrackCount,
            audioEnabled: webmAudioTrack?.enabled ?? false,
            audioReadyState: webmAudioTrack?.readyState ?? "missing",
            mimeType: webmStartResult.recorder.mimeType || (fallbackSelection.selectedMimeType ?? null),
            format: recordingInfo.actualFormat,
            canvasWidth: safeWidth,
            canvasHeight: safeHeight,
            qualityMode: exportQuality,
            fps: recordingFps,
            videoBitsPerSecond: recordingBitrates.videoBitsPerSecond,
            audioBitsPerSecond: recordingBitrates.audioBitsPerSecond,
            hasBgm: Boolean(audioUrl),
            audioPaused: audio?.paused ?? true,
            audioMuted: audio?.muted ?? false,
            audioVolume: audio?.volume ?? 1,
            fallbackReason,
            blobSizeBytes: null,
            durationMs: null,
          });
          recordingStartResult = webmStartResult;
          ({ recorder, hasAudio } = recordingStartResult);
        } else {
          setMp4FallbackMessage("MP4の音声取得に失敗しました。この端末ではMP4音声が入らない場合があります");
        }
      }
      if (recordingInfo.actualFormat === "webm" && recorder.stream.getAudioTracks().length === 0) {
        setMp4FallbackMessage((prev) => prev ?? "音声トラックが0のため無音録画になります。");
      }
      mediaRecorderRef.current = recorder;
      recorder.start();
      recordingStartedAtRef.current = null;
      recordingElapsedMsRef.current = 0;

      setIsRecording(true);
      setRecordingMode(canUseAutoRecord ? "synced" : "manual");
      setRecordedFileExtension(recordingInfo.fileExtension);
      setExportAudioStatus(hasAudio ? "with-audio" : "video-only");
      setExportStatus("recording");
      const formatLabel = recordingInfo.actualFormat.toUpperCase();
      setExportMessage(
        canUseAutoRecord
          ? hasAudio
            ? `曲尺自動録画中です（${formatLabel}・音声付き）`
            : `曲尺自動録画中です（${formatLabel}・映像のみ）`
          : hasAudio
            ? `録画中です（${formatLabel}・音声付き）`
            : `録画中です（${formatLabel}・映像のみ）`
      );

      if (canUseAutoRecord && audio) {
        autoStopTriggeredRef.current = false;
        audio.currentTime = 0;
        await audio.play();
        setIsPlaying(true);
        startAnalysisLoop();
        const stopFromAuto = () => {
          if (autoStopTriggeredRef.current) return;
          autoStopTriggeredRef.current = true;
          void handleStopRecording();
        };
        recordingEndedHandlerRef.current = stopFromAuto;
        audio.addEventListener("ended", stopFromAuto, { once: true });
        recordingStopTimeoutRef.current = window.setTimeout(
          stopFromAuto,
          Math.ceil(audioDuration * 1000) + 500
        );
      }

      const drawFrame = async () => {
        if (!recordingCanvasRef.current || !ctx) return;

        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, safeWidth, safeHeight);

        const startedAt = recordingStartedAtRef.current ?? performance.now();
        if (recordingStartedAtRef.current === null) {
          recordingStartedAtRef.current = startedAt;
        }
        recordingElapsedMsRef.current = performance.now() - startedAt;
        const activeState = getRecordingActiveImage();
        const activeMotion = latestImageMotionsRef.current[activeState.imageIndex] ?? "zoomIn";
        if (activeState.imageUrl) {
          try {
            await drawImageToCanvas(ctx, activeState.imageUrl, safeWidth, safeHeight, {
              motionType: activeMotion,
              chorusBoost: latestChorusBoostRef.current,
              recordingElapsedMs: recordingElapsedMsRef.current,
              motionAmplitudeMultiplier: motionAmplitudeValue * presetMotionMultiplier[activePreset],
            });
          } catch (error) {
            console.warn("画像描画に失敗しました", error);
          }
        }

        if (latestShowEqualizerRef.current) {
          drawEqualizerBars(ctx, latestEqBarsRef.current, resolution.width, resolution.height, equalizerType, equalizerColorTheme);
        }
        if (latestShowSfxRef.current) {
          drawSfxText(ctx, latestSfxTextRef.current, latestSfxPositionRef.current, resolution.width, resolution.height, {
            sfxScale: latestSfxScaleRef.current,
            chorusBoost: latestChorusBoostRef.current,
            sfxItems: latestSfxItemsRef.current,
            viewportScale: latestSfxViewportScaleRef.current,
          });
        }
        if (latestShowBubbleRef.current) {
          drawSpeechBubble(ctx, latestBubbleTextRef.current, latestBubblePositionRef.current, resolution.width, resolution.height, { variant: latestBubbleVariantRef.current, scale: latestBubbleScaleRef.current });
        }
        drawFlash(ctx, resolution.width, resolution.height, latestFlashActiveRef.current || latestChorusBoostRef.current);

        recordingFrameRef.current = window.setTimeout(() => {
          void drawFrame();
        }, 1000 / recordingFpsRef.current) as unknown as number;
      };

      await drawFrame();
    } catch (error) {
      console.error("録画開始に失敗:", error);
      setIsRecording(false);
      setExportStatus("error");
      setExportMessage("録画開始に失敗しました");
    }
  };

  const handleStopRecording = async () => {
    if (!mediaRecorderRef.current || !isRecording) return;

    try {
      if (recordingStopTimeoutRef.current !== null) {
        clearTimeout(recordingStopTimeoutRef.current);
        recordingStopTimeoutRef.current = null;
      }
      if (recordingEndedHandlerRef.current && audioRef.current) {
        audioRef.current.removeEventListener("ended", recordingEndedHandlerRef.current);
        recordingEndedHandlerRef.current = null;
      }
      autoStopTriggeredRef.current = false;
      audioRef.current?.pause();

      if (recordingFrameRef.current !== null) {
        clearTimeout(recordingFrameRef.current);
        recordingFrameRef.current = null;
      }

      const stoppedAt = performance.now();
      const durationMs = recordingStartedAtRef.current ? stoppedAt - recordingStartedAtRef.current : recordingElapsedMsRef.current;
      const blobMimeType = mediaRecorderRef.current.mimeType || (recordedFileExtension === "mp4" ? "video/mp4" : "video/webm");
      const blob = await stopCanvasRecording(mediaRecorderRef.current, blobMimeType);
      if (blob.size === 0) {
        throw new Error("録画データが空です。もう一度録画してください。");
      }
      if (blob.type && blobMimeType && blob.type !== blobMimeType) {
        console.warn("blob.type が選択MIMEと一致しません", { blobType: blob.type, blobMimeType });
      }
      if (recordedVideoUrl) {
        URL.revokeObjectURL(recordedVideoUrl);
      }
      const videoUrl = URL.createObjectURL(blob);
      setRecordingStreamDiagnostics((prev) => prev ? {
        ...prev,
        blobSizeBytes: blob.size,
        durationMs,
      } : prev);

      setRecordedVideoUrl(videoUrl);
      setExportStatus("finished");
      setExportMessage(
        durationMs < 3000
          ? "録画時間が短すぎます。5秒以上で試してください。"
          : `録画完了：${(recordedFileExtension ?? formatPreview.actualFormat).toUpperCase()}リンクを生成しました`
      );
    } catch (error) {
      console.error("録画停止に失敗:", error);
      setExportStatus("error");
      setExportMessage(error instanceof Error ? error.message : "録画停止に失敗しました");
    } finally {
      mediaRecorderRef.current?.stream.getTracks().forEach((track) => {
        track.stop();
      });
      mediaRecorderRef.current = null;
      recordingCanvasRef.current = null;
      recordingStartedAtRef.current = null;
      recordingElapsedMsRef.current = 0;
      setIsRecording(false);
      setRecordingMode(null);
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    return () => {
      if (recordingStopTimeoutRef.current !== null) {
        clearTimeout(recordingStopTimeoutRef.current);
      }
      if (recordingEndedHandlerRef.current && audioRef.current) {
        audioRef.current.removeEventListener("ended", recordingEndedHandlerRef.current);
      }
    };
  }, []);

  const getTimelineMarkers = () => {
    if (audioDuration <= 0 || images.length === 0) return [];

    return images.map((_, index) => {
      const percent =
        images.length === 1 ? 0 : (index / images.length) * 100;

      return {
        index,
        percent: Math.min(100, Math.max(0, percent)),
      };
    });
  };

  const applyMotionToCurrent = () => {
    const updated = [...imageMotions];

    updated[currentImageIndex] = selectedMotion;

    setImageMotions(updated);
    setRandomMotionApplied(false);
    
  };

  const applyRandomMotions = () => {
    const updated = images.map(() => randomItem(motionList));

    setImageMotions(updated);
    setRandomMotionApplied(true);
    
  };

  const getMotionStyle = () => {
    const motion = imageMotions[currentImageIndex];

    if (chorusBoost && isPlaying) {
      return "chorusImageAnim 0.7s ease-in-out infinite";
    }

    switch (motion) {
      case "zoomIn":
        return "zoomInAnim 8s ease-in-out infinite";
      case "zoomOut":
        return "zoomOutAnim 8s ease-in-out infinite";
      case "panLeft":
        return `panLeftAnim 8s ease-in-out infinite`;
      case "panRight":
        return "panRightAnim 8s ease-in-out infinite";
      case "shake":
        return "shakeAnim 0.4s infinite";
      case "comic":
        return "comicAnim 0.8s infinite";
      case "panUp":
        return "panUpAnim 8s ease-in-out infinite";
      case "panDown":
        return "panDownAnim 8s ease-in-out infinite";
      case "diagonalPan":
        return "diagonalPanAnim 9s ease-in-out infinite";
      case "slowZoomIn":
        return "slowZoomInAnim 10s ease-in-out infinite";
      case "breathZoom":
        return "breathZoomAnim 6s ease-in-out infinite";
      case "impactZoom":
        return "impactZoomAnim 0.9s ease-out infinite";
      case "glitchJump":
        return "glitchJumpAnim 0.65s steps(1, end) infinite";
      case "grooveBounce":
        return "grooveBounceAnim 1.1s ease-in-out infinite";
      case "sideGroove":
        return "sideGrooveAnim 1s ease-in-out infinite";
      case "handheld":
        return "handheldAnim 1.3s ease-in-out infinite";
      default:
        return "zoomInAnim 8s ease-in-out infinite";
    }
  };
  const getMotionAmplitude = () => motionAmplitudeValue * presetMotionMultiplier[activePreset];

  const getPositionClass = (position: PositionType) => {
    switch (position) {
      case "topLeft":
        return "top-8 left-8";
      case "topRight":
        return "top-8 right-8";
      case "bottomLeft":
        return "bottom-8 left-8";
      case "bottomRight":
        return "bottom-8 right-8";
      case "center":
        return "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2";
      default:
        return "top-8 right-8";
    }
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <style>{`
        @keyframes zoomInAnim {
          0%,100% { transform: scale(1); }
          50% { transform: scale(1.12); }
        }

        @keyframes zoomOutAnim {
          0%,100% { transform: scale(1.12); }
          50% { transform: scale(1); }
        }

        @keyframes panLeftAnim {
          0% { transform: scale(1.1) translateX(0); }
          50% { transform: scale(1.1) translateX(calc(-40px * var(--motion-amp, 1))); }
          100% { transform: scale(1.1) translateX(0); }
        }

        @keyframes panRightAnim {
          0% { transform: scale(1.1) translateX(0); }
          50% { transform: scale(1.1) translateX(calc(40px * var(--motion-amp, 1))); }
          100% { transform: scale(1.1) translateX(0); }
        }

        @keyframes shakeAnim {
          0%,100% { transform: translate(0,0); }
          25% { transform: translate(-6px,2px); }
          50% { transform: translate(6px,-2px); }
          75% { transform: translate(-4px,4px); }
        }

        @keyframes comicAnim {
          0%,100% { transform: scale(1) rotate(0deg); }
          25% { transform: scale(1.03) rotate(-1deg); }
          50% { transform: scale(1.06) rotate(1deg); }
          75% { transform: scale(1.03) rotate(-1deg); }
        }
        @keyframes panUpAnim {
          0%,100% { transform: scale(1.08) translateY(calc(16px * var(--motion-amp, 1))); }
          50% { transform: scale(1.08) translateY(calc(-22px * var(--motion-amp, 1))); }
        }
        @keyframes panDownAnim {
          0%,100% { transform: scale(1.08) translateY(calc(-16px * var(--motion-amp, 1))); }
          50% { transform: scale(1.08) translateY(calc(22px * var(--motion-amp, 1))); }
        }
        @keyframes diagonalPanAnim {
          0%,100% { transform: scale(1.1) translate(calc(-20px * var(--motion-amp, 1)),calc(18px * var(--motion-amp, 1))); }
          50% { transform: scale(1.1) translate(calc(20px * var(--motion-amp, 1)),calc(-18px * var(--motion-amp, 1))); }
        }
        @keyframes slowZoomInAnim {
          0%,100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }
        @keyframes breathZoomAnim {
          0%,100% { transform: scale(1); }
          50% { transform: scale(1.04); }
        }
        @keyframes impactZoomAnim {
          0%,100% { transform: scale(1); }
          20% { transform: scale(1.13); }
          35% { transform: scale(1.02); }
        }
        @keyframes glitchJumpAnim {
          0%,100% { transform: translate(0,0); }
          20% { transform: translate(6px,-3px); }
          22% { transform: translate(-5px,2px); }
          24% { transform: translate(2px,-1px); }
        }
        @keyframes grooveBounceAnim {
          0%,100% { transform: translateY(0) scale(1.03); }
          50% { transform: translateY(-12px) scale(1.05); }
        }
        @keyframes sideGrooveAnim {
          0%,100% { transform: translateX(0) scale(1.04); }
          25% { transform: translateX(calc(-10px * var(--motion-amp, 1))) scale(1.03); }
          75% { transform: translateX(calc(10px * var(--motion-amp, 1))) scale(1.05); }
        }
        @keyframes handheldAnim {
          0%,100% { transform: translate(0,0) rotate(0deg) scale(1.04); }
          25% { transform: translate(-4px,2px) rotate(-0.5deg) scale(1.045); }
          50% { transform: translate(3px,-3px) rotate(0.5deg) scale(1.05); }
          75% { transform: translate(-2px,3px) rotate(-0.3deg) scale(1.043); }
        }

        @keyframes chorusImageAnim {
          0%,100% { transform: scale(1.08) rotate(0deg); }
          25% { transform: scale(1.15) rotate(-0.8deg); }
          50% { transform: scale(1.2) rotate(0.8deg); }
          75% { transform: scale(1.12) rotate(-0.5deg); }
        }

        @keyframes sfxShake {
          0%,100% { transform: rotate(-8deg) scale(1); }
          50% { transform: rotate(-3deg) scale(1.1); }
        }

        @keyframes eqMove {
          0%,100% { transform: scaleY(0.4); }
          50% { transform: scaleY(1.2); }
        }

        @keyframes bubbleFloat {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }

        @keyframes glitchMove {
          0% { transform: translateX(0); opacity: 0.15; }
          25% { transform: translateX(6px); opacity: 0.35; }
          50% { transform: translateX(-6px); opacity: 0.2; }
          75% { transform: translateX(3px); opacity: 0.4; }
          100% { transform: translateX(0); opacity: 0.15; }
        }

        @keyframes glitchLine {
          0% { transform: translateX(-100%); opacity: 0; }
          40% { opacity: 0.8; }
          100% { transform: translateX(100%); opacity: 0; }
        }

        @keyframes flashAnim {
          0% { opacity: 0; }
          20% { opacity: 0.95; }
          100% { opacity: 0; }
        }

        @keyframes panelBurstAnim {
          0% { opacity: 0; transform: scale(0.96) rotate(-1deg); }
          25% { opacity: 1; transform: scale(1.03) rotate(1deg); }
          100% { opacity: 0.65; transform: scale(1) rotate(0deg); }
        }

        @keyframes panelSlideAnim {
          0%,100% { transform: translateX(0); }
          50% { transform: translateX(8px); }
        }
      `}</style>

      <header className="sticky top-0 z-30 border-b border-fuchsia-500/30 bg-black/90 px-2 py-1.5 md:px-6 md:py-4 backdrop-blur">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-fuchsia-300">
              <AppLogo
                src={logoSrc}
                isError={isLogoLoadError}
                onError={handleLogoLoadError}
                className="h-7 sm:h-9 md:h-10 lg:h-11 w-auto max-w-[68vw] md:max-w-[min(70vw,20rem)] object-contain opacity-95 drop-shadow-[0_0_12px_rgba(217,70,239,0.4)]"
              />
            </h1>
            <p className="text-[10px] leading-tight text-zinc-400 md:text-xs">Project: <span className="text-cyan-300">Untitled MV</span></p>
            {isLogoLoadError && logoErrorSrc ? (
              <p className="mt-1 text-[10px] text-amber-300 break-all">Logo fallback active: {logoErrorSrc}</p>
            ) : null}
          </div>
        </div>
      </header>
      <div className="hidden md:grid md:grid-cols-1 xl:grid-cols-[300px_minmax(0,1fr)_360px] gap-4 p-4">
        <UploadPanel
          handleImageUpload={handleImageUpload}
          handleAudioUpload={handleAudioUpload}
          audioName={audioName}
          audioUploadError={audioUploadError}
          aspectRatio={aspectRatio}
          formatTime={formatTime}
          audioDuration={audioDuration}
          currentTime={currentTime}
          images={images}
          currentImageIndex={currentImageIndex}
          isPlaying={isPlaying}
          chorusBoost={chorusBoost}
          activePreset={activePreset}
          audioMood={audioMood}
          imageMotions={imageMotions}
          onSelectImage={(image, index) => {
            setSelectedImage(image);
            setCurrentImageIndex(index);
          }}
        />
        <div className="flex flex-col rounded-2xl border border-cyan-500/30 bg-zinc-950/70 p-4">
          <div className="flex-1 rounded-2xl border border-fuchsia-500/20 bg-zinc-900/50 p-4 flex items-center justify-center">
            <PreviewStage
              previewSizeClass={getPreviewSizeClass()}
              chorusBoost={chorusBoost}
              selectedImage={selectedImage}
              isPlaying={isPlaying}
              isRecording={isRecording}
              getMotionStyle={getMotionStyle}
              getMotionAmplitude={getMotionAmplitude}
              showEqualizer={showEqualizer}
              eqBars={eqBars}
              equalizerType={equalizerType}
              equalizerColorTheme={equalizerColorTheme}
              showSfx={showSfx}
              sfxItems={sfxItems}
              sfxPosition={sfxPosition}
              sfxText={sfxText}
              sfxScale={sfxScale}
              getPositionClass={getPositionClass}
              showBubble={showBubble}
              bubblePosition={bubblePosition}
              bubbleText={bubbleText}
              bubbleVariant={bubbleVariant}
              bubbleScale={bubbleScale}
              flashActive={flashActive}
            />
          </div>
          <div className="mt-6 space-y-3">
            <ControlButtons
              isPlaying={isPlaying}
              isRecording={isRecording}
              chorusBoost={chorusBoost}
              onPlay={handlePlay}
              onPause={handlePause}
              onReset={handleReset}
            />
            {!audioUrl ? <p className="rounded-xl border border-amber-300/50 bg-amber-500/10 p-3 text-sm font-bold text-amber-200">BGMをアップロードしてください</p> : null}
            <Timeline
              audioUrl={audioUrl}
              currentTime={currentTime}
              audioDuration={audioDuration}
              onSeek={handleSeek}
              markers={getTimelineMarkers()}
              currentImageIndex={currentImageIndex}
              imagesLength={images.length}
              switchMode={switchMode}
              formatTime={formatTime}
            />
            <div className="rounded-xl border border-fuchsia-500/30 bg-zinc-900/60 p-3"><PresetPanel presetList={effectPresetList} activePreset={activePreset} isCustomAdjusted={isCustomAdjusted} applyPreset={applyPreset} customControls={customControls} onCustomControlChange={handleCustomControlChange} /></div>
            
          </div>
        </div>
        <div className="max-h-[calc(100vh-140px)] overflow-y-auto rounded-2xl border border-cyan-500/30 bg-zinc-950/90 p-4">
          <h2 className="text-xl font-bold mb-4 text-cyan-300">演出設定と書き出し</h2>
          <div className="space-y-4">
            <div className="rounded-xl border border-zinc-700 bg-zinc-900/70 p-3">
              <ExportPanel
                aspectRatio={aspectRatio}
                aspectList={aspectList}
                aspectLabels={aspectLabels}
                setAspectRatio={setAspectRatio}
                audioDuration={audioDuration}
                imageCount={images.length}
                exportMode={exportMode}
                exportQuality={exportQuality}
                setExportQuality={setExportQuality}
                exportStatus={exportStatus}
                exportMessage={exportMessage}
                handlePrepareExport={handlePrepareExport}
                handleStartRecording={handleStartRecording}
                handleStopRecording={handleStopRecording}
                isRecording={isRecording}
                recordingMode={recordingMode}
                recordedVideoUrl={recordedVideoUrl}
                exportAudioStatus={exportAudioStatus}
                formatTime={formatTime}
                autoRecordEnabled={autoRecordEnabled}
                setAutoRecordEnabled={setAutoRecordEnabled}
                audioDurationState={audioDurationState}
                hasAudio={Boolean(audioUrl)}
                exportFormatPreference={exportFormatPreference}
                setExportFormatPreference={setExportFormatPreference}
                supportsMp4Recording={formatPreview.supportsMp4}
                actualRecordingFormat={formatPreview.actualFormat}
                selectedMimeType={formatPreview.selectedMimeType ?? null}
                mp4FallbackMessage={mp4FallbackMessage}
                recordedFileExtension={recordedFileExtension}
                recordingStreamDiagnostics={recordingStreamDiagnostics}
              />
            </div>
            <div className="rounded-xl border border-zinc-700 bg-zinc-900/70 p-3">
              <SettingsPanel
                switchMode={switchMode}
                setSwitchMode={setSwitchMode}
                wasAboveThresholdRef={wasAboveThresholdRef}
                lastLowEnergyRef={lastLowEnergyRef}
                setActivePreset={(preset) => setActivePreset(preset ?? DEFAULT_PRESET)}
                imageDuration={imageDuration}
                setImageDuration={setImageDuration}
                handleAutoDuration={handleAutoDuration}
                peakSensitivity={peakSensitivity}
                setPeakSensitivity={setPeakSensitivity}
                kickSensitivity={kickSensitivity}
                setKickSensitivity={setKickSensitivity}
                minSwitchInterval={minSwitchInterval}
                setMinSwitchInterval={setMinSwitchInterval}
                idealSwitchInterval={idealSwitchInterval}
                setIdealSwitchInterval={setIdealSwitchInterval}
                fallbackSwitchInterval={fallbackSwitchInterval}
                setFallbackSwitchInterval={setFallbackSwitchInterval}
                showBubble={showBubble}
                setShowBubble={setShowBubble}
                bubbleText={bubbleText}
                setBubbleText={setBubbleText}
                autoBubble={autoBubble}
                setAutoBubble={setAutoBubble}
                textMode={textMode}
                setTextMode={setTextMode}
                audioMood={audioMood}
                showSfx={showSfx}
                setShowSfx={setShowSfx}
                sfxText={sfxText}
                setSfxText={setSfxText}
                randomSfxScaleEnabled={randomSfxScaleEnabled}
                randomSfxCountEnabled={randomSfxCountEnabled}
                setRandomSfxScaleEnabled={handleRandomSfxScaleEnabled}
                setRandomSfxCountEnabled={setRandomSfxCountEnabled}
                regenerateSfxItems={() => { const items = generateSfxItems(); setSfxItems(items); setSfxText(items[0]?.text ?? sfxText); setSfxScale(items[0]?.scale ?? 1); }}
                setBubblePosition={setBubblePosition}
                bubbleTexts={bubbleTexts}
                positions={positions}
                randomItem={randomItem}
                showGlitch={showGlitch}
                setShowGlitch={setShowGlitch}
                showEqualizer={showEqualizer}
                setShowEqualizer={setShowEqualizer}
                equalizerType={equalizerType}
                setEqualizerType={setEqualizerType}
                equalizerColorTheme={equalizerColorTheme}
                setEqualizerColorTheme={setEqualizerColorTheme}
                motionAmplitude={motionAmplitude}
                setMotionAmplitude={setMotionAmplitude}
                showFlash={showFlash}
                setShowFlash={setShowFlash}
                showPanels={showPanels}
                setShowPanels={setShowPanels}
                panelMode={panelMode}
                setPanelMode={setPanelMode}
                panelPattern={panelPattern}
                setPanelPattern={setPanelPattern}
                chorusBoost={chorusBoost}
                chorusSensitivity={chorusSensitivity}
                setChorusSensitivity={setChorusSensitivity}
                selectedMotion={selectedMotion}
                setSelectedMotion={setSelectedMotion}
                applyMotionToCurrent={applyMotionToCurrent}
                applyRandomMotions={applyRandomMotions}
                randomMotionApplied={randomMotionApplied}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="md:hidden flex h-[calc(100vh-56px)] h-[calc(100dvh-56px)] min-h-0 flex-col overflow-hidden px-2 pb-2">
        <div className="shrink-0">
          <PreviewStage
            previewSizeClass={`w-full ${aspectRatio === "16:9" ? "aspect-[16/9]" : aspectRatio === "9:16" ? "aspect-[9/16] max-h-[58dvh]" : aspectRatio === "1:1" ? "aspect-square max-h-[52dvh]" : "aspect-[4/5] max-h-[56dvh]"} max-h-[58dvh]`}
            chorusBoost={chorusBoost}
            selectedImage={selectedImage}
            isPlaying={isPlaying}
            isRecording={isRecording}
            getMotionStyle={getMotionStyle}
            getMotionAmplitude={getMotionAmplitude}
            showEqualizer={showEqualizer}
            eqBars={eqBars}
            equalizerType={equalizerType}
            equalizerColorTheme={equalizerColorTheme}
            showSfx={showSfx}
            sfxItems={sfxItems}
            sfxPosition={sfxPosition}
            sfxText={sfxText}
            sfxScale={sfxScale}
            getPositionClass={getPositionClass}
            showBubble={showBubble}
            bubblePosition={bubblePosition}
            bubbleText={bubbleText}
            bubbleVariant={bubbleVariant}
            bubbleScale={bubbleScale}
            flashActive={flashActive}
            showStatusOverlay={false}
          />
          <div className="mt-0.5 flex min-h-0 flex-wrap items-center justify-center gap-1 empty:hidden">
            {isPlaying ? <span className="rounded-full border border-emerald-300/70 bg-emerald-500/15 px-1.5 py-px text-[9px] font-bold tracking-wide text-emerald-100">再生中</span> : null}
            
            
          </div>
          <div className="mt-0.5"><ControlButtons isPlaying={isPlaying} isRecording={isRecording} chorusBoost={chorusBoost} isMobile onPlay={handlePlay} onPause={handlePause} onReset={handleReset} /></div>
        </div>
        <div className="mt-1 grid shrink-0 grid-cols-4 gap-1.5">
          {[
            { id: "assets", label: "素材" },
            { id: "text", label: "テキスト" },
            { id: "effects", label: "演出" },
            { id: "export", label: "書き出し" },
          ].map((tab) => (
            <button key={tab.id} onClick={() => setMobileTab(tab.id as "assets" | "text" | "effects" | "export")} className={`min-h-9 rounded-lg border px-1 py-1.5 text-[13px] font-bold leading-none ${mobileTab === tab.id ? "border-cyan-300 bg-cyan-500/25 text-cyan-100" : "border-zinc-700 bg-zinc-900/90 text-zinc-200"}`}>{tab.label}</button>
          ))}
        </div>
        <div className="mt-1 min-h-0 flex-1 overflow-y-auto overflow-x-hidden rounded-xl border border-zinc-700 bg-zinc-950/90 p-2 pb-4 shadow-inner shadow-cyan-950/40 [&_button]:min-h-10 [&_button]:text-sm [&_input]:min-h-10 [&_input]:text-base [&_select]:min-h-10 [&_select]:text-base [&_textarea]:min-h-10 [&_textarea]:text-base [&_input[type='range']]:min-h-7">
          {mobileTab === "assets" ? (
            <UploadPanel
              handleImageUpload={handleImageUpload}
              handleAudioUpload={handleAudioUpload}
              audioName={audioName}
              audioUploadError={audioUploadError}
              aspectRatio={aspectRatio}
              formatTime={formatTime}
              audioDuration={audioDuration}
              currentTime={currentTime}
              images={images}
              currentImageIndex={currentImageIndex}
              isPlaying={isPlaying}
              chorusBoost={chorusBoost}
              activePreset={activePreset}
              audioMood={audioMood}
              imageMotions={imageMotions}
              onSelectImage={(image, index) => {
                setSelectedImage(image);
                setCurrentImageIndex(index);
              }}
            />
          ) : null}
          {mobileTab === "text" ? (
            <div className="space-y-3">
              <div className="rounded-xl border border-fuchsia-500/30 bg-zinc-900/60 p-3 space-y-3">
                <p className="text-sm font-bold text-fuchsia-300">基本文字</p>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={showBubble} onChange={(e) => setShowBubble(e.target.checked)} />
                  タイトルを表示
                </label>
                <input className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2" value={bubbleText} onChange={(e) => setBubbleText(e.target.value)} placeholder="タイトル文言" />
                <button className={`w-full rounded-lg p-2 font-bold ${autoBubble ? "bg-pink-600" : "bg-zinc-800"}`} onClick={() => setAutoBubble(!autoBubble)}>テキスト自動生成 {autoBubble ? "ON" : "OFF"}</button>
                <button className="w-full rounded-lg bg-zinc-800 p-2" onClick={() => { setShowBubble(true); setBubbleText(randomItem(bubbleTexts)); setBubblePosition(randomItem(positions)); setBubbleVariant(weightedBubbleVariant()); setBubbleScale(Math.random() < 0.5 ? 1 : 2); }}>文字候補を更新</button>
                <p className="text-sm font-bold text-cyan-300">擬音入力（最大4つ・同文言）</p>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={showSfx} onChange={(e) => setShowSfx(e.target.checked)} />
                  擬音を表示
                </label>
                <input className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2" value={sfxText} onChange={(e) => setSfxText(e.target.value)} placeholder="擬音（例: ドン!!）" />
              </div>
              <div className="rounded-xl border border-cyan-500/30 bg-zinc-900/60 p-3 space-y-3">
                <p className="text-sm font-bold text-cyan-300">自動生成 / スマート文字</p>
                <label className="block text-sm text-zinc-300">文字生成モード</label>
                <select className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2" value={textMode} onChange={(e) => setTextMode(e.target.value as TextMode)}>
                  <option value="fixed">固定</option>
                  <option value="random">ランダム</option>
                  <option value="smart">スマート</option>
                </select>
                <button className={`w-full rounded-lg p-2 font-bold ${textMode === "smart" ? "bg-cyan-500 text-black" : "bg-zinc-800"}`} onClick={() => setTextMode(textMode === "smart" ? "random" : "smart")}>スマート文字ON/OFF</button>
                <button className={`w-full rounded-lg p-2 font-bold ${autoSfx ? "bg-pink-600" : "bg-zinc-800"}`} onClick={() => setAutoSfx(!autoSfx)}>擬音自動生成 {autoSfx ? "ON" : "OFF"}</button>
                <button className="w-full rounded-lg bg-zinc-800 p-2" onClick={() => { setShowSfx(true); const items = generateSfxItems(); setSfxItems(items); setSfxText(items[0]?.text ?? sfxText); setSfxScale(items[0]?.scale ?? 1); }}>擬音生成（ランダム）</button>
                <button className={`w-full rounded-lg p-2 font-bold ${randomSfxCountEnabled ? "bg-yellow-400 text-black" : "bg-zinc-800"}`} onClick={() => setRandomSfxCountEnabled(!randomSfxCountEnabled)}>擬音数ランダム {randomSfxCountEnabled ? "ON" : "OFF"}</button>
                <button className={`w-full rounded-lg p-2 font-bold ${randomSfxScaleEnabled ? "bg-yellow-400 text-black" : "bg-zinc-800"}`} onClick={() => handleRandomSfxScaleEnabled(!randomSfxScaleEnabled)}>擬音巨大化 {randomSfxScaleEnabled ? "ON" : "OFF"}</button>
              </div>
            </div>
          ) : null}
          {mobileTab === "effects" ? (
            <div className="space-y-3">
              <div className="rounded-xl border border-fuchsia-500/30 bg-zinc-900/60 p-3"><PresetPanel presetList={effectPresetList} activePreset={activePreset} isCustomAdjusted={isCustomAdjusted} applyPreset={applyPreset} customControls={customControls} onCustomControlChange={handleCustomControlChange} /></div>
                    <SettingsPanel
                      switchMode={switchMode}
                      setSwitchMode={setSwitchMode}
                      wasAboveThresholdRef={wasAboveThresholdRef}
                      lastLowEnergyRef={lastLowEnergyRef}
                      setActivePreset={(preset) => setActivePreset(preset ?? DEFAULT_PRESET)}
                      imageDuration={imageDuration}
                      setImageDuration={setImageDuration}
                      handleAutoDuration={handleAutoDuration}
                      peakSensitivity={peakSensitivity}
                      setPeakSensitivity={setPeakSensitivity}
                      kickSensitivity={kickSensitivity}
                      setKickSensitivity={setKickSensitivity}
                      minSwitchInterval={minSwitchInterval}
                      setMinSwitchInterval={setMinSwitchInterval}
                      idealSwitchInterval={idealSwitchInterval}
                      setIdealSwitchInterval={setIdealSwitchInterval}
                      fallbackSwitchInterval={fallbackSwitchInterval}
                      setFallbackSwitchInterval={setFallbackSwitchInterval}
                      showBubble={showBubble}
                      setShowBubble={setShowBubble}
                      bubbleText={bubbleText}
                      setBubbleText={setBubbleText}
                      autoBubble={autoBubble}
                      setAutoBubble={setAutoBubble}
                      textMode={textMode}
                      setTextMode={setTextMode}
                      audioMood={audioMood}
                      showSfx={showSfx}
                      setShowSfx={setShowSfx}
                      sfxText={sfxText}
                      setSfxText={setSfxText}
                      randomSfxScaleEnabled={randomSfxScaleEnabled}
                      randomSfxCountEnabled={randomSfxCountEnabled}
                      setRandomSfxScaleEnabled={handleRandomSfxScaleEnabled}
                      setRandomSfxCountEnabled={setRandomSfxCountEnabled}
                      regenerateSfxItems={() => { const items = generateSfxItems(); setSfxItems(items); setSfxText(items[0]?.text ?? sfxText); setSfxScale(items[0]?.scale ?? 1); }}
                      setBubblePosition={setBubblePosition}
                      bubbleTexts={bubbleTexts}
                      positions={positions}
                      randomItem={randomItem}
                      showGlitch={showGlitch}
                      setShowGlitch={setShowGlitch}
                      showEqualizer={showEqualizer}
                      setShowEqualizer={setShowEqualizer}
                      equalizerType={equalizerType}
                      setEqualizerType={setEqualizerType}
                      equalizerColorTheme={equalizerColorTheme}
                      setEqualizerColorTheme={setEqualizerColorTheme}
                      motionAmplitude={motionAmplitude}
                      setMotionAmplitude={setMotionAmplitude}
                      showFlash={showFlash}
                      setShowFlash={setShowFlash}
                      showPanels={showPanels}
                      setShowPanels={setShowPanels}
                      panelMode={panelMode}
                      setPanelMode={setPanelMode}
                      panelPattern={panelPattern}
                      setPanelPattern={setPanelPattern}
                      chorusBoost={chorusBoost}
                      chorusSensitivity={chorusSensitivity}
                      setChorusSensitivity={setChorusSensitivity}
                      selectedMotion={selectedMotion}
                      setSelectedMotion={setSelectedMotion}
                      applyMotionToCurrent={applyMotionToCurrent}
                      applyRandomMotions={applyRandomMotions}
                      randomMotionApplied={randomMotionApplied}
                    />
            </div>
          ) : null}
          {mobileTab === "export" ? (
            <div className="rounded-xl border border-zinc-700 bg-zinc-900/70 p-3">
              <ExportPanel aspectRatio={aspectRatio} aspectList={aspectList} aspectLabels={aspectLabels} setAspectRatio={setAspectRatio} audioDuration={audioDuration} imageCount={images.length} exportMode={exportMode} exportQuality={exportQuality} setExportQuality={setExportQuality} exportStatus={exportStatus} exportMessage={exportMessage} handlePrepareExport={handlePrepareExport} handleStartRecording={handleStartRecording} handleStopRecording={handleStopRecording} isRecording={isRecording} recordingMode={recordingMode} recordedVideoUrl={recordedVideoUrl} exportAudioStatus={exportAudioStatus} formatTime={formatTime} autoRecordEnabled={autoRecordEnabled} setAutoRecordEnabled={setAutoRecordEnabled} audioDurationState={audioDurationState} hasAudio={Boolean(audioUrl)} exportFormatPreference={exportFormatPreference} setExportFormatPreference={setExportFormatPreference} supportsMp4Recording={formatPreview.supportsMp4} actualRecordingFormat={formatPreview.actualFormat} selectedMimeType={formatPreview.selectedMimeType ?? null} mp4FallbackMessage={mp4FallbackMessage} recordedFileExtension={recordedFileExtension} recordingStreamDiagnostics={recordingStreamDiagnostics} />
            </div>
          ) : null}
        </div>
      </div>
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          className="hidden"
          onLoadedMetadata={(e) => {
            const duration = e.currentTarget.duration;
            if (!Number.isFinite(duration) || duration <= 0) {
              setAudioDuration(0);
              setAudioDurationState("error");
              return;
            }
            setAudioDuration(duration);
            setAudioDurationState("ready");
          }}
          onDurationChange={(e) => {
            const duration = e.currentTarget.duration;
            if (!Number.isFinite(duration) || duration <= 0) return;
            setAudioDuration(duration);
            setAudioDurationState("ready");
          }}
          onTimeUpdate={(e) =>
            setCurrentTime(e.currentTarget.currentTime)
          }
          onEnded={handleReset}
        />
      )}
    </main>
  );
}

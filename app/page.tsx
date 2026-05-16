"use client";

import { useEffect, useRef, useState } from "react";
import ControlButtons from "../src/components/ControlButtons";
import Timeline from "../src/components/Timeline";
import UploadPanel from "../src/components/UploadPanel";
import PreviewStage from "../src/components/PreviewStage";
import ExportPanel from "../src/components/ExportPanel";
import PresetPanel from "../src/components/PresetPanel";
import SettingsPanel from "../src/components/SettingsPanel";
import { presetConfigs, presetList } from "../src/lib/presets";
import {
  bubbleTexts,
  sfxTexts,
  smartBubbleTexts,
  smartSfxTexts,
} from "../src/lib/textEngine";
import type {
  AspectRatio,
  AudioMood,
  ExportQuality,
  MotionGroup,
  MotionType,
  PanelMode,
  PanelPattern,
  PositionType,
  PresetName,
  SwitchMode,
  TextMode,
} from "../src/types/mv";

export default function Home() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const rafRef = useRef<number | null>(null);

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
  const [audioDuration, setAudioDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("16:9");

  const [exportQuality, setExportQuality] =
    useState<ExportQuality>("standard");
  const [exportStatus, setExportStatus] = useState("未書き出し");

  const [showBubble, setShowBubble] = useState(false);
  const [bubbleText, setBubbleText] = useState("ここにセリフ");
  const [bubblePosition, setBubblePosition] =
    useState<PositionType>("topRight");
  const [autoBubble, setAutoBubble] = useState(false);

  const [showSfx, setShowSfx] = useState(true);
  const [sfxText, setSfxText] = useState("ドン!!");
  const [sfxPosition, setSfxPosition] =
    useState<PositionType>("bottomLeft");
  const [autoSfx, setAutoSfx] = useState(false);

  const [textMode, setTextMode] = useState<TextMode>("random");

  const [showGlitch, setShowGlitch] = useState(false);
  const [showEqualizer, setShowEqualizer] = useState(false);
  const [eqBars, setEqBars] = useState<number[]>(Array(12).fill(20));

  const [showFlash, setShowFlash] = useState(true);
  const [flashActive, setFlashActive] = useState(false);

  const [showPanels, setShowPanels] = useState(true);
  const [panelBurst, setPanelBurst] = useState(false);
  const [panelPattern, setPanelPattern] =
    useState<PanelPattern>("classic");
  const [panelMode, setPanelMode] = useState<PanelMode>("random");

  const [chorusBoost, setChorusBoost] = useState(false);
  const [chorusSensitivity, setChorusSensitivity] = useState(22);

  const [isPlaying, setIsPlaying] = useState(false);

  const [switchMode, setSwitchMode] = useState<SwitchMode>("equal");
  const [imageDuration, setImageDuration] = useState(2000);
  const [peakSensitivity, setPeakSensitivity] = useState(8);
  const [kickSensitivity, setKickSensitivity] = useState(3);
  const [minSwitchInterval, setMinSwitchInterval] = useState(450);
  const [idealSwitchInterval, setIdealSwitchInterval] = useState(900);
  const [fallbackSwitchInterval, setFallbackSwitchInterval] = useState(1300);

  const [selectedMotion, setSelectedMotion] =
    useState<MotionType>("zoomIn");

  const [activePreset, setActivePreset] = useState<PresetName | null>(null);

  const motionList: MotionType[] = [
    "zoomIn",
    "zoomOut",
    "panLeft",
    "panRight",
    "shake",
    "comic",
  ];

  const calmMotionList: MotionType[] = [
    "zoomIn",
    "zoomOut",
    "panLeft",
    "panRight",
  ];

  const battleMotionList: MotionType[] = ["shake", "comic", "zoomIn"];

  const panelPatterns: PanelPattern[] = [
    "classic",
    "vertical",
    "horizontal",
    "diagonal",
    "action",
  ];

  const positions: PositionType[] = [
    "topLeft",
    "topRight",
    "bottomLeft",
    "bottomRight",
    "center",
  ];

  const aspectList: AspectRatio[] = ["16:9", "9:16", "1:1", "4:5"];

  const randomItem = <T,>(list: T[]): T => {
    return list[Math.floor(Math.random() * list.length)];
  };

  const formatTime = (time: number) => {
    if (!Number.isFinite(time)) return "0:00";

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const getPreviewSizeClass = () => {
    switch (aspectRatio) {
      case "16:9":
        return "w-[720px] h-[405px]";
      case "9:16":
        return "w-[315px] h-[560px]";
      case "1:1":
        return "w-[500px] h-[500px]";
      case "4:5":
        return "w-[400px] h-[500px]";
      default:
        return "w-[720px] h-[405px]";
    }
  };

  const pickBubbleText = () => {
    if (textMode === "fixed") {
      return bubbleText;
    }

    if (textMode === "smart") {
      return randomItem(smartBubbleTexts[audioMoodRef.current]);
    }

    return randomItem(bubbleTexts);
  };

  const pickSfxText = () => {
    if (textMode === "fixed") {
      return sfxText;
    }

    if (textMode === "smart") {
      return randomItem(smartSfxTexts[audioMoodRef.current]);
    }

    return randomItem(sfxTexts);
  };

  const randomizeMotionsFromList = (list: MotionType[]) => {
    if (images.length === 0) {
      setRandomMotionApplied(false);
      return;
    }

    const updated = images.map(() => randomItem(list));
    setImageMotions(updated);
    setRandomMotionApplied(true);
  };

  const applyPreset = (preset: PresetName) => {
    setActivePreset(preset);
    setChorusBoost(false);

    wasAboveThresholdRef.current = false;
    lastLowEnergyRef.current = 0;
    lastSwitchTimeRef.current = performance.now();
    audioMoodRef.current = "quiet";

    const config = presetConfigs[preset];

    setSwitchMode(config.switchMode);
    setPeakSensitivity(config.peakSensitivity);
    setKickSensitivity(config.kickSensitivity);
    setMinSwitchInterval(config.minSwitchInterval);
    setIdealSwitchInterval(config.idealSwitchInterval);
    setFallbackSwitchInterval(config.fallbackSwitchInterval);
    setImageDuration(config.imageDuration);
    setShowGlitch(config.showGlitch);
    setShowEqualizer(config.showEqualizer);
    setShowFlash(config.showFlash);
    setShowPanels(config.showPanels);
    setPanelMode(config.panelMode);
    setAutoBubble(config.autoBubble);
    setShowBubble(config.showBubble);
    setAutoSfx(config.autoSfx);
    setShowSfx(config.showSfx);
    setTextMode(config.textMode);
    setChorusSensitivity(config.chorusSensitivity);

    const motionMap: Record<MotionGroup, MotionType[]> = {
      all: motionList,
      calm: calmMotionList,
      battle: battleMotionList,
      simpleZoom: ["zoomIn", "zoomOut"],
    };

    if (preset === "SIMPLE") {
      if (images.length > 0) {
        setImageMotions(images.map(() => "zoomIn"));
        setRandomMotionApplied(false);
      }
      return;
    }

    randomizeMotionsFromList(motionMap[config.motionGroup]);
  };

  const triggerFlash = () => {
    if (!showFlash) return;

    setFlashActive(true);

    setTimeout(() => {
      setFlashActive(false);
    }, chorusBoost ? 180 : 120);
  };

  const triggerPanelBurst = () => {
    if (!showPanels) return;

    if (panelMode === "random") {
      setPanelPattern(randomItem(panelPatterns));
    }

    if (panelMode === "chorus" && chorusBoost) {
      setPanelPattern(randomItem(panelPatterns));
    }

    setPanelBurst(true);

    setTimeout(() => {
      setPanelBurst(false);
    }, 260);
  };

  const stepToNextImage = () => {
    if (images.length === 0) return;

    triggerFlash();
    triggerPanelBurst();

    setCurrentImageIndex((prev) => {
      const nextIndex = (prev + 1) % images.length;

      setSelectedImage(images[nextIndex]);

      if (autoBubble) {
        setShowBubble(true);
        setBubbleText(pickBubbleText());
        setBubblePosition(randomItem(positions));
      }

      if (autoSfx) {
        setShowSfx(true);
        setSfxText(pickSfxText());
        setSfxPosition(randomItem(positions));
      }

      return nextIndex;
    });
  };

  const stopAnalysisLoop = () => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };

  const setupAudioAnalysis = async () => {
    if (!audioRef.current) return;

    const AudioContextClass =
      window.AudioContext || (window as any).webkitAudioContext;

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
        audioRef.current
      );

      sourceRef.current.connect(analyserRef.current);
      analyserRef.current.connect(audioContextRef.current.destination);
    }
  };

  const startAnalysisLoop = () => {
    if (!analyserRef.current || !audioRef.current) return;

    stopAnalysisLoop();

    const analyser = analyserRef.current;
    const audio = audioRef.current;

    const freqData = new Uint8Array(analyser.frequencyBinCount);
    const timeData = new Uint8Array(analyser.fftSize);

    const tick = () => {
      analyser.getByteFrequencyData(freqData);
      analyser.getByteTimeDomainData(timeData);

      const barCount = 12;
      const chunkSize = Math.floor(freqData.length / barCount);

      const nextBars = Array.from({ length: barCount }, (_, index) => {
        const start = index * chunkSize;
        const end = start + chunkSize;

        let sum = 0;

        for (let i = start; i < end; i++) {
          sum += freqData[i];
        }

        const avg = sum / chunkSize;

        return Math.max(8, Math.round((avg / 255) * 100));
      });

      setEqBars(nextBars);
      setCurrentTime(audio.currentTime);

      let sumSquares = 0;

      for (let i = 0; i < timeData.length; i++) {
        const normalized = (timeData[i] - 128) / 128;
        sumSquares += normalized * normalized;
      }

      const rms = Math.sqrt(sumSquares / timeData.length);

      const chorusThreshold = chorusSensitivity / 100;
      const isChorusNow = rms > chorusThreshold;

      setChorusBoost(isChorusNow);

      const lowBinCount = Math.max(8, Math.floor(freqData.length * 0.06));

      let lowSum = 0;

      for (let i = 0; i < lowBinCount; i++) {
        lowSum += freqData[i];
      }

      const lowEnergy = lowSum / lowBinCount / 255;
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
    if (!isPlaying || images.length === 0 || switchMode !== "equal") return;

    const timer = setInterval(() => {
      stepToNextImage();
    }, imageDuration);

    return () => clearInterval(timer);
  }, [
    isPlaying,
    images,
    switchMode,
    imageDuration,
    autoBubble,
    autoSfx,
    showFlash,
    showPanels,
    chorusBoost,
    panelMode,
    textMode,
  ]);

  useEffect(() => {
    if (!isPlaying) {
      stopAnalysisLoop();
      setChorusBoost(false);
    }
  }, [isPlaying]);

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

    setAudioUrl(URL.createObjectURL(file));
    setAudioName(file.name);
    setAudioDuration(0);
    setCurrentTime(0);
    setIsPlaying(false);
    setChorusBoost(false);

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

    lastSwitchTimeRef.current = 0;
    wasAboveThresholdRef.current = false;
    lastLowEnergyRef.current = 0;
    audioMoodRef.current = "quiet";

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
    if (!audioRef.current || audioDuration <= 0) return;

    audioRef.current.currentTime = value;
    setCurrentTime(value);

    if (images.length > 0) {
      let nextIndex = 0;

      if (switchMode === "equal") {
        nextIndex = Math.floor((value * 1000) / imageDuration) % images.length;
      } else {
        nextIndex = Math.floor((value / audioDuration) * images.length);
        nextIndex = Math.min(nextIndex, images.length - 1);
      }

      setCurrentImageIndex(nextIndex);
      setSelectedImage(images[nextIndex]);
    }

    lastSwitchTimeRef.current = performance.now();
    wasAboveThresholdRef.current = false;
    lastLowEnergyRef.current = 0;
  };

  const handlePrepareExport = () => {
    if (!audioUrl || images.length === 0) {
      setExportStatus("画像と音楽をアップロードしてください");
      return;
    }

    setExportStatus(
      `準備OK：${aspectRatio} / ${
        exportQuality === "high" ? "高画質" : "標準"
      } / ${formatTime(audioDuration)}`
    );
  };

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
    setActivePreset(null);
  };

  const applyRandomMotions = () => {
    const updated = images.map(() => randomItem(motionList));

    setImageMotions(updated);
    setRandomMotionApplied(true);
    setActivePreset(null);
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
        return "panLeftAnim 8s ease-in-out infinite";
      case "panRight":
        return "panRightAnim 8s ease-in-out infinite";
      case "shake":
        return "shakeAnim 0.4s infinite";
      case "comic":
        return "comicAnim 0.8s infinite";
      default:
        return "zoomInAnim 8s ease-in-out infinite";
    }
  };

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
    <main className="min-h-screen bg-black text-white flex">
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
          50% { transform: scale(1.1) translateX(-40px); }
          100% { transform: scale(1.1) translateX(0); }
        }

        @keyframes panRightAnim {
          0% { transform: scale(1.1) translateX(0); }
          50% { transform: scale(1.1) translateX(40px); }
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

      <UploadPanel
        handleImageUpload={handleImageUpload}
        handleAudioUpload={handleAudioUpload}
        audioName={audioName}
        aspectRatio={aspectRatio}
        formatTime={formatTime}
        audioDuration={audioDuration}
        currentTime={currentTime}
        images={images}
        currentImageIndex={currentImageIndex}
        isPlaying={isPlaying}
        chorusBoost={chorusBoost}
        activePreset={activePreset}
        audioMood={audioMoodRef.current}
        imageMotions={imageMotions}
        onSelectImage={(image, index) => {
          setSelectedImage(image);
          setCurrentImageIndex(index);
        }}
      />

      <div className="flex-1 flex flex-col items-center justify-center gap-4 overflow-auto p-4">
        <PreviewStage
          previewSizeClass={getPreviewSizeClass()}
          chorusBoost={chorusBoost}
          showGlitch={showGlitch}
          selectedImage={selectedImage}
          isPlaying={isPlaying}
          getMotionStyle={getMotionStyle}
          showPanels={showPanels}
          panelBurst={panelBurst}
          panelPattern={panelPattern}
          showEqualizer={showEqualizer}
          eqBars={eqBars}
          showSfx={showSfx}
          sfxPosition={sfxPosition}
          sfxText={sfxText}
          getPositionClass={getPositionClass}
          showBubble={showBubble}
          bubblePosition={bubblePosition}
          bubbleText={bubbleText}
          flashActive={flashActive}
        />

        <ControlButtons
          isPlaying={isPlaying}
          onPlay={handlePlay}
          onPause={handlePause}
          onReset={handleReset}
        />

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

        {audioUrl && (
          <audio
            ref={audioRef}
            src={audioUrl}
            className="hidden"
            onLoadedMetadata={(e) =>
              setAudioDuration(e.currentTarget.duration)
            }
            onTimeUpdate={(e) =>
              setCurrentTime(e.currentTarget.currentTime)
            }
            onEnded={handleReset}
          />
        )}
      </div>

      <div className="w-72 border-l border-cyan-500 p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-cyan-400">
          演出設定
        </h2>

        <div className="space-y-3">
          <div className="pt-1 pb-3 border-b border-zinc-700">
            <p className="text-sm mb-2 text-pink-300 font-bold">
              画角プリセット
            </p>

            <div className="grid grid-cols-2 gap-2">
              {aspectList.map((ratio) => (
                <button
                  key={ratio}
                  onClick={() => setAspectRatio(ratio)}
                  className={`p-2 rounded text-xs font-bold ${
                    aspectRatio === ratio
                      ? "bg-yellow-400 text-black"
                      : "bg-zinc-800 hover:bg-zinc-700"
                  }`}
                >
                  {ratio}
                </button>
              ))}
            </div>

            <p className="text-xs text-zinc-400 mt-2">
              16:9=YouTube / 9:16=Shorts・TikTok / 1:1=正方形 / 4:5=Instagram
            </p>
          </div>

          <ExportPanel
            aspectRatio={aspectRatio}
            audioDuration={audioDuration}
            imageCount={images.length}
            exportQuality={exportQuality}
            setExportQuality={setExportQuality}
            exportStatus={exportStatus}
            handlePrepareExport={handlePrepareExport}
            formatTime={formatTime}
          />

          <PresetPanel
            presetList={presetList}
            activePreset={activePreset}
            applyPreset={applyPreset}
          />

          <SettingsPanel
            switchMode={switchMode}
            setSwitchMode={setSwitchMode}
            wasAboveThresholdRef={wasAboveThresholdRef}
            lastLowEnergyRef={lastLowEnergyRef}
            setActivePreset={setActivePreset}
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
            audioMood={audioMoodRef.current}
            showSfx={showSfx}
            setShowSfx={setShowSfx}
            sfxText={sfxText}
            setSfxText={setSfxText}
            autoSfx={autoSfx}
            setAutoSfx={setAutoSfx}
            setBubblePosition={setBubblePosition}
            setSfxPosition={setSfxPosition}
            bubbleTexts={bubbleTexts}
            sfxTexts={sfxTexts}
            positions={positions}
            randomItem={randomItem}
            showGlitch={showGlitch}
            setShowGlitch={setShowGlitch}
            showEqualizer={showEqualizer}
            setShowEqualizer={setShowEqualizer}
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
    </main>
  );
}

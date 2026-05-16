import type { AutoDirectionDecision, AutoDirectionInput, AudioMood, PanelPattern, PositionType, PresetName } from "../types/mv";

type Candidate = AutoDirectionDecision & {
  id: string;
  moods: AudioMood[];
  presets: PresetName[];
  weight: number;
};

const positions: PositionType[] = ["topLeft", "topRight", "bottomLeft", "bottomRight", "center"];

const candidates: Candidate[] = [
  { id: "quiet-bubble", moods: ["quiet"], presets: ["JAZZ", "BALLADE", "POP"], weight: 1.3, motionType: "slowZoomIn", sfxText: "スッ", sfxScale: 1, sfxPosition: "bottomRight", bubbleText: "まだ鳴ってる", bubblePosition: "topRight", panelPattern: "classic", flashEnabled: false, glitchEnabled: false },
  { id: "peak-impact", moods: ["peak"], presets: ["ROCK", "漫画BATTLE", "DANCE"], weight: 1.4, motionType: "impactZoom", sfxText: "CRASH", sfxScale: 3, sfxPosition: "center", bubbleText: "止まらない", bubblePosition: "topLeft", panelPattern: "action", flashEnabled: true, glitchEnabled: true },
  { id: "bass-groove", moods: ["bass"], presets: ["FUNK", "DISCO"], weight: 1.4, motionType: "grooveBounce", sfxText: "ドン!!", sfxScale: 4, sfxPosition: "bottomLeft", bubbleText: "低音が走る", bubblePosition: "topRight", panelPattern: "horizontal", flashEnabled: false, glitchEnabled: false },
  { id: "chorus-battle", moods: ["chorus"], presets: ["漫画BATTLE", "ROCK"], weight: 1.5, motionType: "comic", sfxText: "ズガン!!", sfxScale: 6, sfxPosition: "center", bubbleText: "ここで壊れろ", bubblePosition: "topLeft", panelPattern: "diagonal", flashEnabled: true, glitchEnabled: true },
  { id: "synth-digital", moods: ["peak", "chorus"], presets: ["Synth Vocal"], weight: 1.45, motionType: "glitchJump", sfxText: "ERROR", sfxScale: 5, sfxPosition: "topLeft", bubbleText: "NOISEを解放", bubblePosition: "topRight", panelPattern: "vertical", flashEnabled: true, glitchEnabled: true },
  { id: "rock-punch", moods: ["peak", "chorus"], presets: ["ROCK"], weight: 1.25, motionType: "shake", sfxText: "BOOM", sfxScale: 4, sfxPosition: "bottomRight", bubbleText: "刺さった", bubblePosition: "topLeft", panelPattern: "action", flashEnabled: true, glitchEnabled: false },
  { id: "funk-side", moods: ["bass", "chorus"], presets: ["FUNK"], weight: 1.25, motionType: "sideGroove", sfxText: "バチッ", sfxScale: 4, sfxPosition: "bottomLeft", bubbleText: "ビートで跳ねろ", bubblePosition: "topRight", panelPattern: "horizontal", flashEnabled: false, glitchEnabled: false },
  { id: "calm-jazz", moods: ["quiet"], presets: ["JAZZ", "BALLADE"], weight: 1.2, motionType: "breathZoom", sfxText: "...", sfxScale: 1, sfxPosition: "bottomRight", bubbleText: "この余白が鳴ってる", bubblePosition: "topRight", panelPattern: "classic", flashEnabled: false, glitchEnabled: false },
];

const panelPatterns: PanelPattern[] = ["classic", "vertical", "horizontal", "diagonal", "action"];

const fallbackByMood: Record<AudioMood, AutoDirectionDecision> = {
  quiet: { motionType: "slowZoomIn", sfxText: "スッ", sfxScale: 1, sfxPosition: "bottomRight", bubbleText: "聞こえる？", bubblePosition: "topRight", panelPattern: "classic", flashEnabled: false, glitchEnabled: false },
  peak: { motionType: "impactZoom", sfxText: "CRASH", sfxScale: 3, sfxPosition: "center", bubbleText: "ここからだ", bubblePosition: "topLeft", panelPattern: "action", flashEnabled: true, glitchEnabled: true },
  bass: { motionType: "grooveBounce", sfxText: "ドン!!", sfxScale: 4, sfxPosition: "bottomLeft", bubbleText: "低音が走る", bubblePosition: "topRight", panelPattern: "horizontal", flashEnabled: false, glitchEnabled: false },
  chorus: { motionType: "impactZoom", sfxText: "ドン!!", sfxScale: 6, sfxPosition: "center", bubbleText: "全部、鳴らせ", bubblePosition: "topLeft", panelPattern: "diagonal", flashEnabled: true, glitchEnabled: true },
};

export const runAutoDirectionEngine = (input: AutoDirectionInput): AutoDirectionDecision => {
  // 1) candidate generation
  const pool = candidates.filter((candidate) => candidate.moods.includes(input.audioMood));

  // 2) scoring
  const scored = pool.map((candidate) => {
    let score = candidate.weight;

    if (candidate.presets.includes(input.activePreset ?? "SIMPLE")) score += 1.2;
    if (input.chorusBoost && input.audioMood === "chorus") score += 0.8;
    if (input.showPanels && ["diagonal", "action"].includes(candidate.panelPattern)) score += 0.25;
    if (input.showGlitch && candidate.glitchEnabled) score += 0.35;
    if (input.showSfx && candidate.sfxScale >= 3) score += 0.2;

    const avgEq = input.eqBars.length > 0 ? input.eqBars.reduce((acc, v) => acc + v, 0) / input.eqBars.length : 0;
    if (avgEq >= 55 && (candidate.motionType === "impactZoom" || candidate.motionType === "comic")) score += 0.25;
    if (input.switchMode === "equal" && (candidate.motionType === "slowZoomIn" || candidate.motionType === "breathZoom")) score += 0.15;

    return { candidate, score };
  });

  // 3) ranking / selection (top-k weighted random)
  const ranked = scored.sort((a, b) => b.score - a.score).slice(0, 3);
  const total = ranked.reduce((acc, item) => acc + item.score, 0);
  const pick = Math.random() * Math.max(total, 0.01);

  let cumulative = 0;
  let selected: Candidate | null = null;
  for (const item of ranked) {
    cumulative += item.score;
    if (pick <= cumulative) {
      selected = item.candidate;
      break;
    }
  }

  const base = selected ?? fallbackByMood[input.audioMood];
  const sfxPosition = input.currentImageIndex % 2 === 0 ? base.sfxPosition : positions[(positions.indexOf(base.sfxPosition) + 1) % positions.length];
  const panelPattern = input.showPanels ? base.panelPattern : panelPatterns[input.currentImageIndex % panelPatterns.length];

  return {
    ...base,
    sfxPosition,
    panelPattern,
  };
};

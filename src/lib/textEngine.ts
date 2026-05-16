import type { AudioMood } from "../types/mv";

export const bubbleTexts = ["まだ鳴ってる", "止まらない", "見えてる？", "ここからだ", "ノイズごと踊れ", "心臓が先に走る", "その音、刺さってる", "まだ終わらない", "この瞬間だけ", "見逃すな"];
export const sfxTexts = ["ドン!!", "ザザッ", "バチッ", "ギュン", "BOOM", "ERROR", "PULSE", "NOISE", "BANG", "VIBE", "FLASH", "CRASH"];

export const smartBubbleTexts: Record<AudioMood, string[]> = {
  quiet: ["聞こえる？", "まだ、ここにいる", "静かに燃えてる", "この余白が鳴ってる", "見えてる？"],
  peak: ["ここからだ", "刺さった", "止まらない", "この瞬間だけ", "見逃すな"],
  bass: ["低音が走る", "心臓が先に鳴る", "床まで震えろ", "このビートで跳ねろ", "まだ沈まない"],
  chorus: ["ノイズごと踊れ", "まだ止まらない", "全部、鳴らせ", "心臓ごと光れ", "ここで壊れろ"],
};

export const smartSfxTexts: Record<AudioMood, string[]> = {
  quiet: ["スッ", "...", "ふわっ", "しん", "tone"],
  peak: ["バチッ", "FLASH", "CRASH", "BANG", "ギュン"],
  bass: ["ドン!!", "ズン!!", "BOOM", "BASS", "ドッ"],
  chorus: ["PULSE", "NOISE", "ERROR", "BURST", "BREAK"],
};

"use client";

import { getExportModeLabel, getExportResolution, getExportStatusLabel } from "../lib/exportHelpers";
import type {
  AspectRatio,
  ExportAudioStatus,
  ExportMode,
  ExportQuality,
  ExportStatus,
} from "../types/mv";

type ExportPanelProps = {
  aspectRatio: AspectRatio;
  audioDuration: number;
  imageCount: number;
  exportMode: ExportMode;
  exportQuality: ExportQuality;
  setExportQuality: (quality: ExportQuality) => void;
  exportStatus: ExportStatus;
  exportMessage: string;
  exportAudioStatus: ExportAudioStatus;
  hasRecordedBlob: boolean;
  handlePrepareExport: () => void;
  handleStartRecording: () => void;
  handleStopRecording: () => void;
  handleDownloadRecording: () => void;
  formatTime: (time: number) => string;
};

const getAudioStatusLabel = (status: ExportAudioStatus) => {
  switch (status) {
    case "with-audio":
      return "ON";
    case "video-only":
      return "未対応のため映像のみ";
    default:
      return "未判定";
  }
};

export default function ExportPanel({
  aspectRatio,
  audioDuration,
  imageCount,
  exportMode,
  exportQuality,
  setExportQuality,
  exportStatus,
  exportMessage,
  exportAudioStatus,
  hasRecordedBlob,
  handlePrepareExport,
  handleStartRecording,
  handleStopRecording,
  handleDownloadRecording,
  formatTime,
}: ExportPanelProps) {
  const resolution = getExportResolution(aspectRatio, exportQuality);

  return (
    <div className="pt-3 pb-3 border-b border-zinc-700">
      <p className="text-sm mb-2 text-yellow-300 font-bold">出力設定</p>

      <div className="bg-zinc-900 border border-zinc-700 rounded p-3 text-xs text-zinc-300 space-y-2">
        <div className="flex justify-between"><span>出力画角</span><span className="text-yellow-300">{aspectRatio}</span></div>
        <div className="flex justify-between"><span>書き出し方式</span><span className="text-lime-300">{getExportModeLabel(exportMode)}</span></div>
        <div className="flex justify-between"><span>出力解像度</span><span className="text-emerald-300">{resolution.width} x {resolution.height}</span></div>
        <div className="flex justify-between"><span>音源尺</span><span className="text-cyan-300">{formatTime(audioDuration)}</span></div>
        <div className="flex justify-between"><span>画像枚数</span><span className="text-pink-300">{imageCount}枚</span></div>
        <div className="flex justify-between"><span>音声付き録画</span><span className="text-orange-300">{getAudioStatusLabel(exportAudioStatus)}</span></div>
      </div>

      <p className="text-sm mt-3 mb-2 text-cyan-300">書き出し品質</p>
      <div className="grid grid-cols-2 gap-2">
        <button onClick={() => setExportQuality("standard")} className={`p-2 rounded text-xs font-bold ${exportQuality === "standard" ? "bg-cyan-500 text-black" : "bg-zinc-800 hover:bg-zinc-700"}`}>標準</button>
        <button onClick={() => setExportQuality("high")} className={`p-2 rounded text-xs font-bold ${exportQuality === "high" ? "bg-pink-500 text-white" : "bg-zinc-800 hover:bg-zinc-700"}`}>高画質</button>
      </div>

      <button onClick={handlePrepareExport} className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-bold p-2 rounded mt-3">書き出し準備</button>
      <div className="grid grid-cols-2 gap-2 mt-2">
        <button onClick={handleStartRecording} className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold p-2 rounded text-xs">録画開始</button>
        <button onClick={handleStopRecording} className="bg-rose-500 hover:bg-rose-400 text-white font-bold p-2 rounded text-xs">録画停止</button>
      </div>
      <button
        onClick={handleDownloadRecording}
        disabled={!hasRecordedBlob}
        className={`w-full font-bold p-2 rounded mt-2 text-xs ${hasRecordedBlob ? "bg-violet-500 hover:bg-violet-400 text-white" : "bg-zinc-800 text-zinc-500 cursor-not-allowed"}`}
      >
        WebMダウンロード
      </button>

      <p className="text-xs text-zinc-400 mt-2">状態：{getExportStatusLabel(exportStatus)}</p>
      <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{exportMessage}</p>
    </div>
  );
}

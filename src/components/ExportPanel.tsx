"use client";

import {
  getExportModeLabel,
  getExportResultStatusMessage,
  getExportResolution,
} from "../lib/exportHelpers";
import type {
  AspectRatio,
  ExportAudioStatus,
  ExportMode,
  ExportQuality,
  ExportStatus,
  RecordingMode,
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
  handlePrepareExport: () => void;
  handleStartRecording: () => void;
  handleStopRecording: () => void;
  isRecording: boolean;
  recordingMode: RecordingMode | null;
  recordedVideoUrl: string | null;
  exportAudioStatus: ExportAudioStatus;
  formatTime: (time: number) => string;
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
  handlePrepareExport,
  handleStartRecording,
  handleStopRecording,
  isRecording,
  recordingMode,
  recordedVideoUrl,
  exportAudioStatus,
  formatTime,
}: ExportPanelProps) {
  const resolution = getExportResolution(aspectRatio, exportQuality);
  const isRecordingNow = isRecording || exportStatus === "recording";
  const hasRecordingResult = Boolean(recordedVideoUrl);
  const statusText = getExportResultStatusMessage(exportStatus);
  const recordingText = isRecordingNow
    ? recordingMode === "synced"
      ? "音源尺で録画中"
      : "録画中"
    : exportStatus === "finished"
      ? "録画完了"
      : "録画準備中";

  return (
    <div className="pt-1">
      <p className="text-sm mb-2 text-yellow-300 font-bold">出力設定</p>

      <div className="bg-zinc-900 border border-zinc-700 rounded p-3 text-xs text-zinc-300 space-y-2">
        <div className="flex justify-between">
          <span>出力画角</span>
          <span className="text-yellow-300">{aspectRatio}</span>
        </div>

        <div className="flex justify-between">
          <span>書き出し方式</span>
          <span className="text-lime-300">{getExportModeLabel(exportMode)}</span>
        </div>

        <div className="flex justify-between">
          <span>出力解像度</span>
          <span className="text-emerald-300">
            {resolution.width} x {resolution.height}
          </span>
        </div>

        <div className="flex justify-between">
          <span>音源尺</span>
          <span className="text-cyan-300">{formatTime(audioDuration)}</span>
        </div>

        <div className="flex justify-between">
          <span>画像枚数</span>
          <span className="text-pink-300">{imageCount}枚</span>
        </div>
      </div>

      <p className="text-sm mt-3 mb-2 text-cyan-300">書き出し品質</p>

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => setExportQuality("standard")}
          className={`p-2 rounded text-xs font-bold ${
            exportQuality === "standard"
              ? "bg-cyan-500 text-black"
              : "bg-zinc-800 hover:bg-zinc-700"
          }`}
        >
          標準
        </button>

        <button
          onClick={() => setExportQuality("high")}
          className={`p-2 rounded text-xs font-bold ${
            exportQuality === "high"
              ? "bg-pink-500 text-white"
              : "bg-zinc-800 hover:bg-zinc-700"
          }`}
        >
          高画質
        </button>
      </div>

      <button
        onClick={handlePrepareExport}
        className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-bold p-2 rounded mt-3"
      >
        書き出し準備
      </button>

      <p className="text-xs text-zinc-400 mt-2">状態：{statusText}</p>
      <p className="text-xs text-cyan-400 mt-1">録画状態：{recordingText}</p>
      <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{exportMessage}</p>
      <p className="text-xs text-zinc-500 mt-1">
        音声録画状態：
        {exportAudioStatus === "with-audio"
          ? "ON"
          : exportAudioStatus === "video-only"
            ? "未対応のため映像のみ"
            : "未判定"}
      </p>

      <div className="grid grid-cols-1 gap-2 mt-3">
        <button
          onClick={handleStartRecording}
          disabled={isRecordingNow}
          className="p-2 rounded text-xs font-bold bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-700 disabled:text-zinc-400 text-black"
        >
          {exportStatus === "finished" ? "もう一度録画する" : "録画開始"}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-2 mt-2">
        <button
          onClick={handleStopRecording}
          disabled={!isRecording}
          className="p-2 rounded text-xs font-bold bg-rose-500 hover:bg-rose-400 disabled:bg-zinc-700 disabled:text-zinc-400 text-white"
        >
          録画停止
        </button>
      </div>

      {hasRecordingResult && recordedVideoUrl && (
        <div className="mt-3 rounded border border-zinc-700 bg-zinc-900/70 p-3 text-xs space-y-3">
          <p className="text-emerald-300 font-bold">書き出し結果パネル</p>
          <p className="text-zinc-300">録画完了</p>

          <div className="space-y-2">
            <p className="text-zinc-300">WebMプレビュー</p>
            <video
              src={recordedVideoUrl}
              controls
              className="w-full rounded border border-zinc-700 bg-black"
            />
          </div>

          <a
            href={recordedVideoUrl}
            download="manga-mv-export.webm"
            className="inline-block text-lime-300 underline"
          >
            WebMをダウンロード
          </a>
          <p className="text-zinc-400">ファイル名：manga-mv-export.webm</p>
        </div>
      )}

      {exportStatus === "error" && (
        <p className="text-xs text-rose-300 mt-2">書き出し時にエラーが発生しました。</p>
      )}

      {exportStatus === "idle" && (
        <p className="text-xs text-zinc-500 mt-2">まだ録画は実行されていません。</p>
      )}

      {exportStatus === "finished" && (
        <p className="text-xs text-cyan-300 mt-2">
          再録画する場合は「もう一度録画する」を押してください。
        </p>
      )}

      {exportStatus === "ready" && (
        <p className="text-xs text-zinc-400 mt-2">録画準備が完了しています。</p>
      )}

      <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
        ※現在は Canvas 録画による WebM 書き出しに対応しています。
      </p>
    </div>
  );
}

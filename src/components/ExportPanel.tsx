"use client";

import { useEffect, useState } from "react";

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
  ExportFormatPreference,
  RecordingContainer,
} from "../types/mv";

type ExportPanelProps = {
  aspectRatio: AspectRatio;
  aspectList: AspectRatio[];
  aspectLabels: Record<AspectRatio, string>;
  setAspectRatio: (ratio: AspectRatio) => void;
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
  autoRecordEnabled: boolean;
  setAutoRecordEnabled: (enabled: boolean) => void;
  audioDurationState: "idle" | "loading" | "ready" | "error";
  hasAudio: boolean;
  exportFormatPreference: ExportFormatPreference;
  setExportFormatPreference: (value: ExportFormatPreference) => void;
  supportsMp4Recording: boolean;
  actualRecordingFormat: RecordingContainer;
  selectedMimeType: string | null;
  mp4FallbackMessage: string | null;
  recordedFileExtension: RecordingContainer | null;
  recordingStreamDiagnostics: {
    videoTrackCount: number;
    audioTrackCount: number;
    mimeType: string | null;
    format: RecordingContainer;
  } | null;
};

export default function ExportPanel({
  aspectRatio,
  aspectList,
  aspectLabels,
  setAspectRatio,
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
  autoRecordEnabled,
  setAutoRecordEnabled,
  audioDurationState,
  hasAudio,
  exportFormatPreference,
  setExportFormatPreference,
  supportsMp4Recording,
  actualRecordingFormat,
  selectedMimeType,
  mp4FallbackMessage,
  recordedFileExtension,
  recordingStreamDiagnostics,
}: ExportPanelProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      setMounted(true);
    }, 0);

    return () => {
      window.clearTimeout(timerId);
    };
  }, []);

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
  const canUseAutoRecord = hasAudio && audioDurationState === "ready" && audioDuration > 0;

  return (
    <div className="pt-1">
      <p className="text-sm mb-2 text-yellow-300 font-bold">出力設定</p>

      <div className="rounded-lg border border-pink-500/40 bg-zinc-950/70 p-3">
        <p className="text-xs font-bold text-pink-300">画角</p>
        <p className="mt-1 text-[11px] text-zinc-300">現在の画角：{aspectRatio}</p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {aspectList.map((ratio) => {
            const isActive = aspectRatio === ratio;
            return (
              <button
                key={ratio}
                onClick={() => setAspectRatio(ratio)}
                className={`rounded border p-2 text-xs font-bold ${
                  isActive
                    ? "border-yellow-300 bg-yellow-300/90 text-black shadow-[0_0_0_1px_rgba(253,224,71,0.9)]"
                    : "border-zinc-600 bg-zinc-800 hover:bg-zinc-700"
                }`}
              >
                <span>{aspectLabels[ratio]}</span>
                {isActive ? <span className="ml-1 inline-block text-[10px]">選択中</span> : null}
              </button>
            );
          })}
        </div>
        <ul className="mt-2 space-y-0.5 text-[11px] text-zinc-300">
          <li>・横長 16:9：YouTube向け</li>
          <li>・縦長 9:16：ショート / TikTok / Reels向け</li>
          <li>・正方形 1:1：SNS投稿向け</li>
          <li>・縦SNS 4:5：Instagramフィード向け</li>
        </ul>
      </div>

      <div className="bg-zinc-900 border border-zinc-700 rounded p-3 text-xs text-zinc-300 space-y-2">
        <div className="flex justify-between">
          <span>出力画角</span>
          <span className="text-yellow-300">{aspectRatio}</span>
        </div>

        <div className="flex justify-between">
          <span>書き出し形式</span>
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
      <div className="mt-3 space-y-2">
        <p className="text-xs text-zinc-300">書き出し形式</p>
        <div className="grid grid-cols-3 gap-2">
          {(["auto", "mp4", "webm"] as const).map((format) => (
            <button
              key={format}
              onClick={() => setExportFormatPreference(format)}
              className={`p-2 rounded text-xs font-bold ${
                exportFormatPreference === format
                  ? "bg-lime-500 text-black"
                  : "bg-zinc-800 hover:bg-zinc-700"
              }`}
            >
              {format === "auto" ? "自動" : format.toUpperCase()}
            </button>
          ))}
        </div>
        <p className="text-xs text-zinc-300">
          {!mounted
            ? "MP4対応確認中..."
            : supportsMp4Recording
              ? "この端末はMP4書き出しに対応しています"
              : "この端末はMP4録画に非対応のためWebMで保存します"}
        </p>
        {mounted && mp4FallbackMessage && <p className="text-xs text-amber-300">{mp4FallbackMessage}</p>}
        <p className="text-xs text-cyan-300">
          実際の録画形式：{mounted ? actualRecordingFormat.toUpperCase() : "確認中"}
        </p>
        <p className="text-[11px] text-zinc-500">
          使用MIME: {mounted ? (selectedMimeType ?? "ブラウザ既定") : "確認中"}
        </p>
        {mounted && recordingStreamDiagnostics && (
          <div className="rounded border border-cyan-900/80 bg-cyan-950/20 p-2 space-y-1">
            <p className="text-[11px] text-cyan-200">
              録画ストリーム：{recordingStreamDiagnostics.videoTrackCount > 0 ? "映像あり" : "映像なし"} / {recordingStreamDiagnostics.audioTrackCount > 0 ? "音声あり" : "音声なし"}
            </p>
            <p className="text-[11px] text-cyan-200">録画音声トラック：{recordingStreamDiagnostics.audioTrackCount}</p>
            <p className="text-[11px] text-cyan-200">録画音声：{recordingStreamDiagnostics.audioTrackCount > 0 ? "あり" : "なし"}</p>
            <p className="text-[11px] text-cyan-200">録画形式：{recordingStreamDiagnostics.format.toUpperCase()}</p>
            <p className="text-[11px] text-cyan-200">使用MIME：{recordingStreamDiagnostics.mimeType ?? "ブラウザ既定"}</p>
            {recordingStreamDiagnostics.format === "mp4" && (
              <p className="text-[11px] text-amber-300">注意：この端末ではMP4音声が入らない場合があります</p>
            )}
          </div>
        )}
      </div>
      <div className="mt-3 rounded border border-emerald-800/80 bg-emerald-950/30 p-3 space-y-2">
        <p className="text-xs text-emerald-200 font-bold">曲尺自動録画</p>
        <p className="text-xs text-zinc-200">
          曲の長さ：
          {audioDurationState === "loading" ? "曲の長さを取得中" : audioDurationState === "error" ? "曲の長さを取得できません" : formatTime(audioDuration)}
        </p>
        <p className="text-xs text-zinc-200">録画予定：{canUseAutoRecord ? formatTime(audioDuration) : "--:--"}</p>
        <label className="flex items-center gap-2 text-xs">
          <input type="checkbox" checked={autoRecordEnabled} onChange={(e) => setAutoRecordEnabled(e.target.checked)} disabled={!canUseAutoRecord || isRecordingNow} />
          曲尺自動録画：{autoRecordEnabled && canUseAutoRecord ? "ON" : "OFF"}
        </label>
        {!hasAudio && (
          <p className="text-xs text-amber-300">BGMをアップロードすると曲尺自動録画が使えます</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-2 mt-3">
        <button
          onClick={handleStartRecording}
          disabled={isRecordingNow}
          className="p-2 rounded text-xs font-bold bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-700 disabled:text-zinc-400 text-black"
        >
          1. {exportStatus === "finished" ? "もう一度録画する" : "録画開始"}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-2 mt-2">
        <button
          onClick={handleStopRecording}
          disabled={!isRecording}
          className="p-2 rounded text-xs font-bold bg-rose-500 hover:bg-rose-400 disabled:bg-zinc-700 disabled:text-zinc-400 text-white"
        >
          2. 録画停止
        </button>
      </div>

      {hasRecordingResult && recordedVideoUrl && (
        <div className="mt-3 rounded border border-zinc-700 bg-zinc-900/70 p-3 text-xs space-y-3">
          <p className="text-emerald-300 font-bold">書き出し結果パネル</p>
          <p className="text-zinc-300">録画完了</p>

          <div className="space-y-2">
            <p className="text-zinc-300">動画プレビュー</p>
            <video
              src={recordedVideoUrl}
              controls
              playsInline
              className="w-full rounded border border-zinc-700 bg-black"
            />
          </div>

          <a
            href={recordedVideoUrl}
            download={`manga-mv-engine.${recordedFileExtension ?? "webm"}`}
            className="inline-block text-lime-300 underline"
          >
            3. {recordedFileExtension === "mp4" ? "MP4" : "WebM"}をダウンロード
          </a>
          <p className="text-zinc-400">ファイル名：manga-mv-engine.{recordedFileExtension ?? "webm"}</p>
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
        ※MP4 β: 端末がMP4録画非対応の場合は安全にWebMへフォールバックします。
      </p>
    </div>
  );
}

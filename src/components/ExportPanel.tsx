"use client";

type ExportQuality = "standard" | "high";
type AspectRatio = "16:9" | "9:16" | "1:1" | "4:5";

type ExportPanelProps = {
  aspectRatio: AspectRatio;
  audioDuration: number;
  imageCount: number;
  exportQuality: ExportQuality;
  setExportQuality: (quality: ExportQuality) => void;
  exportStatus: string;
  handlePrepareExport: () => void;
  formatTime: (time: number) => string;
};

export default function ExportPanel({
  aspectRatio,
  audioDuration,
  imageCount,
  exportQuality,
  setExportQuality,
  exportStatus,
  handlePrepareExport,
  formatTime,
}: ExportPanelProps) {
  return (
    <div className="pt-3 pb-3 border-b border-zinc-700">
      <p className="text-sm mb-2 text-yellow-300 font-bold">出力設定</p>

      <div className="bg-zinc-900 border border-zinc-700 rounded p-3 text-xs text-zinc-300 space-y-2">
        <div className="flex justify-between">
          <span>出力画角</span>
          <span className="text-yellow-300">{aspectRatio}</span>
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

      <p className="text-xs text-zinc-400 mt-2">状態：{exportStatus}</p>

      <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
        ※現在は書き出し準備モードです。MP4保存は次の段階で Remotion
        または Canvas録画方式を接続します。
      </p>
    </div>
  );
}

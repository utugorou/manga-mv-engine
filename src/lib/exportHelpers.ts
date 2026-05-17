import type { AspectRatio, ExportMode, ExportQuality, ExportStatus } from "../types/mv";

type ExportResolution = {
  width: number;
  height: number;
};

const resolutionMap: Record<AspectRatio, Record<ExportQuality, ExportResolution>> = {
  "16:9": {
    stable: { width: 960, height: 540 },
    standard: { width: 1280, height: 720 },
    high: { width: 1920, height: 1080 },
  },
  "9:16": {
    stable: { width: 540, height: 960 },
    standard: { width: 720, height: 1280 },
    high: { width: 1080, height: 1920 },
  },
  "1:1": {
    stable: { width: 720, height: 720 },
    standard: { width: 1080, height: 1080 },
    high: { width: 1440, height: 1440 },
  },
  "4:5": {
    stable: { width: 720, height: 900 },
    standard: { width: 1080, height: 1350 },
    high: { width: 1440, height: 1800 },
  },
};

export const getExportResolution = (
  aspectRatio: AspectRatio,
  exportQuality: ExportQuality,
  isMobileViewport = false
): ExportResolution => {
  const base = resolutionMap[aspectRatio][exportQuality];
  if (!isMobileViewport) return base;
  return base;
};

export const getExportQualityLabel = (quality: ExportQuality): string => {
  switch (quality) {
    case "stable":
      return "安定";
    case "standard":
      return "標準";
    case "high":
      return "高品質";
    default:
      return "標準";
  }
};

export const getExportModeLabel = (exportMode: ExportMode): string => {
  switch (exportMode) {
    case "preview":
      return "プレビュー";
    case "canvas":
      return "Canvas録画";
    case "remotion":
      return "Remotion";
    default:
      return "プレビュー";
  }
};

export const getExportStatusLabel = (exportStatus: ExportStatus): string => {
  switch (exportStatus) {
    case "idle":
      return "未準備";
    case "ready":
      return "準備完了";
    case "recording":
      return "録画中";
    case "finished":
      return "完了";
    case "error":
      return "エラー";
    default:
      return "未準備";
  }
};


export const getExportResultStatusMessage = (exportStatus: ExportStatus): string => {
  switch (exportStatus) {
    case "idle":
      return "未録画";
    case "recording":
      return "録画中";
    case "finished":
      return "録画完了";
    case "error":
      return "エラー";
    case "ready":
      return "録画準備完了";
    default:
      return "未録画";
  }
};

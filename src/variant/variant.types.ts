import { types } from "hls-parser";
import { VmafPooledMetrics } from "src/vmaf-service/vmaf.dto";
import { Resolution } from "./variant.schema";

export type VariantInfo = {
  playlist: types.MediaPlaylist;
  declaredMaxBitrate: number;
  declaredAvgBitrate: number;
  measuredMaxBitrate?: number;
  measuredMinBitrate?: number;
  measuredAvgBitrate?: number;
  codecs: string;
  resolution: Resolution;
  vmafScore?: VmafPooledMetrics;
  masterPlaylistUri: string;
};

export type VariantDTO = {
  variant: types.Variant;
  masterPlaylistUri: string;
};

export type BitrateAggregation = {
  min: number;
  max: number;
  average: number;
};

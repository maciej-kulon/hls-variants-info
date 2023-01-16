import { types } from 'hls-parser';
import { ReadStream } from 'fs';
import { Duplex } from 'stream';

export type VariantInfo = {
  playlist: types.MediaPlaylist;
  declaredMaxBitrate: number;
  declaredAvgBitrate: number;
  measuredMaxBitrate?: number;
  measuredMinBitrate?: number;
  measuredAvgBitrate?: number;
  codecs: string;
  vmafScore?: VmafPooledMetrics;
  masterPlaylistUri: string;
};

export type SegmentInfo = {
  uri: string;
  bitrate: number;
};

export type BitrateAggregation = {
  min: number;
  max: number;
  average: number;
};

export type SegmentsFfprobeFinished = {
  variantUri: string;
  segments: SegmentInfo[];
};

export type VariantDataTransport = {
  variant: types.Variant;
  masterPlaylistUri: string;
};

export type SegmentDataTransport = {
  segmentUrl: string;
  mediaPlaylistUrl: string;
};

export type InputDataTransport = {
  hlsManifestUrl: string;
  originalVideoUrl?: string;
  vmafModel?: string;
};

export type VmafInputDataTransport = {
  variantUri: string;
  originalVideoUrl: string;
  vmafModel?: string;
};

export enum RMQTopic {
  HlsManifestUrlReceived = 'hls.manifest.url.received',
  HlsManifestParsed = 'hls.manifest.parsed',
  VariantDataCreated = 'variant.data.created',
  SegmentReadyToProbe = 'segment.ready.to.probe',
  SegmentsFfprobeCompleted = 'segments.ffprobe.finished',
  SegmentHasBeenAdded = 'segment.has.been.added',
  VmafInputDataReceived = 'vmaf.input.data.received',
  VariantVmafCompleted = 'variant.vmaf.completed',
}

export type VmafResult = {
  identifier: string;
  log: VmafLog;
};

export type VmafLog = {
  frames: Frame[];
  pooled_metrics: FramePooledMetrics;
};

export type Frame = {
  frameNum: number;
  metrics: FrameMetrics;
};

export type FrameMetrics = {
  psnr_y?: number;
  vmaf: number;
};

export type FramePooledMetrics = {
  vmaf: VmafPooledMetrics;
};

export type VmafPooledMetrics = {
  min: number;
  max: number;
  mean: number;
  harmonic_mean: number;
};

export type OriginalVideoData = {
  source: string | ReadStream | Duplex;
  width: number;
  height: number;
  fps: string;
};

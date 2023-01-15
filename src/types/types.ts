import { types } from 'hls-parser';

export type VariantInfo = {
  playlist: types.MediaPlaylist;
  declaredMaxBitrate: number;
  declaredAvgBitrate: number;
  measuredMaxBitrate: number;
  measuredMinBitrate: number;
  measuredAvgBitrate: number;
  codecs: string;
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
  hlsManifestUrl: string;
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
}
// ffmpeg -i https://flipfit-cdn.akamaized.net/flip_hls/630d4a50420d10001923979e-0633b7/audio-video/720/seg_0000.ts -i https://flipfit-cdn.akamaized.net/flip_hls/630d4a50420d10001923979e-0633b7/audio-video/720/seg_0000.ts -y -filter_complex "[0:v]scale=3840:2160[dist]; [1:v]scale=3840:2160[original]; [dist][original]libvmaf=model_path=/usr/local/share/model/vmaf_v0.6.1.json:log_fmt=json:log_path=/dev/stdout" -f null -

export type VmafInputDTO = {
  variantUri: string;
  originalVideoUrl: string;
  vmafModel?: string;
  enablePhoneModel?: boolean;
};

export type VmafResult = {
  originalVideoFile: string;
  usedVmafModel: string;
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
  source: string;
  width: number;
  height: number;
  fps: string;
};
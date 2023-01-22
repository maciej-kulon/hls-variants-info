export enum RMQTopic {
  HlsManifestUrlReceived = 'hls.manifest.url.received', // Priority 4
  HlsManifestParsed = 'hls.manifest.parsed', // Priority 5
  VariantDataCreated = 'variant.data.created', // Priority 6
  SegmentReadyToProbe = 'segment.ready.to.probe', // Priority 7
  SegmentsFfprobeCompleted = 'segments.ffprobe.finished', // Priority 8
  VmafInputDataReceived = 'vmaf.input.data.received', // Priority 2
  VariantVmafCompleted = 'variant.vmaf.completed', // Priority 3
}

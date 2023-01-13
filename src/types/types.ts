import { FfprobeData } from 'fluent-ffmpeg';
import { types } from 'hls-parser';

export type SegmentResult = {
  ffprobeData: FfprobeData;
  uri: string;
};

export type MediaPlaylistResult = {
  segments: SegmentResult[];
  uri: string;
};

export type MasterPlaylistResult = {
  variants: MediaPlaylistResult[];
  uri: string;
};

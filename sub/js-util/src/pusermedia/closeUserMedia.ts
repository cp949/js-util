import { closeUserMediaAudioTracks } from './closeUserMediaAudioTracks.js';
import { closeUserMediaVideoTracks } from './closeUserMediaVideoTracks.js';

const isNullish = (obj: any): obj is null | undefined => {
  return typeof obj === 'undefined' || obj === null;
};

export function closeUserMedia(media: MediaStream | null | undefined) {
  if (media) {
    if (!isNullish(media.getVideoTracks)) {
      closeUserMediaVideoTracks(media);
    }
    if (!isNullish(media.getAudioTracks)) {
      closeUserMediaAudioTracks(media);
    }
  } else {
    const mediaUnknown = media as unknown as MediaStreamTrack;
    if (mediaUnknown && typeof mediaUnknown['stop'] === 'function') {
      mediaUnknown.stop();
    }
  }
}

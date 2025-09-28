export function closeUserMediaVideoTracks(media: MediaStream | null | undefined) {
  if (media) {
    media.getVideoTracks().forEach((track) => {
      try {
        media.removeTrack(track);
        track.stop();
      } catch (ignore: any) {
        //
      }
    });
  }
}

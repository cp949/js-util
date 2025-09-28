export function closeUserMediaAudioTracks(media: MediaStream | null | undefined) {
  if (media) {
    media.getAudioTracks().forEach((track) => {
      try {
        media.removeTrack(track);
        track.stop();
      } catch (ignore: any) {
        //
      }
    });
  }
}

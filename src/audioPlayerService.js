import TrackPlayer from 'react-native-track-player';

/**
 * Handles TrackPlayer events, whether the app is running or not.
 * This allows the audio control widget on the lock screen to work.
 * Additional events impacting rendering are handled in the AudioPlayer component.
 */

const {
  TrackPlayerEvents,
} = TrackPlayer;

async function audioPlayerService() {
  TrackPlayer.addEventListener(TrackPlayerEvents.REMOTE_PLAY, () => {
    TrackPlayer.play();
  });

  TrackPlayer.addEventListener(TrackPlayerEvents.REMOTE_PAUSE, () => {
    TrackPlayer.pause();
  });

  TrackPlayer.addEventListener(TrackPlayerEvents.REMOTE_STOP, () => {
    TrackPlayer.stop();
  });
}

export default audioPlayerService;

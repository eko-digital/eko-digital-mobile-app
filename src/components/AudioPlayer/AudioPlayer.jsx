// @flow
import React, {
  useState, useEffect, useCallback, useMemo,
} from 'react';
import TrackPlayer from 'react-native-track-player';
import { StyleSheet, View } from 'react-native';
import { ErrorBoundary } from 'react-error-boundary';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  useTheme, TouchableRipple, ActivityIndicator, Paragraph,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

import ErrorView from './ErrorView';
import config from '../../config';
import { secondsToHms } from '../../utils';
import SeekBar from './SeekBar';

const {
  TrackPlayerEvents,
  STATE_NONE,
  STATE_BUFFERING,
  STATE_READY,
  STATE_PLAYING,
  STATE_PAUSED,
  STATE_STOPPED,
  useTrackPlayerProgress,
  useTrackPlayerEvents,
} = TrackPlayer;

const events = [
  TrackPlayerEvents.PLAYBACK_STATE,
  TrackPlayerEvents.PLAYBACK_ERROR,
  TrackPlayerEvents.PLAYBACK_QUEUE_ENDED,
  TrackPlayerEvents.REMOTE_PLAY,
  TrackPlayerEvents.REMOTE_PAUSE,
  TrackPlayerEvents.REMOTE_STOP,
  TrackPlayerEvents.REMOTE_SEEK,
  TrackPlayerEvents.REMOTE_DUCK,
];

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingContainer: {
    paddingHorizontal: config.values.space.small,
    paddingVertical: config.values.space.normal,
  },
  button: {
    paddingHorizontal: config.values.space.small,
    paddingVertical: config.values.space.normal,
  },
  sliderContainer: {
    flex: 1,
    paddingRight: config.values.space.normal,
  },
  slider: {
    width: '100%',
    borderColor: 'red',
    borderWidth: 1,
  },
  timeWrapper: {
    paddingHorizontal: config.values.space.normal,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export type PlaybackState = STATE_BUFFERING
  | STATE_PLAYING
  | STATE_STOPPED
  | STATE_NONE
  | STATE_READY
  | STATE_PAUSED;

type Props = {
  id: string,
  url: string,
  title: string,
  artist: string,
  onReload?: () => void,
  onReady?: (duration: number) => void,
};

function AudioPlayer(props: Props) {
  const {
    id,
    url,
    title,
    artist,
    onReload,
    onReady,
  } = props;
  const progress = useTrackPlayerProgress();
  const [duration, setDuration] = useState<boolean>(false);
  const [playbackReady, setPlaybackReady] = useState<boolean>(false);
  const [playbackStarted, setPlaybackStarted] = useState<boolean>(false);
  const [playbackState, setPlaybackState] = useState<PlaybackState | null>(null);
  // playbackState doesn't change to stopped on iOS so we have to track it manually
  // github issue: https://github.com/react-native-kit/react-native-track-player/issues/610
  const [playbackEnded, setPlaybackEnded] = useState<boolean>(false);
  const [playbackDucked, setPlaybackDucked] = useState<boolean>(false);
  const [playbackError, setPlaybackError] = useState<boolean>(false);

  const theme = useTheme();
  const navigation = useNavigation();

  const handlePlayerEventsChange = useCallback((event) => {
    if (event.type === TrackPlayerEvents.PLAYBACK_STATE) {
      setPlaybackState(event.state);
      if (event.state === STATE_READY) {
        setPlaybackReady(true);
        TrackPlayer.getDuration().then((dur) => {
          if (onReady) {
            onReady(dur);
          }
          setDuration(dur);
        });
      }

      if (event.state === STATE_PLAYING && !playbackStarted) {
        setPlaybackStarted(true);
      }
    } else if (event.type === TrackPlayerEvents.PLAYBACK_ERROR) {
      setPlaybackError(true);
      console.error(`An error occurred while playing the audio. Error: ${event.message}`);
    } else if (
      event.type === TrackPlayerEvents.PLAYBACK_QUEUE_ENDED
      && event.track
      && event.position
    ) {
      setPlaybackEnded(true);
    }

    // handle remote events
    switch (event.type) {
      case TrackPlayerEvents.REMOTE_PLAY:
        TrackPlayer.play();
        break;

      case TrackPlayerEvents.REMOTE_PAUSE:
        TrackPlayer.pause();
        break;

      case TrackPlayerEvents.REMOTE_STOP:
        TrackPlayer.stop();
        break;

      case TrackPlayerEvents.REMOTE_SEEK:
        TrackPlayer.seekTo(event.position);
        break;

      case TrackPlayerEvents.REMOTE_DUCK:
        if (event.paused && event.permanent) {
          TrackPlayer.stop();
          setPlaybackDucked(false);
        } else if (event.paused && playbackState === STATE_PLAYING) {
          TrackPlayer.pause();
          setPlaybackDucked(true);
        } else if (playbackDucked && playbackState === STATE_PAUSED) {
          TrackPlayer.play();
          setPlaybackDucked(false);
        }
        break;

      default:
    }
  }, [playbackStarted, onReady, playbackState, playbackDucked]);

  useTrackPlayerEvents(events, handlePlayerEventsChange);

  const addTrack = useCallback(() => {
    const track = {
      id,
      url,
      title,
      artist,
    };

    // let's first reset the current track
    TrackPlayer.reset();
    setPlaybackError(false);

    TrackPlayer.add([track]).then(async () => {
      setPlaybackEnded(false);
    }).catch(() => {
      setPlaybackError(true);
    });
  }, [artist, id, title, url]);

  useEffect(() => {
    TrackPlayer.setupPlayer().then(addTrack);

    TrackPlayer.updateOptions({
      capabilities: [
        TrackPlayer.CAPABILITY_PLAY,
        TrackPlayer.CAPABILITY_PAUSE,
        TrackPlayer.CAPABILITY_STOP,
        TrackPlayer.CAPABILITY_SEEK_TO,
      ],
      stopWithApp: true,
      alwaysPauseOnInterruption: true,
    });

    const stopTrackListener = navigation.addListener('blur', () => {
      TrackPlayer.reset();
    });

    return () => {
      navigation.removeListener('blur', stopTrackListener);
    };
  }, [addTrack, navigation]);

  const handleToggle = useCallback(async () => {
    if (!playbackReady) {
      return;
    }

    if (playbackEnded) {
      addTrack();
      TrackPlayer.play();
    } else if (playbackState === STATE_PLAYING) {
      TrackPlayer.pause();
    } else {
      TrackPlayer.play();
    }
  }, [playbackReady, playbackEnded, playbackState, addTrack]);

  const toggleIcon = useMemo(() => {
    if (playbackEnded) {
      return 'replay';
    }

    if (playbackState !== STATE_PLAYING) {
      return 'play';
    }

    return 'pause';
  }, [playbackEnded, playbackState]);

  if (playbackError) {
    return (
      <ErrorView
        onReload={onReload}
      />
    );
  }

  if (!playbackReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorView}>
      <View style={styles.container}>
        <TouchableRipple
          onPress={handleToggle}
          style={styles.button}
        >
          <MaterialCommunityIcons
            name={toggleIcon}
            color={theme.colors.text}
            size={40}
          />
        </TouchableRipple>
        <View style={styles.sliderContainer}>
          <SeekBar
            style={styles.slider}
            disabled={!playbackReady || playbackEnded}
          />
          <View style={styles.timeWrapper}>
            <Paragraph>{secondsToHms(progress.position)}</Paragraph>
            <Paragraph>{secondsToHms(progress.duration || duration)}</Paragraph>
          </View>
        </View>
      </View>
    </ErrorBoundary>
  );
}

export default AudioPlayer;

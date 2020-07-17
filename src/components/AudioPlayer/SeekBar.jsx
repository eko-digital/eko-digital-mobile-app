// @flow
import React, { useState, useCallback, useRef } from 'react';
import Slider from '@react-native-community/slider';
import TrackPlayer from 'react-native-track-player';
import { useTheme } from 'react-native-paper';

const {
  useTrackPlayerProgress,
} = TrackPlayer;

type Props = {
  style: any,
  disabled: boolean,
}

function SeekBar({ style, disabled }: Props) {
  const [sliderPosition, setSliderPosition] = useState<number>(0);
  const [isSliding, setIsSliding] = useState<boolean>(false);
  const timerIDRef = useRef<TimeoutID | null>(null);

  const { position, duration } = useTrackPlayerProgress();
  const theme = useTheme();

  const handleSlidingStart = useCallback(() => {
    clearTimeout(timerIDRef.current);

    setIsSliding(true);
  }, []);

  const handleValueChange = useCallback((value: number) => {
    clearTimeout(timerIDRef.current);
    setIsSliding(true);
    setSliderPosition(value);
  }, []);

  const handleSlidingComplete = useCallback((value: number) => {
    clearTimeout(timerIDRef.current);

    TrackPlayer.seekTo(value);

    // wait for seekTo to take effect
    timerIDRef.current = setTimeout(() => {
      setIsSliding(false);
      setSliderPosition(value);
    }, 1000);
  }, []);

  return (
    <Slider
      style={style}
      value={isSliding ? sliderPosition : position}
      minimumValue={0}
      maximumValue={duration}
      minimumTrackTintColor={theme.colors.primary}
      maximumTrackTintColor={theme.colors.placeholder}
      thumbTintColor={theme.colors.primary}
      disabled={disabled}
      onSlidingStart={handleSlidingStart}
      onValueChange={handleValueChange}
      onSlidingComplete={handleSlidingComplete}
    />
  );
}

export default SeekBar;

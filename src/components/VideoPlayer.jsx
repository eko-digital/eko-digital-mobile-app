// @flow
import React, { useState, useEffect } from 'react';
import Video from 'react-native-video';
import { StyleSheet } from 'react-native';

type Props = {|
  uri: string,
  poster?: string | null,
|}

const styles = StyleSheet.create({
  video: {
    width: '100%',
    height: 200,
    backgroundColor: '#000',
  },
});

function VideoPlayer({ uri, poster }: Props) {
  const [showControls, setShowControls] = useState<boolean>(false);

  // show controls after first render to prevent control misplacement on Android
  useEffect(() => {
    setShowControls(true);
  }, []);

  return (
    <Video
      key={uri}
      style={styles.video}
      source={{ uri }}
      resizeMode="contain"
      controls={showControls}
      paused
      poster={poster}
    />
  );
}

export default VideoPlayer;

// @flow
import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import { WebView } from 'react-native-webview';

import type { Post } from '../types';
import ErrorScreen from '../components/ErrorScreen';

const html = `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
</head>

<body>
  <style>
    body {
      margin: 0;
      padding: 0;
      display: flex;
      height: 100vh;
      justify-content: center;
      align-items: center;
    }
  </style>
  <stream src="[token]" controls preload autoplay width="100vw" height="100vh"></stream>
  <script data-cfasync="false" defer type="text/javascript"
    src="https://embed.cloudflarestream.com/embed/r4xu.fla9.latest.js?video=[token]">
  </script>
</body>

</html>
`;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

type Props = {
  route: {
    params: {
      post: Post,
    },
  },
}

function VideoScreen({ route }: Props) {
  const { params: { post } } = route;
  if (!post.videoToken) {
    return <ErrorScreen description="An unexpected error has occurred while loading video. Please try again later." />;
  }

  return (
    <View style={styles.container}>
      <WebView
        allowsFullscreenVideo
        mediaPlaybackRequiresUserAction={false}
        bounces={false}
        originWhitelist={['*']}
        source={{ html: html.replace('[token]', post.videoToken) }}
      />
    </View>
  );
}

export default VideoScreen;

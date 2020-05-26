// @flow
import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import { WebView } from 'react-native-webview';

import type { Post } from '../types';

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
  <stream src="5d5bc37ffcf54c9b82e996823bffbb81" controls preload autoplay width="100vw" height="100vh"></stream>
  <script data-cfasync="false" defer type="text/javascript"
    src="https://embed.cloudflarestream.com/embed/r4xu.fla9.latest.js?video=5d5bc37ffcf54c9b82e996823bffbb81">
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
  console.log(route);

  return (
    <View style={styles.container}>
      <WebView
        allowsFullscreenVideo
        mediaPlaybackRequiresUserAction={false}
        bounces={false}
        originWhitelist={['*']}
        source={{ html }}
      />
    </View>
  );
}

export default VideoScreen;

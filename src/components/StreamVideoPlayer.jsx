// @flow
import React from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';

import ErrorScreen from './ErrorScreen';

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
  <stream src="[token]" controls preload width="100vw" height="100vh"></stream>
  <script data-cfasync="false" defer type="text/javascript"
    src="https://embed.cloudflarestream.com/embed/r4xu.fla9.latest.js?video=[token]">
  </script>
</body>

</html>
`;

type Props = {
  token: string,
  style?: any,
}

function StreamVideoPlayer({ token, style }: Props) {
  if (!token) {
    return <ErrorScreen description="An unexpected error has occurred while loading video. Please try again later." />;
  }

  return (
    <View style={style}>
      <WebView
        allowsFullscreenVideo
        mediaPlaybackRequiresUserAction={false}
        bounces={false}
        originWhitelist={['*']}
        source={{ html: html.replace('[token]', token) }}
      />
    </View>
  );
}

export default StreamVideoPlayer;

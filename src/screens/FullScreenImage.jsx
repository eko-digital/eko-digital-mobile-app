// @flow
import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import { useTheme } from 'react-native-paper';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

type Props = {
  route: {
    params: {
      uri: string,
    },
  },
}

function FullScreenImage({ route }: Props) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <ImageViewer
        imageUrls={[{ url: route.params.uri }]}
        renderIndicator={() => null}
        doubleClickInterval={300}
        backgroundColor={theme.colors.background}
      />
    </View>
  );
}

export default FullScreenImage;

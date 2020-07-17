// @flow
import React, { useState, useCallback } from 'react';
import { useTheme, Button } from 'react-native-paper';
import { View, StyleSheet } from 'react-native';
import BodyText from './BodyText';

const styles = StyleSheet.create({
  readMore: {
    alignSelf: 'flex-end',
  },
});

type Props = {
  text: string;
}

function ReadMoreText({ text }: Props) {
  const [showAll, setShowAll] = useState<boolean>(false);

  const theme = useTheme();

  const toggle = useCallback(() => setShowAll((val) => !val), []);

  if (text.length < 120) {
    return <BodyText>{text}</BodyText>;
  }

  return (
    <View>
      <BodyText numberOfLines={showAll ? 0 : 4}>
        {text}
      </BodyText>
      <Button
        style={[styles.readMore, { color: theme.colors.primary }]}
        onPress={toggle}
        uppercase={false}
      >
        {showAll ? 'Show less' : 'Read more'}
      </Button>
    </View>
  );
}

export default ReadMoreText;

// @flow
import React, { useState, useCallback } from 'react';
import { Paragraph, useTheme, Button } from 'react-native-paper';
import { View, StyleSheet } from 'react-native';

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
    return <Paragraph>{text}</Paragraph>;
  }

  return (
    <View>
      <Paragraph numberOfLines={showAll ? 0 : 4}>
        {text}
      </Paragraph>
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

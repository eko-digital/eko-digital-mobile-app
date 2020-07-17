// @flow
import * as React from 'react';
import { Paragraph, useTheme } from 'react-native-paper';
import { StyleSheet, Platform } from 'react-native';

const styles = StyleSheet.create({
  paragraph: {
    ...Platform.select({
      android: {
        fontFamily: 'Merriweather-Regular',
      },
    }),
  },
});

type Props = {|
  children: React.Node,
  style?: any,
  numberOfLines?: number,
|}

function BodyText({ children, style, numberOfLines }: Props) {
  const theme = useTheme();

  return (
    <Paragraph
      style={[{ color: theme.colors.text }, styles.paragraph, style]}
      numberOfLines={numberOfLines}
    >
      {children}
    </Paragraph>
  );
}

export default BodyText;

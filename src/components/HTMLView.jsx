// @flow
import React, { useCallback } from 'react';
import HTML from 'react-native-render-html';
import { IGNORED_TAGS } from 'react-native-render-html/src/HTMLUtils';
import { Linking, useWindowDimensions } from 'react-native';
import { useTheme } from 'react-native-paper';

import config from '../config';

type Props = {
  html: string,
  imagesMaxWidth?: number,
};

function HTMLView({ html, imagesMaxWidth }: Props) {
  const { width } = useWindowDimensions();
  const theme = useTheme();

  const handleLinkPress = useCallback((evt, href: string) => {
    try {
      Linking.openURL(href);
    } catch (error) {
      console.error(`Error opening URL: ${href}\n${error.message}`);
    }
  }, []);

  return (
    <HTML
      html={html}
      imagesMaxWidth={imagesMaxWidth || (width - config.values.space.normal * 2)}
      baseFontStyle={{
        color: theme.colors.text,
        ...theme.fonts.regular,
        fontSize: 15,
      }}
      tagsStyles={{
        i: { ...theme.fonts.regular },
        em: { ...theme.fonts.regular },
        b: { ...theme.fonts.medium },
        strong: { ...theme.fonts.medium },
        h1: { ...theme.fonts.medium },
        h2: { ...theme.fonts.medium },
        h3: { ...theme.fonts.medium },
        h4: { ...theme.fonts.medium },
        h5: { ...theme.fonts.medium },
        h6: { ...theme.fonts.medium },
        a: {
          textDecorationLine: 'underline',
          color: theme.colors.primary,
        },
        hr: { backgroundColor: theme.colors.onBackground },
      }}
      onLinkPress={handleLinkPress}
      ignoredTags={[...IGNORED_TAGS, 'iframe']}
      allowedStyles={['color', 'background', 'background-color']}
    />
  );
}

export default HTMLView;

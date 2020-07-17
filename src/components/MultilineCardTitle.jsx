// @flow
import * as React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import { Title, Caption } from 'react-native-paper';

const LEFT_SIZE = 40;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 16,
  },

  left: {
    justifyContent: 'center',
    marginRight: 16,
    height: LEFT_SIZE,
    width: LEFT_SIZE,
  },

  titles: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    minHeight: LEFT_SIZE,
    paddingVertical: 10,
  },

  title: {
    fontSize: 18,
    lineHeight: 22,
  },

  subtitle: {
    minHeight: 20,
    marginVertical: 0,
  },
});

type Props = {
  title: React.Node;
  titleStyle?: any;
  titleNumberOfLines?: number;
  subtitle?: React.Node;
  subtitleStyle?: any;
  subtitleNumberOfLines?: number;
  left?: (props: { size: number }) => React.Node;
  leftStyle?: any;
  right?: (props: { size: number }) => React.Node;
  rightStyle?: any;
  style?: any;
};

function MultilineCardTitle(props: Props) {
  const {
    left,
    leftStyle,
    right,
    rightStyle,
    subtitle,
    subtitleStyle,
    subtitleNumberOfLines,
    style,
    title,
    titleStyle,
    titleNumberOfLines,
  } = props;

  return (
    <View
      style={[
        styles.container,
        {
          minHeight: subtitle || left || right ? 72 : 50,
          paddingRight: right ? 0 : 16,
        },
        style,
      ]}
    >
      {left ? (
        <View style={[styles.left, leftStyle]}>
          {left({
            size: LEFT_SIZE,
          })}
        </View>
      ) : null}

      <View style={[styles.titles]}>
        {title ? (
          <Title
            style={[
              styles.title,
              { marginBottom: subtitle ? 0 : 2 },
              titleStyle,
            ]}
            numberOfLines={titleNumberOfLines || 2}
          >
            {title}
          </Title>
        ) : null}

        {subtitle ? (
          <Caption
            style={[styles.subtitle, subtitleStyle]}
            numberOfLines={subtitleNumberOfLines || 1}
          >
            {subtitle}
          </Caption>
        ) : null}
      </View>

      <View style={rightStyle}>{right ? right({ size: 24 }) : null}</View>
    </View>
  );
}

export default MultilineCardTitle;

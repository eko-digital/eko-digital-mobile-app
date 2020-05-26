// @flow
import * as React from 'react';
import { ScrollView, Image, StyleSheet } from 'react-native';
import { Title, Paragraph } from 'react-native-paper';
import config from '../config';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: config.values.space.normal,
    maxWidth: 300,
    alignSelf: 'center',
  },
  title: {
    marginTop: config.values.space.large,
  },
  description: {
    textAlign: 'center',
    marginVertical: config.values.space.small,
  },
});

type Props = {
  title: string,
  description: string | React.Node,
  illustration: any,
  // eslint-disable-next-line react/require-default-props
  extra?: React.Node,
}

function EmptyScreen({
  title,
  description,
  illustration,
  extra = null,
}: Props) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={illustration} />
      <Title style={styles.title}>{title}</Title>
      <Paragraph style={styles.description}>{description}</Paragraph>
      {extra}
    </ScrollView>
  );
}

export default EmptyScreen;

// @flow
import * as React from 'react';
import { ScrollView, Image, StyleSheet } from 'react-native';
import { Title } from 'react-native-paper';
import config from '../config';
import BodyText from './BodyText';

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
    textAlign: 'center',
  },
  description: {
    marginVertical: config.values.space.small,
    textAlign: 'center',
  },
});

type Props = {
  title: string,
  description: string | React.Node,
  illustration: any,
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
      <BodyText style={styles.description}>{description}</BodyText>
      {extra}
    </ScrollView>
  );
}

export default EmptyScreen;

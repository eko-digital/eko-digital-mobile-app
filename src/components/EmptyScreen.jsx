// @flow
import * as React from 'react';
import { ScrollView, Image, StyleSheet } from 'react-native';
import { Title, Paragraph } from 'react-native-paper';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    maxWidth: 300,
    alignSelf: 'center',
  },
  title: {
    marginTop: 20,
  },
  description: {
    textAlign: 'center',
    marginVertical: 8,
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

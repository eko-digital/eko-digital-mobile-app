// @flow
import React from 'react';
import { Button, Paragraph, Title } from 'react-native-paper';
import { StyleSheet, Image, ScrollView } from 'react-native';
import auth from '@react-native-firebase/auth';

import emptyState from '../images/empty-state.png';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    maxWidth: 300,
    alignSelf: 'center',
  },
  title: {
    marginTop: 20,
  },
  paragraph: {
    textAlign: 'center',
    marginVertical: 8,
  },
  button: {
    marginTop: 20,
  },
});

function AccountNotFound() {
  const handleLogout = React.useCallback(() => {
    auth().signOut();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={emptyState} />
      <Title style={styles.title}>No account found!</Title>
      <Paragraph style={styles.paragraph}>
        We could not found any account linked with this email id
        or phone number in any school&apos;s database.
      </Paragraph>
      <Paragraph style={styles.paragraph}>
        Make sure you login with the same email
        or phone number you received invitation on.
      </Paragraph>
      <Button
        style={styles.button}
        mode="contained"
        onPress={handleLogout}
      >
        Sign out
      </Button>
    </ScrollView>
  );
}

export default AccountNotFound;

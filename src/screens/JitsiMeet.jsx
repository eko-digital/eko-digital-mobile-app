// @flow
import React, { useContext, useEffect, useCallback } from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
// eslint-disable-next-line import/no-unresolved
import JitsiMeet, { JitsiMeetView } from 'react-native-jitsi-meet';
import firestore from '@react-native-firebase/firestore';
import { useTheme } from '@react-navigation/native';

import { DarkTheme } from 'react-native-paper';
import AccountContext from '../contexts/AccountContext';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
  },
  jitsiMeetView: {
    flex: 1,
    height: '100%',
    width: '100%',
  },
});

type Props = {
  route: {
    params: {
      id: string,
      url: string,
    },
  },
  navigation: any,
}

function LiveClass({ route, navigation }: Props) {
  const { params: { id, url } } = route;
  const { activeAccount } = useContext(AccountContext);

  const theme = useTheme();

  useEffect(() => {
    if (!activeAccount) {
      return;
    }

    const userInfo = {
      displayName: activeAccount.name,
      email: activeAccount.email || '',
      avatar: activeAccount.photoURL || '',
    };
    JitsiMeet.call(url, userInfo);
  }, [navigation, activeAccount, url]);

  const handleConferenceTerminated = useCallback(async () => {
    if (activeAccount?.isTeacher) {
      try {
        await firestore().collection('lessons').doc(id).update({ live: false });
      } catch (error) {
        console.error(error);
      }
    }
    navigation.goBack();
  }, [activeAccount, id, navigation]);

  const handleConferenceJoined = useCallback(async () => {
    if (activeAccount?.isTeacher) {
      try {
        await firestore().collection('lessons').doc(id).update({ live: true });
      } catch (error) {
        console.error(error);
      }
    }
  }, [activeAccount, id]);

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={DarkTheme.colors.surface}
      />
      <JitsiMeetView
        onConferenceTerminated={handleConferenceTerminated}
        onConferenceJoined={handleConferenceJoined}
        style={[styles.jitsiMeetView, { backgroundColor: theme.colors.background }]}
      />
    </View>
  );
}

export default LiveClass;

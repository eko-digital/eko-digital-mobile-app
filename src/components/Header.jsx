// @flow
import React, { useCallback, useMemo } from 'react';
import color from 'color';
import auth from '@react-native-firebase/auth';
import { TouchableOpacity } from 'react-native';
import { Appbar, useTheme } from 'react-native-paper';

import AccountContext from '../contexts/AccountContext';
import UserAvatar from './UserAvatar';

type Props = {
  scene: any,
  previous: boolean,
  navigation: any,
}

function Header({ scene, previous, navigation }: Props) {
  const theme = useTheme();
  const { activeAccount, switchAccount } = React.useContext(AccountContext);

  const navigateToNotifications = useCallback(async () => {
    navigation.navigate('Notifications');
  }, [navigation]);

  const handleSwitchAccount = useCallback(async () => {
    switchAccount();
  }, [switchAccount]);

  const { options } = scene.descriptor;

  let title;
  if (options.headerTitle) {
    title = options.headerTitle;
  } else if (options.title) {
    title = options.title;
  } else {
    title = scene.route.name;
  }

  const headerStyle = useMemo(() => {
    const style = {};

    if (options.hasTabs) {
      style.elevation = 0;
    }

    return style;
  }, [options.hasTabs]);

  return (
    <Appbar.Header
      theme={{ colors: { primary: theme.colors.surface } }}
      style={headerStyle}
    >
      {previous && (
        <Appbar.BackAction
          onPress={navigation.goBack}
          color={theme.colors.onSurface}
        />
      )}

      <Appbar.Content
        title={title}
        titleStyle={{
          fontSize: 18,
          color: theme.colors.text,
        }}
        subtitle={options.subtitle}
      />

      {!previous && (
        <Appbar.Action
          title="Notifications"
          icon="bell-outline"
          color={theme.colors.placeholder}
          style={{ backgroundColor: color(theme.colors.placeholder).alpha(0.08).toString() }}
          onPress={navigateToNotifications}
        />
      )}

      {!previous && activeAccount && (
        <TouchableOpacity
          style={{ marginHorizontal: 10 }}
          onPress={handleSwitchAccount}
        >
          <UserAvatar
            photoURL={activeAccount.photoURL || auth().currentUser.photoURL}
            name={activeAccount.name}
            size={36}
          />
        </TouchableOpacity>
      )}

      {options.headerRight}
    </Appbar.Header>
  );
}

export default Header;

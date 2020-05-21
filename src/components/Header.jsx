// @flow
import React, { useState, useCallback } from 'react';
import auth from '@react-native-firebase/auth';
import { TouchableOpacity } from 'react-native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import {
  Appbar,
  useTheme,
  Menu,
} from 'react-native-paper';

import AccountContext from '../contexts/AccountContext';
import UserAvatar from './UserAvatar';

type Props = {
  scene: any,
  previous: boolean,
  navigation: DrawerNavigationProp,
}

function Header({ scene, previous, navigation }: Props) {
  const [menuVisible, setMenuVisible] = useState<boolean>(false);
  const theme = useTheme();
  const { activeAccount, accountsCache } = React.useContext(AccountContext);

  const toggleMenu = useCallback(() => {
    setMenuVisible((v) => !v);
  }, []);

  const handleLogout = useCallback(async () => {
    if (accountsCache) {
      await accountsCache.clear();
    }

    auth().signOut();
  }, [accountsCache]);

  const { options } = scene.descriptor;

  let title;
  if (options.headerTitle) {
    title = options.headerTitle;
  } else if (options.title) {
    title = options.title;
  } else {
    title = scene.route.name;
  }

  return (
    <Appbar.Header
      theme={{ colors: { primary: theme.colors.surface } }}
    >
      {previous && (
        <Appbar.BackAction
          onPress={navigation.goBack}
          color={theme.colors.onSurface}
        />
      )}

      {!previous && activeAccount && (
        <TouchableOpacity
          style={{ marginLeft: 10 }}
          onPress={() => {
            navigation.openDrawer();
          }}
        >
          <UserAvatar account={activeAccount} />
        </TouchableOpacity>
      )}

      <Appbar.Content
        title={title}
        titleStyle={{
          fontSize: 18,
          color: theme.colors.onSurface,
        }}
      />

      {options.headerRight || (
        <Menu
          visible={menuVisible}
          onDismiss={toggleMenu}
          anchor={
            <Appbar.Action icon="dots-vertical" onPress={toggleMenu} color={theme.colors.onSurface} />
          }
        >
          <Menu.Item onPress={() => { }} title="Help" icon="help-circle-outline" />
          <Menu.Item onPress={handleLogout} title="Log out" icon="logout-variant" />
        </Menu>
      )}
    </Appbar.Header>
  );
}

export default Header;

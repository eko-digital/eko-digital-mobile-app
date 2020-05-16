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

  const { account } = React.useContext(AccountContext);

  const toggleMenu = useCallback(() => {
    setMenuVisible((v) => !v);
  }, []);

  const handleLogout = useCallback(() => {
    auth().signOut();
  }, []);

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
          color={theme.colors.primary}
        />
      )}

      {!previous && account && (
        <TouchableOpacity
          style={{ marginLeft: 10 }}
          onPress={() => {
            navigation.openDrawer();
          }}
        >
          <UserAvatar account={account} />
        </TouchableOpacity>
      )}

      <Appbar.Content
        title={title}
        titleStyle={{
          fontSize: 18,
          fontWeight: 'bold',
          color: theme.colors.primary,
        }}
      />

      <Menu
        visible={menuVisible}
        onDismiss={toggleMenu}
        anchor={
          <Appbar.Action icon="dots-vertical" onPress={toggleMenu} />
        }
      >
        <Menu.Item onPress={handleLogout} title="Log out" />
      </Menu>
    </Appbar.Header>
  );
}

export default Header;
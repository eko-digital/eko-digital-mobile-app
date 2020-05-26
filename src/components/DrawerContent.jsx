// @flow
import {
  DrawerContentComponentProps,
  DrawerNavigationProp,
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';
import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Caption,
  Drawer,
  Paragraph,
  useTheme,
  TouchableRipple,
  Text,
  Switch,
} from 'react-native-paper';
import Animated from 'react-native-reanimated';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import PreferencesContext from '../contexts/PreferencesContext';
import AccountContext from '../contexts/AccountContext';
import UserAvatar from './UserAvatar';
import SchoolName from './SchoolName';
import { asTeacher, asStudent } from '../utils';
import config from '../config';

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  account: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: config.values.space.normal,
  },
  avatar: {
    marginRight: 10,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  name: {
    flexShrink: 1,
    fontWeight: 'bold',
    marginRight: 3,
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: config.values.space.normal,
  },
});

type Props = DrawerContentComponentProps<DrawerNavigationProp>;

function DrawerContent(props: Props) {
  const paperTheme = useTheme();
  const { activeAccount, switchAccount } = React.useContext(AccountContext);
  const { theme, toggleTheme } = React.useContext(PreferencesContext);

  const { progress, navigation } = props;

  const openProfile = useCallback(() => {
    navigation.navigate('Profile');
  }, [navigation]);

  const openFavourites = useCallback(() => {
    navigation.navigate('Favourites');
  }, [navigation]);

  const openSettings = useCallback(() => {
    navigation.navigate('Settings');
  }, [navigation]);

  const openSchool = useCallback(() => {
    navigation.navigate('School');
  }, [navigation]);

  const translateX = Animated.interpolate(progress, {
    inputRange: [0, 0.5, 0.7, 0.8, 1],
    outputRange: [-100, -85, -70, -45, 0],
  });

  if (!activeAccount) {
    return null;
  }

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <DrawerContentScrollView {...props}>
      <Animated.View
        style={[
          styles.drawerContent,
          {
            backgroundColor: paperTheme.colors.surface,
            transform: [{ translateX }],
          },
        ]}
      >
        <Drawer.Section>
          <TouchableRipple
            onPress={() => {
              switchAccount();
            }}
          >
            <View style={styles.account}>
              <UserAvatar
                photoURL={activeAccount.photoURL}
                name={activeAccount.name}
                style={styles.avatar}
              />
              <View style={{ flexShrink: 1 }}>
                <View style={styles.nameRow}>
                  <Paragraph
                    style={styles.name}
                    numberOfLines={1}
                    ellipsizeMode="middle"
                  >
                    {activeAccount.name}
                  </Paragraph>
                  <MaterialCommunityIcons
                    name="chevron-down"
                    size={20}
                    color={paperTheme.colors.text}
                  />
                </View>
                <Caption style={styles.caption}>
                  {asTeacher(activeAccount) ? 'Teacher' : 'Student'}
                  {', '}
                  <SchoolName account={activeAccount} />
                </Caption>
              </View>
            </View>
          </TouchableRipple>
        </Drawer.Section>
        <Drawer.Section>
          <DrawerItem
            icon={({ color, size }) => (
              <MaterialCommunityIcons
                name="account-outline"
                color={color}
                size={size}
              />
            )}
            label="Profile"
            onPress={openProfile}
          />
          {asStudent(activeAccount) && (
            <DrawerItem
              icon={({ color, size }) => (
                <MaterialCommunityIcons
                  name="heart-outline"
                  color={color}
                  size={size}
                />
              )}
              label="Favourites"
              onPress={openFavourites}
            />
          )}
          <DrawerItem
            icon={({ color, size }) => (
              <MaterialCommunityIcons name="tune" color={color} size={size} />
            )}
            label="Settings"
            onPress={openSettings}
          />
          <DrawerItem
            icon={({ color, size }) => (
              <MaterialCommunityIcons
                name="bank-outline"
                color={color}
                size={size}
              />
            )}
            label="School"
            onPress={openSchool}
          />
        </Drawer.Section>
        <Drawer.Section title="Preferences">
          <TouchableRipple onPress={toggleTheme}>
            <View style={styles.preference}>
              <Text>Dark Theme</Text>
              <View pointerEvents="none">
                <Switch value={theme === 'dark'} />
              </View>
            </View>
          </TouchableRipple>
        </Drawer.Section>
      </Animated.View>
    </DrawerContentScrollView>
  );
}

export default DrawerContent;

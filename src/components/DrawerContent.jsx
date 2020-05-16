// @flow
import {
  DrawerContentComponentProps,
  DrawerNavigationProp,
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';
import React from 'react';
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

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  account: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
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
    paddingHorizontal: 16,
  },
});

type Props = DrawerContentComponentProps<DrawerNavigationProp>;

function DrawerContent(props: Props) {
  const paperTheme = useTheme();
  const { account, switchAccount } = React.useContext(AccountContext);
  const { theme, toggleTheme } = React.useContext(PreferencesContext);

  const { progress } = props;

  const translateX = Animated.interpolate(progress, {
    inputRange: [0, 0.5, 0.7, 0.8, 1],
    outputRange: [-100, -85, -70, -45, 0],
  });

  if (!account) {
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
              <UserAvatar account={account} style={styles.avatar} />
              <View style={{ flexShrink: 1 }}>
                <View style={styles.nameRow}>
                  <Paragraph
                    style={styles.name}
                    numberOfLines={1}
                    ellipsizeMode="middle"
                  >
                    {account.name}
                  </Paragraph>
                  <MaterialCommunityIcons
                    name="chevron-down"
                    size={20}
                    color={paperTheme.colors.text}
                  />
                </View>
                <Caption style={styles.caption}>
                  {account.schoolName}
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
            onPress={() => { }}
          />
          <DrawerItem
            icon={({ color, size }) => (
              <MaterialCommunityIcons
                name="heart-outline"
                color={color}
                size={size}
              />
            )}
            label="Favourites"
            onPress={() => { }}
          />
          <DrawerItem
            icon={({ color, size }) => (
              <MaterialCommunityIcons name="tune" color={color} size={size} />
            )}
            label="Settings"
            onPress={() => { }}
          />
          <DrawerItem
            icon={({ color, size }) => (
              <MaterialCommunityIcons
                name="bank"
                color={color}
                size={size}
              />
            )}
            label="School"
            onPress={() => { }}
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

// @flow
import React, { useCallback, useMemo, useState } from 'react';
import {
  Card, Switch, List,
} from 'react-native-paper';
import {
  ScrollView, StyleSheet, View,
} from 'react-native';
import auth from '@react-native-firebase/auth';

import type { ColorScheme } from '../types';
import config from '../config';
import PreferencesContext from '../contexts/PreferencesContext';
import ThemePicker from '../components/ThemePicker';

const styles = StyleSheet.create({
  container: {
    padding: config.values.space.normal,
  },
  card: {
    marginBottom: config.values.space.large,
  },
  switchWrapper: {
    justifyContent: 'center',
  },
});

function Settings() {
  const [themePickerVisible, setThemePickerVisible] = useState<boolean>(false);

  const {
    theme,
    notificationEnabled,
    saveTheme,
    toggleNotifications,
  } = React.useContext(PreferencesContext);

  const themeName = useMemo(() => {
    switch (theme) {
      case 'light':
        return 'Light';

      case 'dark':
        return 'Dark';

      case 'system-default':
        return 'System default';

      default:
        return 'Light';
    }
  }, [theme]);

  const toggleThemePicker = useCallback(() => setThemePickerVisible((visible) => !visible), []);

  const handleThemeSelect = useCallback((newTheme: ColorScheme) => {
    saveTheme(newTheme);
    setThemePickerVisible(false);
  }, [saveTheme]);

  const logout = useCallback(() => {
    auth().signOut();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <List.Item
          title="Notifications"
          description="Turn on notifications to get alerts for content updates on your phone."
          descriptionNumberOfLines={10}
          // eslint-disable-next-line react/jsx-props-no-spreading
          left={(props) => <List.Icon {...props} icon="bell-outline" />}
          right={() => (
            <View pointerEvents="none" style={styles.switchWrapper}>
              <Switch value={notificationEnabled} />
            </View>
          )}
          onPress={toggleNotifications}
        />
        <List.Item
          title="Theme"
          description={themeName}
          // eslint-disable-next-line react/jsx-props-no-spreading
          left={(props) => <List.Icon {...props} icon="brightness-6" />}
          onPress={toggleThemePicker}
        />
        <ThemePicker
          visible={themePickerVisible}
          theme={theme}
          onSelect={handleThemeSelect}
          onDismiss={toggleThemePicker}
        />
      </Card>
      <Card>
        <List.Item
          title="Logout"
          // eslint-disable-next-line react/jsx-props-no-spreading
          left={(props) => <List.Icon {...props} icon="power" />}
          onPress={logout}
        />
      </Card>
    </ScrollView>
  );
}

export default Settings;

// @flow
import React, { useState, useCallback } from 'react';
import {
  Portal, Dialog, Button, RadioButton,
} from 'react-native-paper';

import type { ColorScheme } from '../types';

type Props = {
  visible: boolean,
  theme: ColorScheme,
  onDismiss: () => void,
  onSelect: (theme: ColorScheme) => any,
}

function ThemePicker({
  visible, theme, onDismiss, onSelect,
}: Props) {
  const [newTheme, setNewTheme] = useState<ColorScheme>(theme);

  const handleOK = useCallback(() => {
    onSelect(newTheme);
  }, [newTheme, onSelect]);

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Title>Choose theme</Dialog.Title>
        <Dialog.Content>
          <RadioButton.Group onValueChange={setNewTheme} value={newTheme}>
            <RadioButton.Item label="System default" value="system-default" />
            <RadioButton.Item label="Light" value="light" />
            <RadioButton.Item label="Dark" value="dark" />
          </RadioButton.Group>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss}>Cancel</Button>
          <Button onPress={handleOK}>OK</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

export default ThemePicker;

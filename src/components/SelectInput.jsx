// @flow
import React, { useState, useCallback } from 'react';
import {
  Menu,
  Button,
  useTheme,
} from 'react-native-paper';
import { StyleSheet } from 'react-native';
import config from '../config';

const styles = StyleSheet.create({
  toggleButton: {
    padding: config.values.space.small,
  },
});

type Props = {
  label: string,
  selection: string | null,
  options: Array<{ label: string, value: string }>,
  onSelect: (value: string) => void,
}

function SelectInput({
  label,
  selection,
  options,
  onSelect,
}: Props) {
  const [visible, setVisible] = useState(false);

  const theme = useTheme();

  const toggleMenu = useCallback(() => {
    setVisible((v) => !v);
  }, []);

  const currentOption = options.find(({ value }) => selection === value);

  return (
    <Menu
      visible={visible}
      onDismiss={toggleMenu}
      anchor={(
        <Button
          mode="outlined"
          onPress={toggleMenu}
          uppercase={false}
          labelStyle={styles.toggleButton}
          icon="chevron-down"
          color={currentOption ? theme.colors.onSurface : theme.colors.placeholder}
        >
          {currentOption ? currentOption.label : label}
        </Button>
      )}
    >
      {options.map((option) => (
        <Menu.Item
          key={option.value}
          onPress={() => {
            onSelect(option.value);
            toggleMenu();
          }}
          title={option.label}
        />
      ))}
    </Menu>
  );
}

export default SelectInput;

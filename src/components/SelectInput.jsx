// @flow
import React, { useState, useCallback } from 'react';
import {
  Menu,
  TextInput,
  TouchableRipple,
  Text,
} from 'react-native-paper';
import { StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const styles = StyleSheet.create({
  selectText: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  icon: {
    paddingHorizontal: 14,
  },
});

type Props = {
  label: string,
  selection: string | null,
  options: Array<{ label: string, value: any }>,
  style?: any,
  onSelect: (value: string) => void,
}

function SelectInput({
  label,
  selection,
  options,
  style = null,
  onSelect,
}: Props) {
  const [visible, setVisible] = useState(false);

  const toggleMenu = useCallback(() => {
    setVisible((v) => !v);
  }, []);

  const currentOption = options.find(({ value }) => selection === value);

  const renderInputText = useCallback((props: { style: any, value: string }) => (
    <TouchableRipple onPress={toggleMenu} style={styles.selectText}>
      <>
        <Text style={props.style}>{props.value}</Text>
        <MaterialCommunityIcons
          size={22}
          name="chevron-down"
          style={styles.icon}
        />
      </>
    </TouchableRipple>
  ), [toggleMenu]);

  return (
    <Menu
      visible={visible}
      onDismiss={toggleMenu}
      anchor={(
        <TextInput
          label={label}
          mode="outlined"
          style={style}
          value={currentOption?.label || ''}
          render={renderInputText}
        />
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

// @flow
import * as React from 'react';
import { TabView, TabBar } from 'react-native-tab-view';
import { Dimensions } from 'react-native';
import { useTheme, Paragraph } from 'react-native-paper';
import color from 'color';

import overlay from '../overlay';

const initialLayout = { width: Dimensions.get('window').width };

type Props = {|
  routes: Array<{
    key: string;
    title: string;
  }>,
  scrollEnabled?: boolean,
  renderScene: ({ route: any, jumpTo: any, position: any }) => React.Element<any> | null,
  onIndexChange?: (index: number) => any,
|}

function Tabs({
  routes,
  scrollEnabled = false,
  renderScene,
  onIndexChange,
}: Props) {
  const [index, setIndex] = React.useState<number>(0);

  const theme = useTheme();

  const handleIndexChange = React.useCallback((newIndex) => {
    setIndex(newIndex);
    if (onIndexChange) {
      onIndexChange(newIndex);
    }
  }, [onIndexChange]);

  const tabBarColor = theme.dark
    ? (overlay(4, theme.colors.surface))
    : theme.colors.surface;

  const rippleColor = theme.dark
    ? color(tabBarColor).lighten(0.5)
    : color(tabBarColor).darken(0.2);

  const renderTabBar = (props) => (
    <TabBar
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
      indicatorStyle={{ backgroundColor: theme.colors.primary }}
      style={{
        backgroundColor: tabBarColor,
        shadowColor: theme.colors.text,
      }}
      renderLabel={({ route, focused }) => (
        <Paragraph
          style={{
            color: focused ? theme.colors.primary : theme.colors.placeholder,
            ...theme.fonts.medium,
            textTransform: 'uppercase',
          }}
        >
          {route.title}
        </Paragraph>
      )}
      pressColor={rippleColor}
      scrollEnabled={scrollEnabled}
    />
  );

  return (
    <TabView
      lazy
      navigationState={{ index, routes }}
      renderScene={renderScene}
      renderTabBar={renderTabBar}
      onIndexChange={handleIndexChange}
      initialLayout={initialLayout}
      removeClippedSubviews
    />
  );
}

export default Tabs;

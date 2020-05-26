// @flow
import React from 'react';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { Dimensions } from 'react-native';
import { useTheme, Paragraph } from 'react-native-paper';
import color from 'color';

import FavouritesList from './FavouritesList';
import overlay from '../overlay';

const FavouriteLessons = () => (
  <FavouritesList collection="lessons" />
);

const FavouriteAssignments = () => (
  <FavouritesList collection="assignments" />
);

const initialLayout = { width: Dimensions.get('window').width };

function Favourites() {
  const [index, setIndex] = React.useState(0);

  const theme = useTheme();

  const [routes] = React.useState([
    { key: 'lessons', title: 'Lessons' },
    { key: 'assignments', title: 'Assignments' },
  ]);

  const renderScene = SceneMap({
    lessons: FavouriteLessons,
    assignments: FavouriteAssignments,
  });

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
    />
  );

  return (
    <TabView
      lazy
      navigationState={{ index, routes }}
      renderScene={renderScene}
      renderTabBar={renderTabBar}
      onIndexChange={setIndex}
      initialLayout={initialLayout}
    />
  );
}

export default Favourites;

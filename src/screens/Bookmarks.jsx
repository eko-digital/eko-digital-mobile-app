// @flow
import React from 'react';
import { SceneMap } from 'react-native-tab-view';

import BookmarksList from '../components/BookmarksList';
import Tabs from '../components/Tabs';

const BookmarkedLessons = () => <BookmarksList itemType="lesson" />;
const BookmarkedAssignments = () => <BookmarksList itemType="assignment" />;

function Bookmarks() {
  const routes = React.useMemo(() => [
    { key: 'lessons', title: 'Lessons' },
    { key: 'assignments', title: 'Assignments' },
  ], []);

  const renderScene = SceneMap({
    lessons: BookmarkedLessons,
    assignments: BookmarkedAssignments,
  });

  return (
    <Tabs
      routes={routes}
      renderScene={renderScene}
    />
  );
}

export default Bookmarks;

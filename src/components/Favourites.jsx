// @flow
import React from 'react';

import EmptyScreen from './EmptyScreen';
import waiting from '../images/waiting.png';

function Favourites() {
  return (
    <EmptyScreen
      illustration={waiting}
      title="No favourites, yet!"
      description="You can add lessons/assignments to favourites from more menu ( ⋮ ) of a lessons/assignments card."
    />
  );
}

export default Favourites;

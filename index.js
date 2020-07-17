/**
 * @format
 */

import { AppRegistry } from 'react-native';
import TrackPlayer from 'react-native-track-player';

import App from './src/App';
import { name as appName } from './app.json';
import audioPlayerService from './src/audioPlayerService';

AppRegistry.registerComponent(appName, () => App);

TrackPlayer.registerPlaybackService(() => audioPlayerService);

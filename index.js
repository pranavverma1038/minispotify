/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';
import {AudioPro} from 'react-native-audio-pro';
import { playbackService } from './musicPlayerServices';





AppRegistry.registerComponent(appName, () => App);




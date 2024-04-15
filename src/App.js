/**
 *
 * Main app
 *
 * App Name:          Eskizi
 * Author:            Rnlab.io
 *
 * @since             1.0.0
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {NavigationContainer} from '@react-navigation/native';

import './config-i18n';

import {Provider} from 'react-redux';

import {SafeAreaProvider} from 'react-native-safe-area-context';
import AppRouter from './AppRouter';

import NavigationService from 'src/utils/navigation';

import configureStore from './config-store';
import {getDemoSelector} from './modules/common/selectors';
import {tokenSelector} from './modules/auth/selectors';
import demoConfig from './utils/demo';
import globalConfig from './utils/global';

const {store} = configureStore();

type Props = {};

class App extends Component<Props> {
  componentDidMount() {
    store.subscribe(() => {
      const state = store.getState();
      demoConfig.setData(getDemoSelector(state).toJS());
      globalConfig.setToken(tokenSelector(state));
    });
  }

  render() {
    return (
      <NavigationContainer
        ref={(navigationRef) =>
          NavigationService.setTopLevelNavigator(navigationRef)
        }>
        <SafeAreaProvider>
          <Provider store={store}>
            <AppRouter />
          </Provider>
        </SafeAreaProvider>
      </NavigationContainer>
    );
  }
}

export default App;

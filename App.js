import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createStore, combineReducers, applyMiddleware } from 'redux'
import AppLoading from 'expo-app-loading'
import { Provider } from 'react-redux';
import * as Font from 'expo-font'
import ReduxThunk from 'redux-thunk'
import MainNavigator from './navigation/MainNavigator';

import authReducer from './store/reducers/auth'

const rootReducer = combineReducers({
  // insert reducers here
  auth: authReducer
})

const store = createStore(rootReducer, applyMiddleware(ReduxThunk))

const fetchFonts = () => {
  // https://fonts.google.com/specimen/Roboto
  return Font.loadAsync({
    'roboto-black': require('./assets/fonts/Roboto-Black.ttf'),
    'roboto-black-italic': require('./assets/fonts/Roboto-BlackItalic.ttf'),
    'roboto-bold': require('./assets/fonts/Roboto-Bold.ttf'),
    'roboto-bold-italic': require('./assets/fonts/Roboto-BoldItalic.ttf'),
    'roboto-italic': require('./assets/fonts/Roboto-Italic.ttf'),
    'roboto-light': require('./assets/fonts/Roboto-Light.ttf'),
    'roboto-light-italic': require('./assets/fonts/Roboto-LightItalic.ttf'),
    'roboto-medium': require('./assets/fonts/Roboto-Medium.ttf'),
    'roboto-medium-italic': require('./assets/fonts/Roboto-MediumItalic.ttf'),
    'roboto-regular': require('./assets/fonts/Roboto-Regular.ttf'),
    'roboto-thin': require('./assets/fonts/Roboto-Thin.ttf'),
    'roboto-thin-italic': require('./assets/fonts/Roboto-ThinItalic.ttf'),
  })
}

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false)

  if(!fontLoaded){
    return <AppLoading 
      startAsync={fetchFonts} 
      onFinish={() => setFontLoaded(true)} 
      onError={(err) => console.log(err)}
    />
  }

  return (
    <Provider store={store}>
      <MainNavigator />
    </Provider>
  );
}
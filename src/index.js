import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import rootReducer from './features/index'

const store = configureStore({ reducer: rootReducer })
const Main = () => {

  // Use matchMedia to check the user preference
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  const [dark, setDark] = useState(prefersDark.matches);

  const toggleDarkTheme = (shouldAdd) => {
    document.body.classList.toggle('dark', shouldAdd);
  }

  toggleDarkTheme(dark);

  // Listen for changes to the prefers-color-scheme media query
  prefersDark.addListener((mediaQuery) => setDark(mediaQuery.matches));

  // Add or remove the "dark" class based on if the media query matches

  return (
    <Provider store={store}>
      <App />
    </Provider>
  )
}

ReactDOM.render(<Main />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

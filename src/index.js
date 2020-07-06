import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import rootReducer from './features/index'
import { IonApp } from "@ionic/react"

const DEV_MODE = true
const store = configureStore({
    reducer: rootReducer,
    devTools: DEV_MODE,
})

const Main = () => {
    return (
        <Provider store={store}>
            <IonApp>
                <App />
            </IonApp>
        </Provider>
    )
}

ReactDOM.render(<Main />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

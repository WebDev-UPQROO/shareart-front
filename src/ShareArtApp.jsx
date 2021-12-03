import React from 'react';
import { Provider } from 'react-redux';
import store from './store/store';
import AppRouter from './routes/AppRouter';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



export const ShareArtApp = () => {
    return (
        <Provider store={store}>
            <AppRouter />
            <ToastContainer theme="dark" hideProgressBar position="bottom-left"/>
        </Provider>
    )
}
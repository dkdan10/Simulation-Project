import React from 'react'
import ReactDom from 'react-dom'
import App from './components/app'
import configureStore from './store/store';

document.addEventListener('DOMContentLoaded', () => {
    const root = document.getElementById('root');
    const store = configureStore();
    
    ReactDom.render(<App store={store} />, root);
})
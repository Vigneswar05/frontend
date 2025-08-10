import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { register } from './serviceWorkerRegistration';
import { subscribeUserToPush } from './pushNotifications';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

register();
subscribeUserToPush();

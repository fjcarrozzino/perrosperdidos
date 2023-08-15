import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';
import store from './redux/store';
import { Provider } from 'react-redux';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <Provider store={store}>
      <GoogleOAuthProvider clientId="683936997652-hihlofc618o9eqpdoich7cmqcg0d2vl9.apps.googleusercontent.com">
        <App />
      </GoogleOAuthProvider>
    </Provider>
  //</React.StrictMode>
);


import 'rxjs';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import createStore from 'redux/store/createStore';
import App from './App';
import './index.css';

let store = createStore();

const component = (
  <Provider store={store}>
    <App />
  </Provider>
)

ReactDOM.render(
  component,
  document.getElementById('root')
);

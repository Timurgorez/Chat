import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, compose, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';

// import thunk from 'redux-thunk';

import rootReducer from './store/rootReducer';

import './index.css';
import App from './App';


const store = createStore(rootReducer, compose(
  applyMiddleware(
    // thunk,
    //runAPImiddleware
  ),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
));

ReactDOM.render(
  //<React.StrictMode>
    <Provider store={store}>
      <Toaster
        position="top-right"
        // reverseOrder={false}
        toastOptions={{
          style: {
            paddingLeft: '15px',
            zIndex: 1,
          },
          iconClose: {
            primary: 'grey',
          },
          duration: 3000,
        }}
      />
      <App />
    </Provider>,
  // </React.StrictMode>,
  document.getElementById('root')
);


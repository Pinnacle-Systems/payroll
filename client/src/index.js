import React from 'react';
import ReactDOM from 'react-dom/client';
import Routing from './Route';
import "./index.css";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import store from './redux/store';
import { Provider } from 'react-redux';
import { Font } from '@react-pdf/renderer'
import { Toaster } from 'react-hot-toast';

import '@syncfusion/ej2-base/styles/material.css';
import '@syncfusion/ej2-buttons/styles/material.css';
import '@syncfusion/ej2-inputs/styles/material.css';
import '@syncfusion/ej2-popups/styles/material.css';
import '@syncfusion/ej2-react-grids/styles/material.css';



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
    <Provider store={store}>
      <Routing />
    </Provider>

    <ToastContainer
      position="top-right"
      autoClose={100}
      hideProgressBar
      newestOnTop={false}
      closeOnClick={false}
    />
  </>
);

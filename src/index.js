
import React from 'react';
import { createRoot } from 'react-dom/client'; // Thêm import cho createRoot
import { BrowserRouter } from "react-router-dom";
import store from './redux/store';
import { Provider } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/styles.scss';
import App from './App';


const renderApp = () => {
  createRoot(document.getElementById('root')).render( // Thay thế ReactDOM.render bằng createRoot
    <Provider store={store}>
      <React.StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </React.StrictMode>
    </Provider>
  );
};

renderApp();


// import React from 'react';
// import ReactDOM from 'react-dom';
// import { BrowserRouter } from "react-router-dom";
// import store from './redux/store';
// import { Provider } from 'react-redux';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import './styles/styles.scss';
// import App from './App';


// const renderApp = () => {
//   ReactDOM.render(
//     <Provider store={store}>
//       <React.StrictMode>
//         <BrowserRouter>
//           <App />
//         </BrowserRouter>
//       </React.StrictMode>
//     </Provider>
//     ,
//     document.getElementById('root')
//   );
// };

// renderApp();
// // // If you want your app to work offline and load faster, you can change
// // // unregister() to register() below. Note this comes with some pitfalls.
// // // Learn more about service workers: https://bit.ly/CRA-PWA
// // serviceWorker.unregister();


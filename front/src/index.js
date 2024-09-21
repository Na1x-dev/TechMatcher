import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login.js'
import Home from './pages/Home.js'
import NotFound from './pages/NotFound'
import { AuthProvider } from './components/AuthContext.jsx';
import { Provider } from 'react-redux';
import store from './redux/store.js';
import { SnackbarProvider } from 'notistack';
import './style/notistack.css'


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <SnackbarProvider anchorOrigin={{
          vertical: 'bottom', 
          horizontal: 'right', 
        }} maxSnack={3}>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route exact path="/" element={<Home />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </SnackbarProvider>
      </AuthProvider>
    </Provider>
  </React.StrictMode>
);

reportWebVitals();

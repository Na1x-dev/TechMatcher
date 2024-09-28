import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login.js'
import Home from './pages/Home.js'
import NotFoundPage from './pages/NotFound.js'
import { AuthProvider } from './components/AuthContext.jsx';
import { Provider } from 'react-redux';
import store from './redux/store.js';
import { SnackbarProvider } from 'notistack';
import './style/notistack.css'
import Product from './pages/Product.js';
import Basket from './pages/Basket.js';
import Profile from './pages/Profile.js';
import ProtectedRoute from './ProtectedRoute.js';



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
              <Route path="*" element={<NotFoundPage />} />
              <Route path="/product/:id" element={<Product />} />
              <Route path="/profile" element={<ProtectedRoute element={<Profile />}/>} />
              <Route path="/basket" element={<ProtectedRoute element={<Basket />}/> } />
            </Routes>
          </Router>
        </SnackbarProvider>
      </AuthProvider>
    </Provider>
  </React.StrictMode>
);

reportWebVitals();

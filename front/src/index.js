import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login.js'
import Register from './pages/Register.js'
import Home from './pages/Home.js'
import NotFound from './pages/NotFound'
import { AuthProvider } from './components/AuthContext.jsx';
import { Provider } from 'react-redux';
import store from './redux/store.js';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route exact path="/" element={<Home />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AuthProvider>
    </Provider>
  </React.StrictMode>
);

reportWebVitals();

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './app/App.jsx';
import { CartProvider } from './contexts/CartContext.jsx';
import { AccountProvider } from './contexts/AccountContext.jsx';
import './styles/index.css';
createRoot(document.getElementById('root')).render(<CartProvider><AccountProvider><App /></AccountProvider></CartProvider>);

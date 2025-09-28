import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ArmyProvider } from './context/ArmyContext'; // Import our new provider

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ArmyProvider>
      <App />
    </ArmyProvider>
  </React.StrictMode>
);
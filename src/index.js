import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ArmyProvider } from './context/ArmyContext';
import { GameDataProvider } from './context/GameDataContext'; // Import the new provider

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* Wrap ArmyProvider with GameDataProvider to make game data globally available */}
    <GameDataProvider>
      <ArmyProvider>
        <App />
      </ArmyProvider>
    </GameDataProvider>
  </React.StrictMode>
);
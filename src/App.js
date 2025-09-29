import React from 'react';
import './App.css';
import UnitList from './components/UnitList';
import ArmyDisplay from './components/ArmyDisplay';
import WargearModal from './components/WargearModal';
import EnhancementsModal from './components/EnhancementsModal';
import ArmyConfiguration from './components/ArmyConfiguration';
import { useGameData } from './context/GameDataContext';

function App() {
  const { loading, error } = useGameData();

  if (loading) {
    return <div className="container"><h1>Loading game data...</h1></div>;
  }
  if (error) {
    return <div className="container"><h1>Error</h1><p>{error}</p></div>;
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Warhammer 40,000 Army Builder</h1>
        {/* --- MOVED: ArmyConfiguration is now in the header --- */}
        <ArmyConfiguration />
      </header>
      <main className="container">
        <div className="roster-selection-panel">
          <h2>Select Units</h2>
          <UnitList />
        </div>
        <div className="army-list-panel">
          <h2>My Army</h2>
          {/* ArmyConfiguration is no longer here */}
          <ArmyDisplay />
        </div>
      </main>

      <WargearModal />
      <EnhancementsModal />
    </div>
  );
}

export default App;
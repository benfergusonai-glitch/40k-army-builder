import React from 'react';
import './App.css';
import UnitList from './components/UnitList';
import ArmyDisplay from './components/ArmyDisplay';
import WargearModal from './components/WargearModal';
import EnhancementsModal from './components/EnhancementsModal';
import ArmyConfiguration from './components/ArmyConfiguration';
import { useGameData } from './context/GameDataContext'; // Import the new hook

function App() {
  // Consume the global game data context
  const { loading, error } = useGameData();

  // Display loading or error states based on the context's status
  if (loading) {
    return <div className="container"><h1>Loading game data...</h1></div>;
  }
  if (error) {
    return <div className="container"><h1>Error</h1><p>{error}</p></div>;
  }

  // Once data is loaded, render the main application layout.
  // Notice no props are being passed down to the components below.
  return (
    <div className="App">
      <header className="App-header">
        <h1>Warhammer 40,000 Army Builder</h1>
      </header>
      <main className="container">
        <div className="roster-selection-panel">
          <h2>Select Units</h2>
          <UnitList />
        </div>
        <div className="army-list-panel">
          <h2>My Army</h2>
          <ArmyConfiguration />
          <ArmyDisplay />
        </div>
      </main>

      {/* Modals are self-sufficient and get their data from context */}
      <WargearModal />
      <EnhancementsModal />
    </div>
  );
}

export default App;
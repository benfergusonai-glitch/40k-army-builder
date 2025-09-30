/*
 * App.js (Syntactician_App_v1.1)
 * CRASH FIX: Implements external rendering guards for modal components to prevent runtime crashes.
 * Principle: Context Guard and Defensive Rendering.
 */
import React from 'react';
import './App.css';
import UnitList from './components/UnitList';
import ArmyDisplay from './components/ArmyDisplay';
import WargearModal from './components/WargearModal';
import EnhancementsModal from './components/EnhancementsModal';
import ArmyConfiguration from './components/ArmyConfiguration';
import { useGameData } from './context/GameDataContext';
import { useArmy } from './context/ArmyContext';
// --- NEW: Import the ArmyConstraints component ---
import ArmyConstraints from './components/ArmyConstraints';


function App() {
  const { loading, error } = useGameData();
  const { editingWargearUnit, editingEnhancementUnit } = useArmy(); 

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
        <ArmyConfiguration />
        {/* --- NEW: Add the ArmyConstraints component to the UI --- */}
        <ArmyConstraints />
      </header>
      <main className="container">
        <div className="roster-selection-panel">
          <h2>Select Units</h2>
          <UnitList />
        </div>
        <div className="army-list-panel">
          <h2>My Army</h2>
          <ArmyDisplay />
        </div>
      </main>

      {/* FIX: ONLY RENDER MODALS IF THEIR REQUIRED UNIT CONTEXT IS PRESENT. */}
      {editingWargearUnit && <WargearModal />}
      {editingEnhancementUnit && <EnhancementsModal />}
    </div>
  );
}

export default App;
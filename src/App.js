import React, { useState, useEffect } from 'react';
import './App.css';
import UnitList from './components/UnitList';
import ArmyDisplay from './components/ArmyDisplay';
import WargearModal from './components/WargearModal';
import EnhancementsModal from './components/EnhancementsModal';

function App() {
  const [allUnits, setAllUnits] = useState([]);
  const [allEnhancements, setAllEnhancements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for Wargear Modal
  const [editingWargearUnit, setEditingWargearUnit] = useState(null);
  // State for Enhancements Modal
  const [editingEnhancementUnit, setEditingEnhancementUnit] = useState(null);

  useEffect(() => {
    // This is the restored data-fetching logic
    const fetchAllData = async () => {
      try {
        const [unitData, enhancementData] = await Promise.all([
          fetch('/data/units/manifest.json')
            .then(res => res.json())
            .then(manifest => Promise.all(
              manifest.map(file => fetch(`/data/units/${file}`).then(res => res.json()))
            ))
            .then(allUnitArrays => allUnitArrays.flat()),
          
          fetch('/data/enhancements.json').then(res => res.json())
        ]);

        unitData.sort((a, b) => a.name.localeCompare(b.name));

        setAllUnits(unitData);
        setAllEnhancements(enhancementData);

      } catch (e) {
        setError(`Failed to load game data: ${e.message}`);
        console.error("Fetch error:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // --- Wargear Modal Handlers ---
  const handleOpenWargearModal = (unit) => {
    setEditingWargearUnit(unit);
  };
  const handleCloseWargearModal = () => {
    setEditingWargearUnit(null);
  };

  // --- Enhancements Modal Handlers ---
  const handleOpenEnhancementsModal = (unit) => {
    setEditingEnhancementUnit(unit);
  };
  const handleCloseEnhancementsModal = () => {
    setEditingEnhancementUnit(null);
  };

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
      </header>
      <main className="container">
        <div className="roster-selection-panel">
          <h2>Select Units</h2>
          <UnitList units={allUnits} />
        </div>
        <div className="army-list-panel">
          <h2>My Army</h2>
          <ArmyDisplay
            onOpenWargearModal={handleOpenWargearModal}
            onOpenEnhancementsModal={handleOpenEnhancementsModal}
            allEnhancements={allEnhancements}
          />
        </div>
      </main>

      <WargearModal
        show={!!editingWargearUnit}
        unit={editingWargearUnit}
        onClose={handleCloseWargearModal}
      />
      
      <EnhancementsModal
        show={!!editingEnhancementUnit}
        unit={editingEnhancementUnit}
        enhancements={allEnhancements}
        onClose={handleCloseEnhancementsModal}
      />
    </div>
  );
}

export default App;
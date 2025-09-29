import React from 'react';
import { useArmy } from '../context/ArmyContext';
import { useGameData } from '../context/GameDataContext'; // Import the new hook
import UnitCard from './UnitCard';

// Remove props from the function signature
function ArmyDisplay() {
  const { army, totalPoints, removeUnit, selectedChapter, selectedDetachment } = useArmy();
  // Get static game data directly from the context
  const { allWeapons: weapons } = useGameData();

  return (
    <div className="army-display">
      <div className="army-details">
        {selectedChapter && <p><strong>Chapter:</strong> {selectedChapter.name}</p>}
        {selectedDetachment && <p><strong>Detachment:</strong> {selectedDetachment.name}</p>}
        <h3>Total Points: {totalPoints}</h3>
      </div>
      
      {army.length === 0 ? (
        <p>Your army is empty. Select units from the left panel to begin.</p>
      ) : (
        army.map((unit) => (
          <UnitCard
            key={unit.id}
            unit={unit}
            onRemoveUnit={removeUnit}
            weapons={weapons}
          />
        ))
      )}
    </div>
  );
}

export default ArmyDisplay;
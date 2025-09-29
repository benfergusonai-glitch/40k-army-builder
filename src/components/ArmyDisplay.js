import React from 'react';
import { useArmy } from '../context/ArmyContext';
import UnitCard from './UnitCard';

function ArmyDisplay({ weapons }) {
  const { army, totalPoints, removeUnit, selectedChapter, selectedDetachment } = useArmy();

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
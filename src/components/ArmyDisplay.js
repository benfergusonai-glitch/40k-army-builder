import React from 'react';
import { useArmy } from '../context/ArmyContext';
import UnitCard from './UnitCard';

function ArmyDisplay({ onOpenWargearModal, onOpenEnhancementsModal, allEnhancements }) {
  const { army, totalPoints, removeUnit } = useArmy();

  return (
    <div className="army-display">
      <h3>Total Points: {totalPoints}</h3>
      {army.length === 0 ? (
        <p>Your army is empty. Select units from the left panel to begin.</p>
      ) : (
        army.map((unit) => (
          <UnitCard
            key={unit.id}
            unit={unit}
            onRemoveUnit={removeUnit}
            onOpenWargearModal={onOpenWargearModal}
            onOpenEnhancementsModal={onOpenEnhancementsModal}
          />
        ))
      )}
    </div>
  );
}

export default ArmyDisplay;
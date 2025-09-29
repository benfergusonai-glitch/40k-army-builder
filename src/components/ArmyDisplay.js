import React, { useMemo } from 'react';
import { useArmy } from '../context/ArmyContext';
import { useGameData } from '../context/GameDataContext';
import UnitCard from './UnitCard';

function ArmyDisplay() {
  const { army, totalPoints, removeUnit, selectedChapter, selectedDetachment, isUnitValid } = useArmy();
  const { allWeapons: weapons } = useGameData();

  // --- NEW: Sorting Logic ---
  const sortedArmy = useMemo(() => {
    // Define the canonical order of battlefield roles.
    const roleOrder = [
      'Epic Hero',
      'Character',
      'Battleline',
      'Infantry',
      'Mounted',
      'Vehicle', // Note: Corrected from 'Vehicles' to match role name in data
      'Transport', // Note: Corrected from 'Dedicated Transports'
      'Fortification'
    ];
    
    // Create a copy of the army array and sort it.
    return [...army].sort((a, b) => {
      const roleAIndex = roleOrder.indexOf(a.role);
      const roleBIndex = roleOrder.indexOf(b.role);
      
      // If roles are the same, sort by name.
      if (roleAIndex === roleBIndex) {
        return a.name.localeCompare(b.name);
      }
      
      // Otherwise, sort by the defined role order.
      return roleAIndex - roleBIndex;
    });
  }, [army]); // This will re-sort only when the army array itself changes.

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
        // Map over the new 'sortedArmy' instead of the original 'army'
        sortedArmy.map((unit) => (
          <UnitCard
            key={unit.id}
            unit={unit}
            onRemoveUnit={removeUnit}
            weapons={weapons}
            isValid={isUnitValid(unit)}
          />
        ))
      )}
    </div>
  );
}

export default ArmyDisplay;
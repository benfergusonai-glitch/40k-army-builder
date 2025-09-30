import React, { useMemo } from 'react';
import { useArmy } from '../context/ArmyContext';
import { useGameData } from '../context/GameDataContext';
import UnitCard from './UnitCard';

function ArmyDisplay() {
  // --- FIX: Destructure the correctly named 'isUnitChapterValid' function ---
  const { army, totalPoints, removeUnit, selectedChapter, selectedDetachment, isUnitChapterValid } = useArmy();
  const { allWeapons: weapons } = useGameData();

  const sortedArmy = useMemo(() => {
    const roleOrder = [
      'Epic Hero',
      'Character',
      'Battleline',
      'Infantry',
      'Mounted',
      'Vehicle',
      'Transport',
      'Fortification'
    ];
    
    return [...army].sort((a, b) => {
      const roleAIndex = roleOrder.indexOf(a.role);
      const roleBIndex = roleOrder.indexOf(b.role);
      
      if (roleAIndex === roleBIndex) {
        return a.name.localeCompare(b.name);
      }
      
      return roleAIndex - roleBIndex;
    });
  }, [army]);

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
        sortedArmy.map((unit) => (
          <UnitCard
            key={unit.id}
            unit={unit}
            onRemoveUnit={removeUnit}
            weapons={weapons}
            // --- FIX: Call the correctly named function here ---
            isValid={isUnitChapterValid(unit)}
          />
        ))
      )}
    </div>
  );
}

export default ArmyDisplay;
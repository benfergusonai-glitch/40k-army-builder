import React, { useMemo } from 'react';
import { useArmy } from '../context/ArmyContext';
import ArmyUnitRow from './ArmyUnitRow';
// --- NEW: Import the ArmyConstraints component ---
import ArmyConstraints from './ArmyConstraints';

function ArmyDisplay() {
  const { army, totalPoints, selectedChapter, selectedDetachment, selectedUnitId, isUnitChapterValid } = useArmy();

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

      {/* --- NEW: ArmyConstraints component is now here --- */}
      <ArmyConstraints />
      
      {army.length === 0 ? (
        <p style={{textAlign: 'center', marginTop: '20px', fontStyle: 'italic'}}>
            Your army is empty.
        </p>
      ) : (
        <div style={{marginTop: '1rem'}}>
            {sortedArmy.map((unit) => (
            <ArmyUnitRow
                key={unit.id}
                unit={unit}
                isSelected={unit.id === selectedUnitId}
                isChapterValid={isUnitChapterValid(unit)}
            />
            ))}
        </div>
      )}
    </div>
  );
}

export default ArmyDisplay;
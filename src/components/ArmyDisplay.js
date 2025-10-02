import React, { useMemo } from 'react';
import { useArmy } from '../context/ArmyContext';
import ArmyUnitRow from './ArmyUnitRow';
import ArmyConstraints from './ArmyConstraints';

// --- NEW: Define the point limit for the game ---
const GAME_POINT_LIMIT = 2000;

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

  // --- NEW: Calculate remaining points and check if over limit ---
  const remainingPoints = GAME_POINT_LIMIT - totalPoints;
  const isOverLimit = totalPoints > GAME_POINT_LIMIT;

  return (
    <div className="army-display">
      <div className="army-details">
        {selectedChapter && <p><strong>Chapter:</strong> {selectedChapter.name}</p>}
        {selectedDetachment && <p><strong>Detachment:</strong> {selectedDetachment.name}</p>}
        
        {/* --- UPDATED: New points display --- */}
        <h3 className={isOverLimit ? 'points-over-limit' : ''}>
          Total Points: {totalPoints} / {GAME_POINT_LIMIT}
          <span style={{ marginLeft: '15px', color: '#ccc' }}>
            ({remainingPoints} Remaining)
          </span>
        </h3>
      </div>

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
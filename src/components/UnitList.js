import React, { useMemo } from 'react';
import './UnitList.css'; // --- ENSURE THIS IMPORT IS PRESENT ---
import { useArmy } from '../context/ArmyContext';
import { useGameData } from '../context/GameDataContext';
import { getUnitDisplayPoints } from '../utils/pointUtils';
import { isDatasheetLimitValid } from '../utils/rulesUtils';
import BattlefieldRoleIcon from './BattlefieldRoleIcon';

function UnitList() {
  const { addUnit, selectedChapter, army } = useArmy();
  const { allUnits: unitGroups } = useGameData();

  const filteredUnitGroups = useMemo(() => {
    if (!selectedChapter) {
      const filtered = {};
      Object.entries(unitGroups).forEach(([role, units]) => {
        const nonSpecificUnits = units.filter(unit => !unit.chapter_id);
        if (nonSpecificUnits.length > 0) {
          filtered[role] = nonSpecificUnits;
        }
      });
      return filtered;
    }
    
    const filtered = {};
    Object.entries(unitGroups).forEach(([role, units]) => {
      const chapterSpecificUnits = units.filter(unit => 
        !unit.chapter_id || unit.chapter_id === selectedChapter.id
      );

      if (chapterSpecificUnits.length > 0) {
        filtered[role] = chapterSpecificUnits;
      }
    });
    return filtered;
  }, [selectedChapter, unitGroups]);

  return (
    <div className="unit-list">
      {Object.entries(filteredUnitGroups).map(([role, units], index) => (
        <div key={role} className="role-group">
          <details open={index <= 1}>
            <summary>{role}</summary>
            {units.map((unit) => {
              const isAtLimit = !isDatasheetLimitValid(unit, army);

              return (
                <div key={unit.name} className="unit-entry">
                  <div className="unit-info">
                    <BattlefieldRoleIcon role={unit.role} />
                    <h4>{unit.name}</h4>
                  </div>
                  <div className="unit-actions">
                    <span className="unit-points">{getUnitDisplayPoints(unit)} pts</span>
                    <button 
                      onClick={() => addUnit(unit)} 
                      className="add-button"
                      disabled={isAtLimit}
                      title={isAtLimit ? 'Datasheet limit reached' : 'Add unit'}
                    >
                      {isAtLimit ? '—' : '+'}
                    </button>
                  </div>
                </div>
              );
            })}
          </details>
        </div>
      ))}
       {Object.keys(filteredUnitGroups).length === 0 && selectedChapter && (
        <p className="selection-prompt">No units available for the selected chapter.</p>
      )}
    </div>
  );
}

export default UnitList;
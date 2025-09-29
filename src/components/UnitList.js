import React, { useMemo } from 'react';
import { useArmy } from '../context/ArmyContext';
import { getUnitDisplayPoints } from '../utils/pointUtils';
import BattlefieldRoleIcon from './BattlefieldRoleIcon';

function UnitList({ unitGroups }) {
  const { addUnit, selectedChapter } = useArmy();

  const filteredUnitGroups = useMemo(() => {
    if (!selectedChapter) {
      return {}; // Return empty object if no chapter is selected
    }
    
    const filtered = {};
    Object.entries(unitGroups).forEach(([role, units]) => {
      const chapterSpecificUnits = units.filter(unit => 
        !unit.chapter || unit.chapter === selectedChapter.id
      );

      if (chapterSpecificUnits.length > 0) {
        filtered[role] = chapterSpecificUnits;
      }
    });
    return filtered;
  }, [selectedChapter, unitGroups]);

  if (!selectedChapter) {
    return <p className="selection-prompt">Please select a Chapter to see available units.</p>;
  }

  return (
    <div className="unit-list">
      {Object.entries(filteredUnitGroups).map(([role, units]) => (
        <div key={role} className="role-group">
          <h3>{role}</h3>
          {units.map((unit) => (
            <div key={unit.name} className="unit-entry">
              <div className="unit-info">
                <h4>
                  <BattlefieldRoleIcon role={unit.role} />
                  {unit.name}
                </h4>
                <p>{getUnitDisplayPoints(unit)} pts</p>
              </div>
              <button onClick={() => addUnit(unit)} className="add-button">+</button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default UnitList;
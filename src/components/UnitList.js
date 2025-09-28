import React from 'react';
import { useArmy } from '../context/ArmyContext';

function UnitList({ units }) {
  const { addUnit } = useArmy();

  const getUnitDisplayPoints = (unit) => {
    if (Array.isArray(unit.points)) {
      return unit.points[0]?.cost || 0;
    }
    return unit.points || 0;
  };

  return (
    <div className="unit-list">
      {units.map((unit) => (
        <div key={unit.name} className="unit-entry">
          <div className="unit-info">
            <h4>{unit.name}</h4>
            <p>{getUnitDisplayPoints(unit)} pts</p>
          </div>
          <button onClick={() => addUnit(unit)} className="add-button">+</button>
        </div>
      ))}
    </div>
  );
}

export default UnitList;
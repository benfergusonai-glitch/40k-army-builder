import React from 'react';
import './UnitSelector.css';

function UnitSelector({ groupedUnits, onAddUnit }) {
  const handleAddUnit = (event) => {
    const unitId = event.target.value;
    if (unitId) {
      onAddUnit(unitId);
      event.target.value = "";
    }
  };

  const roles = Object.keys(groupedUnits);

  return (
    <div>
      <h2>Select a Unit</h2>
      {roles.map(role => (
        <div key={role} className="selector-group">
          {/* We can now use the 'role' key directly as our label! */}
          <label>{role}</label>
          <select onChange={handleAddUnit} defaultValue="">
            <option value="" disabled>-- Select --</option>
            {groupedUnits[role].map(unit => (
              <option key={unit.id} value={unit.id}>
                {unit.name}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}

export default UnitSelector;
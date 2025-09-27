import React from 'react';
import UnitCard from './UnitCard';

function ArmyList({
  selectedUnits,
  allWeapons,
  onRemoveUnit,
  onDuplicateUnit, // <-- Accept the new prop
  totalPoints,
  availableEnhancements,
  onAssignEnhancement,
  assignedEnhancementIds,
  onWargearChange,
  unitCounts,
  maxUnitCounts,
}) {
  return (
    <div>
      <h2>Your Army List</h2>
      <h3>Total Points: {totalPoints}</h3>
      {selectedUnits.length === 0 ? (
        <p>Your army list is empty.</p>
      ) : (
        <div>
          {selectedUnits.map(unit => (
            <UnitCard
              key={unit.instanceId}
              unit={unit}
              allWeapons={allWeapons}
              onRemoveUnit={onRemoveUnit}
              onDuplicateUnit={onDuplicateUnit} // <-- Pass it down
              availableEnhancements={availableEnhancements}
              onAssignEnhancement={onAssignEnhancement}
              assignedEnhancementIds={assignedEnhancementIds}
              onWargearChange={onWargearChange}
              currentCount={unitCounts[unit.id]}
              maxCount={maxUnitCounts[unit.role] || 3}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ArmyList;
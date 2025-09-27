import React from 'react';
import './EnhancementSelector.css';

function EnhancementSelector({
  availableEnhancements,
  assignedEnhancement,
  onAssignEnhancement,
  assignedEnhancementIds, // <-- Accept the new prop
}) {
  return (
    <div className="enhancement-selector-container">
      <label htmlFor="enhancement-select">Enhancement</label>
      <select
        id="enhancement-select"
        value={assignedEnhancement?.id || ''}
        onChange={(e) => onAssignEnhancement(e.target.value)}
      >
        <option value="">-- None --</option>
        {availableEnhancements.map(enh => {
          // --- NEW LOGIC START ---
          // An option is disabled if its ID is in the assigned list,
          // UNLESS it's the one that is already assigned to this specific unit.
          const isAssignedToAnotherUnit = 
            assignedEnhancementIds.includes(enh.id) && 
            enh.id !== assignedEnhancement?.id;
          // --- NEW LOGIC END ---

          return (
            <option key={enh.id} value={enh.id} disabled={isAssignedToAnotherUnit}>
              {enh.name} [{enh.cost} pts]
            </option>
          );
        })}
      </select>
    </div>
  );
}

export default EnhancementSelector;
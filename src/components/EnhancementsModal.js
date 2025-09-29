import React, { useState, useEffect } from 'react';
import './EnhancementsModal.css';
import { useArmy } from '../context/ArmyContext';
import { useGameData } from '../context/GameDataContext'; // Import the new hook

// The 'enhancements' prop is no longer needed.
function EnhancementsModal() {
  const { 
    editingEnhancementUnit: unit,
    handleCloseEnhancementsModal: onClose,
    updateUnitEnhancement 
  } = useArmy();
  
  // Get static game data directly from the context.
  const { allEnhancements: enhancements } = useGameData();
  
  const [selectedEnhancement, setSelectedEnhancement] = useState(null);

  useEffect(() => {
    if (unit) {
      setSelectedEnhancement(unit.current_enhancement);
    }
  }, [unit]);

  if (!unit) {
    return null;
  }

  const isEligible = unit.role === 'Character' && !unit.keywords.includes('EPIC HERO');
  // NOTE: This is hardcoded for now, but could be dynamic in the future.
  const currentDetachmentId = 'gladius_task_force'; 

  const availableEnhancements = enhancements.filter(enhancement => {
    if (enhancement.detachment_id !== currentDetachmentId) {
      return false;
    }
    if (enhancement.prerequisites.length > 0) {
      return enhancement.prerequisites.every(prereq => unit.keywords.includes(prereq));
    }
    return true;
  });

  const handleSelectionChange = (enhancement) => {
    setSelectedEnhancement(enhancement);
  };
  
  const handleConfirm = () => {
    updateUnitEnhancement(unit.id, selectedEnhancement);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Enhancements for {unit.name}</h3>
          <button onClick={onClose} className="close-button">&times;</button>
        </div>
        <div className="modal-body">
          {!isEligible ? (
            <p>This unit is not eligible for Enhancements (it may be an Epic Hero).</p>
          ) : (
            <div className="enhancements-list">
              <label className="enhancement-option">
                <input
                  type="radio"
                  name="enhancement"
                  checked={!selectedEnhancement}
                  onChange={() => handleSelectionChange(null)}
                />
                <div className="enhancement-details">
                  <span className="enhancement-name">-- None --</span>
                </div>
              </label>
              {availableEnhancements.map(enh => (
                <label key={enh.id} className="enhancement-option">
                  <input
                    type="radio"
                    name="enhancement"
                    checked={selectedEnhancement?.id === enh.id}
                    onChange={() => handleSelectionChange(enh)}
                  />
                  <div className="enhancement-details">
                    <span className="enhancement-name">{enh.name} [{enh.cost} pts]</span>
                    <p className="enhancement-rule">{enh.rule}</p>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button onClick={onClose} className="button-secondary">Cancel</button>
          <button onClick={handleConfirm} className="button-primary">Confirm</button>
        </div>
      </div>
    </div>
  );
}

export default EnhancementsModal;
import React, { useState, useEffect, useMemo } from 'react';
import './EnhancementsModal.css';
import { useArmy } from '../context/ArmyContext';
import { useGameData } from '../context/GameDataContext';

function EnhancementsModal() {
  const { 
    editingEnhancementUnit: unit,
    handleCloseEnhancementsModal: onClose,
    updateUnitEnhancement,
    selectedDetachment 
  } = useArmy();
  
  const { allEnhancements: enhancements } = useGameData();
  const [selectedEnhancement, setSelectedEnhancement] = useState(null);

  useEffect(() => {
    if (unit) {
      setSelectedEnhancement(unit.current_enhancement);
    }
  }, [unit]);

  const availableEnhancements = useMemo(() => {
    // --- FIX ---
    // Add a guard clause to ensure both a unit and a detachment are selected
    // before attempting to filter. This prevents the 'null' error.
    if (!unit || !selectedDetachment) {
      return [];
    }
    
    return enhancements.filter(enhancement => {
      if (enhancement.detachment_id !== selectedDetachment.id) {
        return false;
      }
      if (enhancement.prerequisites.length > 0) {
        // Defensively check for keywords before checking prerequisites
        return unit.keywords && enhancement.prerequisites.every(prereq => unit.keywords.includes(prereq));
      }
      return true;
    });
  }, [selectedDetachment, enhancements, unit]);


  if (!unit) {
    return null;
  }

  const isEligible = unit.role === 'Character' && !unit.keywords.includes('EPIC HERO');

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
          {!selectedDetachment ? (
             <p>Please select a Detachment before choosing Enhancements.</p>
          ) : !isEligible ? (
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
              {availableEnhancements.length === 0 && <p>No enhancements available for this unit in the selected Detachment.</p>}
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
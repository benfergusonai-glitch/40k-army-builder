import React, { useState, useEffect } from 'react';
import './WargearModal.css';
import { useArmy } from '../context/ArmyContext';

// The props 'show', 'unit', and 'onClose' are no longer needed
function WargearModal() {
  const { 
    editingWargearUnit: unit, // Get the unit to edit from context
    handleCloseWargearModal: onClose, // Get the close handler from context
    updateUnitWargear 
  } = useArmy();
  
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    if (unit) {
      setSelectedOption(unit.current_wargear);
    }
  }, [unit]);

  // The modal's visibility is now determined by whether 'unit' exists in the context
  if (!unit) {
    return null;
  }

  const handleSelectionChange = (option) => {
    setSelectedOption(option);
  };

  const handleConfirm = () => {
    if (selectedOption) {
      updateUnitWargear(unit.id, selectedOption);
    }
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Wargear Options for {unit.name}</h3>
          <button onClick={onClose} className="close-button">&times;</button>
        </div>
        <div className="modal-body">
          {unit.wargear_options && unit.wargear_options.length > 0 ? (
            <div className="wargear-options-list">
              {unit.wargear_options.map((option) => (
                <label key={option.id} className="wargear-option">
                  <input
                    type="radio"
                    name="wargear"
                    checked={selectedOption?.id === option.id}
                    onChange={() => handleSelectionChange(option)}
                  />
                  <span>{option.description}</span>
                </label>
              ))}
            </div>
          ) : (
            <p>This unit has no wargear options.</p>
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

export default WargearModal;
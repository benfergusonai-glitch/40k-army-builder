import React, { useState, useEffect } from 'react';
import './WargearModal.css';
import { useArmy } from '../context/ArmyContext';

function WargearModal({ show, unit, onClose }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const { updateUnitWargear } = useArmy();

  useEffect(() => {
    if (unit) {
      setSelectedOption(unit.current_wargear);
    }
  }, [unit]);

  if (!show) {
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
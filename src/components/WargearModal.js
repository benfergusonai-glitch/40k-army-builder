import React, { useState, useEffect } from 'react';
import './WargearModal.css';
import { useArmy } from '../context/ArmyContext';

function WargearModal() {
  const { 
    editingWargearUnit: unit, 
    handleCloseWargearModal: onClose, 
    updateUnitWargearSelection 
  } = useArmy();
  
  // State now holds the complex selection object
  const [selection, setSelection] = useState({ loadoutId: null, sub_selections: {} });

  useEffect(() => {
    // Initialize state from the unit's current selection when modal opens
    if (unit) {
      setSelection(unit.wargear_selection || { loadoutId: unit.wargear_options[0]?.id, sub_selections: {} });
    }
  }, [unit]);

  if (!unit) {
    return null;
  }

  const handleMainOptionChange = (option) => {
    // When main loadout changes, reset sub_selections
    setSelection({
      loadoutId: option.id,
      sub_selections: {}
    });
  };

  const handleSubOptionChange = (subOptionId, choiceItemId) => {
    setSelection(prevSelection => ({
      ...prevSelection,
      sub_selections: {
        ...prevSelection.sub_selections,
        [subOptionId]: choiceItemId
      }
    }));
  };

  const handleConfirm = () => {
    updateUnitWargearSelection(unit.id, selection);
    onClose();
  };
  
  const selectedLoadout = unit.wargear_options.find(opt => opt.id === selection.loadoutId);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Wargear Options for {unit.name}</h3>
          <button onClick={onClose} className="close-button">&times;</button>
        </div>
        <div className="modal-body">
          {unit.wargear_options?.length > 0 ? (
            <div className="wargear-options-list">
              <h4>Select Loadout:</h4>
              {unit.wargear_options.map((option) => (
                <label key={option.id} className="wargear-option">
                  <input
                    type="radio"
                    name="wargear-loadout"
                    checked={selection.loadoutId === option.id}
                    onChange={() => handleMainOptionChange(option)}
                  />
                  <span>{option.description}</span>
                </label>
              ))}

              {selectedLoadout?.sub_options?.length > 0 && (
                <div className="wargear-sub-options">
                  <h4>Configure Options:</h4>
                  {selectedLoadout.sub_options.map(sub => (
                    <div key={sub.option_id} className="sub-option-group">
                      <label htmlFor={sub.option_id}>{sub.description}</label>
                      <select 
                        id={sub.option_id} 
                        value={selection.sub_selections[sub.option_id] || ''}
                        onChange={(e) => handleSubOptionChange(sub.option_id, e.target.value)}
                      >
                        <option value="" disabled>Select...</option>
                        {sub.choices.map(choice => (
                          <option key={choice.item_id} value={choice.item_id}>
                            {choice.item_id.replace(/_/g, ' ').replace('captain ', '')}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              )}
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
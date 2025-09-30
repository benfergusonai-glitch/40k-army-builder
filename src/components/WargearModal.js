import React, { useState, useEffect } from 'react';
import './WargearModal.css';
import { useArmy } from '../context/ArmyContext';
import WargearLoadoutOption from './WargearLoadoutOption'; // Import the new component

function WargearModal() {
  const { 
    editingWargearUnit: unit, 
    handleCloseWargearModal: onClose, 
    updateUnitWargearSelection 
  } = useArmy();
  
  const [selection, setSelection] = useState({ loadoutId: null, sub_selections: {} });

  const unitWargearOptions = Array.isArray(unit?.wargear_options) ? unit.wargear_options : [];

  useEffect(() => {
    if (unit && unitWargearOptions.length > 0) {
      const initialLoadoutId = unit.wargear_selection?.loadoutId || unitWargearOptions[0].id;
      setSelection(unit.wargear_selection || { 
        loadoutId: initialLoadoutId, 
        sub_selections: {} 
      });
    }
  }, [unit, unitWargearOptions]);

  if (!unit) {
    return null;
  }

  const handleSelectLoadout = (loadoutId) => {
    setSelection({
      loadoutId: loadoutId,
      sub_selections: {} // Reset sub-selections when a new main loadout is chosen
    });
  };

  const handleSubSelectWargear = (loadoutId, subOptionId, choiceId) => {
    // Ensure we are only updating sub-selections for the currently active loadout
    if (selection.loadoutId !== loadoutId) return;

    setSelection(prevSelection => ({
      ...prevSelection,
      sub_selections: {
        ...prevSelection.sub_selections,
        [subOptionId]: choiceId
      }
    }));
  };

  const handleConfirm = () => {
    updateUnitWargearSelection(unit.id, selection);
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
          {unitWargearOptions.length > 0 ? (
            <div className="wargear-options-list">
              {unitWargearOptions.map((option) => (
                <WargearLoadoutOption
                  key={option.id}
                  loadout={option}
                  isSelected={selection.loadoutId === option.id}
                  onSelectLoadout={handleSelectLoadout}
                  onSubSelectWargear={handleSubSelectWargear}
                  currentSubSelections={selection.sub_selections}
                />
              ))}
            </div>
          ) : (
            <p>This unit has no custom wargear options to select.</p>
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
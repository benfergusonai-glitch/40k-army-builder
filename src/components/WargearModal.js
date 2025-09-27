import React, { useState } from 'react';
import './WargearModal.css';

function WargearModal({ unit, onClose, onWargearChange }) {
  // State to track which top-level loadout is selected
  const [selectedLoadoutId, setSelectedLoadoutId] = useState(unit.selected_wargear?.loadout_id || null);

  const handleLoadoutSelect = (loadoutId) => {
    setSelectedLoadoutId(loadoutId);
    // When a new loadout is chosen, we pass the entire loadout object up
    const selectedLoadout = unit.wargear_options.find(lo => lo.loadout_id === loadoutId);
    onWargearChange(unit.instanceId, 'loadout', selectedLoadout);
  };

  const handleSubOptionSelect = (subOptionId, choiceId) => {
    onWargearChange(unit.instanceId, subOptionId, choiceId);
  };

  const selectedLoadout = unit.wargear_options.find(lo => lo.loadout_id === selectedLoadoutId);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Wargear Options for {unit.name}</h3>
          <button onClick={onClose} className="close-btn">&times;</button>
        </div>
        <div className="modal-body">
          {/* Stage 1: Select a Loadout */}
          <div className="wargear-option-group">
            <p>Select Loadout:</p>
            {unit.wargear_options.map(loadout => (
              <label key={loadout.loadout_id} className="choice-label">
                <input
                  type="radio"
                  name="loadout-selection"
                  checked={selectedLoadoutId === loadout.loadout_id}
                  onChange={() => handleLoadoutSelect(loadout.loadout_id)}
                />
                {loadout.description}
              </label>
            ))}
          </div>

          {/* Stage 2: Show Sub-Options for the selected loadout */}
          {selectedLoadout && selectedLoadout.sub_options.map(subOption => (
            <div key={subOption.option_id} className="wargear-option-group sub-option">
              <p>{subOption.description}</p>
              {subOption.choices.map(choice => (
                <label key={choice.item_id} className="choice-label">
                  <input
                    type="radio"
                    name={subOption.option_id}
                    checked={unit.selected_wargear?.[subOption.option_id] === choice.item_id}
                    onChange={() => handleSubOptionSelect(subOption.option_id, choice.item_id)}
                  />
                  {choice.item_id.replace(/_/g, ' ')}
                </label>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default WargearModal;
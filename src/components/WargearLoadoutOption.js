import React from 'react';
import './WargearLoadoutOption.css';

// --- Helper function to make item_ids more readable ---
const formatItemId = (id) => {
    if (!id) return '';
    return id.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()); // Replace underscores and capitalize words
};

function WargearLoadoutOption({ 
    loadout, 
    isSelected, 
    onSelectLoadout, 
    onSubSelectWargear, 
    currentSubSelections 
}) {
    const handleRadioChange = () => {
        onSelectLoadout(loadout.id);
    };

    const handleSubSelectionChange = (e, subOptionId) => {
        // Prevent the main box from being selected when interacting with a dropdown
        e.stopPropagation(); 
        onSubSelectWargear(loadout.id, subOptionId, e.target.value);
    };

    return (
        <div 
            className={`wargear-loadout-option ${isSelected ? 'selected' : ''}`}
            onClick={handleRadioChange}
        >
            <div className="loadout-header">
                <input
                    type="radio"
                    name="wargearLoadout"
                    value={loadout.id}
                    checked={isSelected}
                    onChange={handleRadioChange}
                    onClick={(e) => e.stopPropagation()} // Prevent double-firing of click event
                />
                {/* --- FIX: Use loadout.description instead of loadout.name --- */}
                <span className="loadout-description">{loadout.description}</span>
                {/* Point cost logic has been removed as it's not present in the current data structure */}
            </div>

            {isSelected && loadout.sub_options && loadout.sub_options.length > 0 && (
                <div className="sub-selection-options">
                    {loadout.sub_options.map(subOption => (
                        <div key={subOption.option_id} className="sub-selection-option">
                            {/* --- FIX: Use subOption.description for the label --- */}
                            <label htmlFor={`sub-select-${loadout.id}-${subOption.option_id}`}>
                                {subOption.description}
                            </label>
                            <select
                                id={`sub-select-${loadout.id}-${subOption.option_id}`}
                                value={currentSubSelections[subOption.option_id] || ''}
                                onChange={(e) => handleSubSelectionChange(e, subOption.option_id)}
                                onClick={(e) => e.stopPropagation()} // Prevent click from bubbling to the main div
                            >
                                <option value="" disabled>Select...</option>
                                {subOption.choices.map(choice => (
                                    <option key={choice.item_id} value={choice.item_id}>
                                        {/* --- FIX: Use choice.item_id and format it --- */}
                                        {formatItemId(choice.item_id)}
                                    </option>
                                ))}
                            </select>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default WargearLoadoutOption;
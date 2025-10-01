import React from 'react';
import './WargearLoadoutOption.css';

const formatItemId = (id) => {
    if (!id) return '';
    return id.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
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

    const handleSubSelectionChange = (subOptionId, choiceId) => {
        onSubSelectWargear(loadout.id, subOptionId, choiceId);
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
                    onClick={(e) => e.stopPropagation()}
                />
                <span className="loadout-description">{loadout.description}</span>
            </div>

            {isSelected && loadout.sub_options && loadout.sub_options.length > 0 && (
                <div className="sub-selection-options" onClick={(e) => e.stopPropagation()}>
                    {loadout.sub_options.map(subOption => (
                        <div key={subOption.option_id} className="sub-option-group">
                            <p className="sub-option-label">{subOption.description}</p>
                            <div className="sub-option-choices">
                                {/* --- UPDATED: Replaced <select> with radio buttons --- */}
                                {subOption.choices.map(choice => (
                                    <label key={choice.item_id} className="sub-option-radio">
                                        <input
                                            type="radio"
                                            name={subOption.option_id}
                                            value={choice.item_id}
                                            checked={currentSubSelections[subOption.option_id] === choice.item_id}
                                            onChange={() => handleSubSelectionChange(subOption.option_id, choice.item_id)}
                                        />
                                        <span>{formatItemId(choice.item_id)}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default WargearLoadoutOption;
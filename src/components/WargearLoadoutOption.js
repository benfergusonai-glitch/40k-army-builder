import React from 'react';
import './WargearLoadoutOption.css';

function WargearLoadoutOption({ loadout, isSelected, onSelectLoadout, onSubSelectWargear, currentSubSelections }) {
    const handleSelect = () => {
        onSelectLoadout(loadout.id);
    };

    return (
        <div className={`wargear-card ${isSelected ? 'selected' : ''}`} onClick={handleSelect}>
            <div className="wargear-card-header">
                <span className="radio-indicator"></span>
                <span className="wargear-description">{loadout.description}</span>
            </div>
            {isSelected && loadout.sub_options && loadout.sub_options.length > 0 && (
                <div className="wargear-card-body">
                    {loadout.sub_options.map(subOption => (
                        <div key={subOption.option_id} className="sub-option-group">
                            <p className="sub-option-description">{subOption.description}</p>
                            <div className="sub-option-buttons">
                                {subOption.choices.map(choice => (
                                    <button
                                        key={choice.item_id}
                                        className={`sub-option-button ${currentSubSelections[subOption.option_id] === choice.item_id ? 'selected' : ''}`}
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevent card from being deselected
                                            onSubSelectWargear(loadout.id, subOption.option_id, choice.item_id);
                                        }}
                                    >
                                        {choice.item_name}
                                    </button>
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
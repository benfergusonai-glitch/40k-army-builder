import React from 'react';
import './ArmyUnitRow.css';
import { useArmy } from '../context/ArmyContext';
import { getUnitDisplayPoints } from '../utils/pointUtils';
import BattlefieldRoleIcon from './BattlefieldRoleIcon';

// --- UPDATED: Component now accepts the isChapterValid prop ---
function ArmyUnitRow({ unit, isSelected, isChapterValid }) {
    const { selectUnit, removeUnit } = useArmy();

    const handleSelect = () => {
        selectUnit(unit.id);
    };

    const handleRemove = (e) => {
        e.stopPropagation(); 
        removeUnit(unit.id);
    };

    const totalPoints = getUnitDisplayPoints(unit) + (unit.current_enhancement?.cost || 0);

    // --- UPDATED: Conditionally add the 'invalid' class ---
    const rowClasses = [
        'army-unit-row',
        isSelected ? 'selected' : '',
        !isChapterValid ? 'invalid' : ''
    ].join(' ');

    return (
        <div 
            className={rowClasses}
            onClick={handleSelect}
        >
            <div className="unit-row-info">
                <BattlefieldRoleIcon role={unit.role} />
                <h5>{unit.name}</h5>
            </div>
            <div className="unit-row-actions">
                <span className="unit-row-points">{totalPoints} pts</span>
                <button 
                    className="unit-row-remove-button"
                    onClick={handleRemove}
                    title="Remove unit"
                >
                    &times;
                </button>
            </div>
        </div>
    );
}

export default ArmyUnitRow;
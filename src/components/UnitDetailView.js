import React, { useState, useEffect, useMemo } from 'react';
import './UnitDetailView.css';
import { useArmy } from '../context/ArmyContext';
import { useGameData } from '../context/GameDataContext';
import BattlefieldRoleIcon from './BattlefieldRoleIcon';
import WeaponStats from './WeaponStats';
import WargearLoadoutOption from './WargearLoadoutOption';

function UnitDetailView() {
    const { army, selectedUnitId, updateUnitWargearSelection, updateUnitEnhancement, selectedDetachment } = useArmy();
    const { allWeapons, allEnhancements } = useGameData();

    const unit = useMemo(() => army.find(u => u.id === selectedUnitId), [army, selectedUnitId]);
    const [wargearSelection, setWargearSelection] = useState({ loadoutId: null, sub_selections: {} });
    
    const isEnhancementEligible = unit?.role === 'Character' && !unit?.keywords.includes('EPIC HERO');

    const availableEnhancements = useMemo(() => {
        if (!unit || !selectedDetachment || !isEnhancementEligible) return [];
        const usedEnhancementIds = army.filter(u => u.id !== unit.id && u.current_enhancement).map(u => u.current_enhancement.id);
        return allEnhancements.filter(enh => {
            if (enh.detachment_id !== selectedDetachment.id) return false;
            if (usedEnhancementIds.includes(enh.id)) return false;
            if (enh.prerequisites.length > 0) {
                return unit.keywords && enh.prerequisites.every(prereq => unit.keywords.includes(prereq));
            }
            return true;
        });
    }, [selectedDetachment, allEnhancements, unit, isEnhancementEligible, army]);

    useEffect(() => {
        if (unit) {
            setWargearSelection(unit.wargear_selection || {
                loadoutId: unit.wargear_options?.[0]?.id || null,
                sub_selections: {}
            });
        }
    }, [unit]);

    const handleWargearLoadoutChange = (loadoutId) => {
        const newSelection = { loadoutId, sub_selections: {} };
        setWargearSelection(newSelection);
        updateUnitWargearSelection(unit.id, newSelection);
    };
    
    const handleWargearSubSelectChange = (loadoutId, subOptionId, choiceId) => {
        const newSubSelections = { ...wargearSelection.sub_selections, [subOptionId]: choiceId };
        const newSelection = { ...wargearSelection, sub_selections: newSubSelections };
        setWargearSelection(newSelection);
        updateUnitWargearSelection(unit.id, newSelection);
    };
    
    const handleEnhancementChange = (enhancement) => {
        updateUnitEnhancement(unit.id, enhancement);
    };
    
    const finalWeaponIds = useMemo(() => {
        if (!unit) return [];
        const currentLoadout = unit.wargear_options?.find(opt => opt.id === wargearSelection.loadoutId);
        if (!currentLoadout) return unit.weapon_ids || [];
        let weaponIds = [...(currentLoadout.default_items || [])];
        if (currentLoadout.sub_options && wargearSelection.sub_selections) {
            for (const subOption of currentLoadout.sub_options) {
                const selectedChoiceId = wargearSelection.sub_selections[subOption.option_id];
                if (selectedChoiceId) weaponIds.push(selectedChoiceId);
            }
        }
        return weaponIds;
    }, [unit, wargearSelection]);

    if (!unit) {
        return (
            <div className="unit-detail-view">
                <div className="unit-detail-placeholder">
                    <p>Select a unit from your army to see its details.</p>
                </div>
            </div>
        );
    }
    
    const stats = unit.stats || {};
    const allUnitWeapons = finalWeaponIds.map(id => allWeapons[id]).filter(Boolean);
    const rangedWeapons = allUnitWeapons.filter(w => w.range !== 'Melee');
    const meleeWeapons = allUnitWeapons.filter(w => w.range === 'Melee');
    
    return (
        <div className="unit-detail-view">
            <div className="detail-header">
                <h3><BattlefieldRoleIcon role={unit.role} /> {unit.name}</h3>
            </div>

            <div className="detail-columns-container">
                <div className="detail-column-main">
                    <div className="detail-section">
                        <h4>Unit Profile</h4>
                        <div className="unit-stats-grid">
                            <div className="stat-header">M</div><div className="stat-header">T</div><div className="stat-header">SV</div>
                            <div className="stat-header">W</div><div className="stat-header">LD</div><div className="stat-header">OC</div>
                            <div className="stat-value">{stats.m || '-'}</div><div className="stat-value">{stats.t || '-'}</div><div className="stat-value">{stats.sv || '-'}</div>
                            <div className="stat-value">{stats.w || '-'}</div><div className="stat-value">{stats.ld || '-'}</div><div className="stat-value">{stats.oc || '-'}</div>
                        </div>
                        {unit.keywords?.length > 0 && (
                            <div className="unit-keywords-display">
                                <strong>Keywords:</strong> {unit.keywords.join(', ')}
                            </div>
                        )}
                        {unit.current_enhancement && (
                            <div className="detail-enhancement-display">
                                <strong>Enhancement: {unit.current_enhancement.name}</strong>
                                <p>{unit.current_enhancement.rule}</p>
                            </div>
                        )}
                    </div>

                    {(allUnitWeapons.length > 0) && (
                        <div className="detail-section">
                            <h4>Weapons</h4>
                            {rangedWeapons.length > 0 && (
                                <table className="weapon-stats-table">
                                    <thead><tr><th>Ranged</th><th>Range</th><th>A</th><th>BS</th><th>S</th><th>AP</th><th>D</th><th>Keywords</th></tr></thead>
                                    <tbody>{rangedWeapons.map(weapon => <WeaponStats key={weapon.id} weapon={weapon} />)}</tbody>
                                </table>
                            )}
                            {meleeWeapons.length > 0 && (
                                <table className="weapon-stats-table" style={{marginTop: '1rem'}}>
                                    <thead><tr><th>Melee</th><th>Range</th><th>A</th><th>WS</th><th>S</th><th>AP</th><th>D</th><th>Keywords</th></tr></thead>
                                    <tbody>{meleeWeapons.map(weapon => <WeaponStats key={weapon.id} weapon={weapon} />)}</tbody>
                                </table>
                            )}
                        </div>
                    )}
                </div>

                <div className="detail-column-sidebar">
                    {/* --- THIS SECTION IS NOW RESTORED --- */}
                    {unit.wargear_options?.length > 0 && (
                        <div className="detail-section">
                            <h4>Wargear Options</h4>
                            {unit.wargear_options.map(option => (
                                <WargearLoadoutOption
                                    key={option.id}
                                    loadout={option}
                                    isSelected={wargearSelection.loadoutId === option.id}
                                    onSelectLoadout={handleWargearLoadoutChange}
                                    onSubSelectWargear={handleWargearSubSelectChange}
                                    currentSubSelections={wargearSelection.sub_selections}
                                />
                            ))}
                        </div>
                    )}

                    {isEnhancementEligible && (
                        <div className="detail-section">
                            <h4>Enhancements</h4>
                            { !selectedDetachment ? <p>Select a Detachment...</p> :
                            <div className="enhancements-list">
                                <label className={`enhancement-option ${!unit.current_enhancement ? 'selected' : ''}`} onClick={() => handleEnhancementChange(null)}>
                                    <input type="radio" name="enhancement" checked={!unit.current_enhancement} readOnly/>
                                    <div className="enhancement-details">
                                        <span className="enhancement-name">-- None --</span>
                                    </div>
                                </label>
                                {availableEnhancements.map(enh => (
                                    <label key={enh.id} className={`enhancement-option ${unit.current_enhancement?.id === enh.id ? 'selected' : ''}`} onClick={() => handleEnhancementChange(enh)}>
                                        <input type="radio" name="enhancement" checked={unit.current_enhancement?.id === enh.id} readOnly/>
                                        <div className="enhancement-details">
                                            <span className="enhancement-name">{enh.name} [{enh.cost} pts]</span>
                                        </div>
                                    </label>
                                ))}
                            </div>
                            }
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default UnitDetailView;
import React, { useState, useEffect, useMemo } from 'react';
import './UnitDetailView.css';
import { useArmy } from '../context/ArmyContext';
import { useGameData } from '../context/GameDataContext';
import BattlefieldRoleIcon from './BattlefieldRoleIcon';
import WeaponStats from './WeaponStats';
import WargearLoadoutOption from './WargearLoadoutOption';

function StratagemCard({ strat }) {
    const typeToClassName = (type) => {
        return type ? `type-${type.toLowerCase().replace(/\s+/g, '-')}` : '';
    };

    return (
        <div className={`stratagem-card ${typeToClassName(strat.type)}`}>
            <div className="stratagem-header">
                <span className="stratagem-name">{strat.name}</span>
                <span className="stratagem-cost">{strat.cost}</span>
            </div>
            <div className="stratagem-body">
                <div className="stratagem-meta">
                    <span className="stratagem-source">{strat.source}</span>
                    <span className="stratagem-type">{strat.type}</span>
                </div>
                <div className="stratagem-rule-section">
                    <p><strong>WHEN:</strong> {strat.rules.when}</p>
                    <p><strong>TARGET:</strong> {strat.rules.target}</p>
                    <p><strong>EFFECT:</strong> {strat.rules.effect}</p>
                </div>
            </div>
        </div>
    );
}

function UnitDetailView() {
    // ... (Component logic remains the same)
    const { army, selectedUnitId, updateUnitWargearSelection, updateUnitEnhancement, selectedDetachment } = useArmy();
    const { allWeapons, allEnhancements, allStratagems } = useGameData();
    const [activeTab, setActiveTab] = useState('profile');
    const unit = useMemo(() => army.find(u => u.id === selectedUnitId), [army, selectedUnitId]);
    const [wargearSelection, setWargearSelection] = useState({ loadoutId: null, sub_selections: {} });
    const isEnhancementEligible = unit?.role === 'Character' && !unit?.keywords.includes('EPIC HERO');
    const availableEnhancements = useMemo(() => {
        if (!unit || !selectedDetachment || !isEnhancementEligible) return [];
        const usedEnhancementIds = army.filter(u => u.id !== unit.id && u.current_enhancement).map(u => u.current_enhancement.id);
        return allEnhancements.filter(enh => {
            if (enh.detachment_id !== selectedDetachment.id) return false;
            if (usedEnhancementIds.includes(enh.id)) return false;
            if (enh.prerequisites.length > 0) return unit.keywords && enh.prerequisites.every(prereq => unit.keywords.includes(prereq));
            return true;
        });
    }, [selectedDetachment, allEnhancements, unit, isEnhancementEligible, army]);
    const relevantStratagems = useMemo(() => {
        if (!unit) return [];
        const unitKeywords = unit.keywords || [];
        return allStratagems.filter(strat => {
            const detachmentMatch = !strat.detachment_id || (selectedDetachment && strat.detachment_id === selectedDetachment.id);
            if (!detachmentMatch) return false;
            const keywordsMatch = strat.keyword_requirements.length === 0 || strat.keyword_requirements.some(req => unitKeywords.includes(req));
            return keywordsMatch;
        });
    }, [unit, selectedDetachment, allStratagems]);
    useEffect(() => {
        if (unit) {
            setWargearSelection(unit.wargear_selection || { loadoutId: unit.wargear_options?.[0]?.id || null, sub_selections: {} });
            setActiveTab('profile');
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
        return <div className="unit-detail-view"><div className="unit-detail-placeholder"><p>Select a unit from your army to see its details.</p></div></div>;
    }
    
    const stats = unit.stats || {};
    const allUnitWeapons = finalWeaponIds.map(id => allWeapons[id]).filter(Boolean);
    const rangedWeapons = allUnitWeapons.filter(w => w.range !== 'Melee');
    const meleeWeapons = allUnitWeapons.filter(w => w.range === 'Melee');
    
    return (
        <div className="unit-detail-view">
            <div className="detail-header"><h3><BattlefieldRoleIcon role={unit.role} /> {unit.name}</h3></div>
            <div className="tab-nav">
                <button className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>Profile</button>
                <button className={`tab-button ${activeTab === 'options' ? 'active' : ''}`} onClick={() => setActiveTab('options')}>Options</button>
                <button className={`tab-button ${activeTab === 'rules' ? 'active' : ''}`} onClick={() => setActiveTab('rules')}>Rules</button>
                <button className={`tab-button ${activeTab === 'stratagems' ? 'active' : ''}`} onClick={() => setActiveTab('stratagems')}>Stratagems</button>
            </div>
            <div className="tab-content">
                {activeTab === 'profile' && (
                    <>
                        <div className="detail-section">
                            <div className="unit-stats-grid">
                                <div className="stat-header">M</div><div className="stat-header">T</div><div className="stat-header">SV</div>
                                <div className="stat-header">W</div><div className="stat-header">LD</div><div className="stat-header">OC</div>
                                <div className="stat-value">{stats.m || '-'}</div><div className="stat-value">{stats.t || '-'}</div><div className="stat-value">{stats.sv || '-'}</div>
                                <div className="stat-value">{stats.w || '-'}</div><div className="stat-value">{stats.ld || '-'}</div><div className="stat-value">{stats.oc || '-'}</div>
                            </div>
                            {unit.keywords?.length > 0 && <div className="unit-keywords-display"><strong>Keywords:</strong> {unit.keywords.join(', ')}</div>}
                            {unit.current_enhancement && <div className="detail-enhancement-display"><strong>Enhancement: {unit.current_enhancement.name}</strong><p>{unit.current_enhancement.rule}</p></div>}
                        </div>
                        {(allUnitWeapons.length > 0) && (
                            <div className="detail-section">
                                <h4>Weapons</h4>
                                {rangedWeapons.length > 0 && ( <table className="weapon-stats-table"><thead><tr><th>Ranged</th><th>Range</th><th>A</th><th>BS</th><th>S</th><th>AP</th><th>D</th><th>Keywords</th></tr></thead><tbody>{rangedWeapons.map(w => <WeaponStats key={w.id} weapon={w} />)}</tbody></table> )}
                                {meleeWeapons.length > 0 && ( <table className="weapon-stats-table" style={{marginTop: '1rem'}}><thead><tr><th>Melee</th><th>Range</th><th>A</th><th>WS</th><th>S</th><th>AP</th><th>D</th><th>Keywords</th></tr></thead><tbody>{meleeWeapons.map(w => <WeaponStats key={w.id} weapon={w} />)}</tbody></table> )}
                            </div>
                        )}
                    </>
                )}
                {activeTab === 'options' && (
                    <>
                        {unit.wargear_options?.length > 0 && (
                            <div className="detail-section">
                                <h4>Wargear Options</h4>
                                {unit.wargear_options.map(option => <WargearLoadoutOption key={option.id} loadout={option} isSelected={wargearSelection.loadoutId === option.id} onSelectLoadout={handleWargearLoadoutChange} onSubSelectWargear={handleWargearSubSelectChange} currentSubSelections={wargearSelection.sub_selections} />)}
                            </div>
                        )}
                        {isEnhancementEligible && (
                            <div className="detail-section">
                                <h4>Enhancements</h4>
                                {!selectedDetachment ? <p>Select a Detachment...</p> :
                                <div className="enhancements-list">
                                    <label className={`enhancement-option ${!unit.current_enhancement ? 'selected' : ''}`} onClick={() => handleEnhancementChange(null)}>
                                        <input type="radio" name="enhancement" checked={!unit.current_enhancement} readOnly/><div className="enhancement-details"><span className="enhancement-name">-- None --</span></div>
                                    </label>
                                    {availableEnhancements.map(enh => (
                                        <label key={enh.id} className={`enhancement-option ${unit.current_enhancement?.id === enh.id ? 'selected' : ''}`} onClick={() => handleEnhancementChange(enh)}>
                                            <input type="radio" name="enhancement" checked={unit.current_enhancement?.id === enh.id} readOnly/><div className="enhancement-details"><span className="enhancement-name">{enh.name} [{enh.cost} pts]</span></div>
                                        </label>
                                    ))}
                                </div>
                                }
                            </div>
                        )}
                    </>
                )}
                {activeTab === 'rules' && (
                     <div className="detail-section">
                        {selectedDetachment ? (
                            // --- UPDATED: Wrapped in a rule-card div ---
                            <div className="rule-card">
                                <div className="rule-card-header">Detachment Rule</div>
                                <div className="rule-card-body">
                                    <p className="rule-name">{selectedDetachment.name}</p>
                                    <p className="rule-text">{selectedDetachment.rule}</p>
                                </div>
                            </div>
                        ) : (
                            <p><i>Select a Detachment to see its rule.</i></p>
                        )}

                        {unit.current_enhancement && (
                            // --- UPDATED: Wrapped in a rule-card div ---
                            <div className="rule-card">
                                <div className="rule-card-header">Enhancement Rule</div>
                                <div className="rule-card-body">
                                    <p className="rule-name">{unit.current_enhancement.name}</p>
                                    <p className="rule-text">{unit.current_enhancement.rule}</p>
                                </div>
                            </div>
                        )}
                        <hr style={{borderColor: '#4a4f5a', margin: '20px 0'}} />
                        <p><i>Unit abilities and other rules will be displayed here in a future update.</i></p>
                    </div>
                )}
                {activeTab === 'stratagems' && (
                    <div className="detail-section stratagems-grid">
                        {relevantStratagems.length > 0 ? (relevantStratagems.map(strat => <StratagemCard key={strat.id} strat={strat} />)) : (<p><i>No relevant Stratagems found for this unit with the current detachment.</i></p>)}
                    </div>
                )}
            </div>
        </div>
    );
}

export default UnitDetailView;
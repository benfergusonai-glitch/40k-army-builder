import React, { useState, useEffect, useMemo } from 'react';
import './UnitDetailView.css';
import { useArmy } from '../context/ArmyContext';
import { useGameData } from '../context/GameDataContext';
import BattlefieldRoleIcon from './BattlefieldRoleIcon';
import WeaponStats from './WeaponStats';
import WargearLoadoutOption from './WargearLoadoutOption';

function RuleCard({ title, category, text }) {
    const formatRuleText = (text) => {
        if (!text || typeof text !== 'string') return '';
        const parts = text.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, index) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={index}>{part.slice(2, -2)}</strong>;
            }
            return part;
        });
    };

    return (
        <div className="rule-card">
            <div className="rule-card-header">
                <span className="rule-card-title">{title}</span>
                {category && <span className="rule-card-category">{category}</span>}
            </div>
            <div className="rule-card-body">
                <p className="rule-text">{formatRuleText(text)}</p>
            </div>
        </div>
    );
}

function StratagemCard({ strat, isUsable }) {
    const typeToClassName = (type) => {
        return type ? `type-${type.toLowerCase().replace(/\s+/g, '-')}` : '';
    };

    const cardClasses = [
        'stratagem-card',
        typeToClassName(strat.type),
        !isUsable ? 'disabled' : ''
    ].join(' ');

    return (
        <div className={cardClasses} title={!isUsable ? 'Selected unit does not meet keyword requirements' : ''}>
            <div className="stratagem-header">
                <span className="stratagem-name">{strat.name}</span>
                <span className="stratagem-cost">{strat.cost}</span>
            </div>
            <div className="stratagem-body">
                <div className="stratagem-rule-section">
                    <div className="stratagem-meta">
                        <span className="stratagem-source">{strat.source}</span>
                        <span className="stratagem-type">{strat.type}</span>
                    </div>
                    <p><strong>WHEN:</strong> {strat.rules.when}</p>
                    <p><strong>TARGET:</strong> {strat.rules.target}</p>
                    {strat.rules.effect && <p><strong>EFFECT:</strong> {strat.rules.effect}</p>}
                </div>
            </div>
        </div>
    );
}

function OptionCard({ title, subtitle, isSelected, onClick }) {
    return (
        <div className={`option-card ${isSelected ? 'selected' : ''}`} onClick={onClick}>
            <div className="option-card-header">
                <span className="radio-indicator"></span>
                <div className="option-card-titles">
                    <span className="option-card-title">{title}</span>
                    {subtitle && <span className="option-card-subtitle">{subtitle}</span>}
                </div>
            </div>
        </div>
    );
}

function OverviewItem({ label, value }) {
    if (!value) return null;
    return (
        <div className="overview-item">
            <div className="overview-label">{label}</div>
            <div className="overview-value">{value}</div>
        </div>
    );
}

function UnitDetailView() {
    const { army, selectedUnitId, updateUnitWargearSelection, updateUnitEnhancement, selectedDetachment, selectedChapter } = useArmy();
    const { allWeapons, allEnhancements, allStratagems, allCommonRules } = useGameData();
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
    
    const armyStratagems = useMemo(() => {
        if (!selectedDetachment) return [];
        return allStratagems.filter(strat => 
            (strat.detachment_id === selectedDetachment.id) || (strat.source === 'Adeptus Astartes')
        );
    }, [selectedDetachment, allStratagems]);

    const coreStratagems = useMemo(() => {
        return allStratagems.filter(strat => strat.source === 'Core');
    }, [allStratagems]);

    const isStratagemUsable = (strat) => {
        if (!unit) return false;
        if (!strat.keyword_requirements || strat.keyword_requirements.length === 0) return true;
        
        const unitKeywords = [...(unit.keywords || []), ...(unit.faction_keywords || [])];
        return strat.keyword_requirements.some(req => unitKeywords.includes(req));
    };
    
    useEffect(() => {
        if (selectedUnitId) {
            setActiveTab('profile');
        }
    }, [selectedUnitId]);

    useEffect(() => {
        if (unit) {
            setWargearSelection(unit.wargear_selection || { loadoutId: unit.wargear_options?.[0]?.id || null, sub_selections: {} });
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
    
    const getFinalWeapons = () => {
        if (!unit) return [];
        const currentLoadout = unit.wargear_options?.find(opt => opt.id === (wargearSelection.loadoutId || unit.wargear_selection?.loadoutId));
        const currentSubSelections = wargearSelection.sub_selections || unit.wargear_selection?.sub_selections || {};
        
        let weaponObjects = [];
        
        (currentLoadout?.default_items || unit.weapon_ids || []).forEach(weaponId => {
            const baseWeapon = allWeapons[weaponId];
            if (baseWeapon) weaponObjects.push(baseWeapon);
        });

        if (currentLoadout?.sub_options) {
            for (const subOption of currentLoadout.sub_options) {
                const selectedChoiceId = currentSubSelections[subOption.option_id];
                const choice = subOption.choices.find(c => c.item_id === selectedChoiceId);
                if (choice) {
                    const baseWeapon = allWeapons[choice.item_id];
                    if (baseWeapon) {
                        const finalWeapon = { ...baseWeapon };
                        if (baseWeapon.profiles && choice.stat_overrides) {
                            finalWeapon.profiles = baseWeapon.profiles.map(p => ({ ...p, ...choice.stat_overrides }));
                        } else if (choice.stat_overrides) {
                            Object.assign(finalWeapon, choice.stat_overrides);
                        }
                        weaponObjects.push(finalWeapon);
                    }
                }
            }
        }
        return weaponObjects.filter(Boolean);
    };

    const allUnitWeapons = getFinalWeapons();
    const rangedWeapons = allUnitWeapons.flatMap(w => w.profiles ? w.profiles.map(p => ({...p, mainName: w.name})) : (w.range !== 'Melee' ? {...w, mainName: w.name} : [])).filter(Boolean);
    const meleeWeapons = allUnitWeapons.flatMap(w => w.profiles ? [] : (w.range === 'Melee' ? {...w, mainName: w.name} : [])).filter(Boolean);

    if (!unit) { return <div className="unit-detail-view"><div className="unit-detail-placeholder"><p>Select a unit from your army to see its details.</p></div></div>; }
    
    const stats = unit.stats || {};
    const renderAbilities = (abilityIds, abilityData, category) => {
        if (!abilityIds || abilityIds.length === 0) return null;
    
        const abilitiesToRender = abilityIds
            .map(id => ({ id, ...abilityData[id] }))
            .filter(ability => ability.name && ability.rule);
    
        if (abilitiesToRender.length === 0) return null;
    
        return abilitiesToRender.map(ability => (
            <RuleCard key={ability.id} title={ability.name} text={ability.rule} category={`${category} Ability`} />
        ));
    };

    const overviewData = {
        keywords: unit.keywords.join(', '),
        factionKeywords: unit.faction_keywords ? unit.faction_keywords.join(', ') : '',
        // --- MODIFIED: Reads from the new 'army_rules' array ---
        armyRule: [
            ...(selectedChapter?.army_rules?.map(rule => rule.name) || []),
            ...(unit.abilities?.faction?.map(id => allCommonRules[id]?.name).filter(Boolean) || [])
        ].filter(Boolean).join(', '),
        detachmentRule: selectedDetachment?.rules?.map(rule => rule.name).join(', ') || '',
        abilities: unit.abilities?.other?.map(ability => ability.name).join(', ') || '',
        enhancement: unit.current_enhancement?.name || ''
    };

    const WeaponTables = () => (
        <div className="detail-section">
            <h4>Weapons</h4>
            {rangedWeapons.length > 0 ? ( <table className="weapon-stats-table"><thead><tr><th>Ranged</th><th>Range</th><th>A</th><th>BS</th><th>S</th><th>AP</th><th>D</th><th>Keywords</th></tr></thead><tbody>{rangedWeapons.map((w, i) => <WeaponStats key={`${w.mainName}-${w.name}-${i}`} weapon={w} />)}</tbody></table> ) : <p>No Ranged Weapons equipped.</p>}
            {meleeWeapons.length > 0 && ( <table className="weapon-stats-table" style={{marginTop: '1rem'}}><thead><tr><th>Melee</th><th>Range</th><th>A</th><th>WS</th><th>S</th><th>AP</th><th>D</th><th>Keywords</th></tr></thead><tbody>{meleeWeapons.map((w,i) => <WeaponStats key={`${w.mainName}-${i}`} weapon={w} />)}</tbody></table> )}
        </div>
    );

    return (
        <div className="unit-detail-view">
            <div className="detail-header"><h3><BattlefieldRoleIcon role={unit.role} /> {unit.name}</h3></div>
            <div className="tab-nav">
                <button className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>Profile</button>
                <button className={`tab-button ${activeTab === 'options' ? 'active' : ''}`} onClick={() => setActiveTab('options')}>Options</button>
                <button className={`tab-button ${activeTab === 'rules' ? 'active' : ''}`} onClick={() => setActiveTab('rules')}>Rules</button>
                <button className={`tab-button ${activeTab === 'armyStrats' ? 'active' : ''}`} onClick={() => setActiveTab('armyStrats')}>Army Strats</button>
                <button className={`tab-button ${activeTab === 'coreStrats' ? 'active' : ''}`} onClick={() => setActiveTab('coreStrats')}>Core Strats</button>
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
                        </div>

                        <WeaponTables />
                        
                        <div className="overview-list">
                            <OverviewItem label="Keywords" value={overviewData.keywords} />
                            <OverviewItem label="Faction Keywords" value={overviewData.factionKeywords} />
                            <OverviewItem label="Army Rule" value={overviewData.armyRule} />
                            <OverviewItem label="Detachment Rule" value={overviewData.detachmentRule} />
                            <OverviewItem label="Abilities" value={overviewData.abilities} />
                            <OverviewItem label="Enhancement" value={overviewData.enhancement} />
                        </div>
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
                                    <OptionCard title="-- None --" isSelected={!unit.current_enhancement} onClick={() => handleEnhancementChange(null)} />
                                    {availableEnhancements.map(enh => ( <OptionCard key={enh.id} title={enh.name} subtitle={`[${enh.cost} pts]`} isSelected={unit.current_enhancement?.id === enh.id} onClick={() => handleEnhancementChange(enh)} /> ))}
                                </div>
                                }
                            </div>
                        )}
                        <hr style={{borderColor: '#4a4f5a', margin: '20px 0'}} />
                        <WeaponTables />
                    </>
                )}
                {activeTab === 'rules' && (
                     <div className="detail-section stratagems-grid">
                        {/* --- MODIFIED: Maps over the new 'army_rules' array --- */}
                        {selectedChapter?.army_rules?.map(rule => (
                            <RuleCard key={rule.name} title={rule.name} text={rule.definition} category="Army Rule" />
                        ))}

                        {selectedDetachment?.rules?.map(rule => (
                            <RuleCard key={rule.name} title={rule.name} text={rule.definition} category="Detachment Rule" />
                        ))}

                        {unit.current_enhancement && (
                            <RuleCard title={unit.current_enhancement.name} text={unit.current_enhancement.rule} category="Enhancement" />
                        )}
                        
                        {unit.abilities && (
                            <>
                                {renderAbilities(unit.abilities.faction, allCommonRules, 'Faction')}
                                
                                {unit.abilities.other && unit.abilities.other.length > 0 && 
                                    unit.abilities.other.map(ability => (
                                        <RuleCard key={ability.name} title={ability.name} text={ability.rule} category="Unique Ability" />
                                    ))
                                }

                                {renderAbilities(unit.abilities.core, allCommonRules, 'Core')}
                            </>
                        )}
                    </div>
                )}
                {activeTab === 'armyStrats' && (
                    <div className="detail-section stratagems-grid">
                        {!selectedDetachment 
                            ? (<p><i>Select a Detachment to see its Stratagems.</i></p>)
                            : (armyStratagems.map(strat => <StratagemCard key={strat.id} strat={strat} isUsable={isStratagemUsable(strat)} />))
                        }
                    </div>
                )}
                {activeTab === 'coreStrats' && (
                    <div className="detail-section stratagems-grid">
                        {coreStratagems.map(strat => <StratagemCard key={strat.id} strat={strat} isUsable={isStratagemUsable(strat)} />)}
                    </div>
                )}
            </div>
        </div>
    );
}

export default UnitDetailView;
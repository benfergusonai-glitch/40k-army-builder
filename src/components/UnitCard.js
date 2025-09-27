import React, { useState } from 'react';
import './UnitCard.css';
import WeaponProfile from './WeaponProfile';
import EnhancementSelector from './EnhancementSelector';
import WargearModal from './WargearModal';

function UnitCard({
  unit,
  allWeapons,
  onRemoveUnit,
  onDuplicateUnit, // <-- Accept the new prop
  availableEnhancements,
  onAssignEnhancement,
  assignedEnhancementIds,
  onWargearChange,
  currentCount,
  maxCount,
}) {
  const [isRuleVisible, setIsRuleVisible] = useState(false);
  const [isWargearModalOpen, setWargearModalOpen] = useState(false);
  
  const getPoints = (unit) => {
    return (unit.points && unit.points.length > 0) ? unit.points[0].cost : 0;
  };
  const getStats = (unit) => {
    return unit.stats || {};
  };

  const basePoints = getPoints(unit);
  const enhancementPoints = unit.enhancement ? unit.enhancement.cost : 0;
  const { m, t, sv, w, ld, oc } = getStats(unit);
  const canTakeEnhancement = unit.keywords.includes('CHARACTER') && !unit.isEpicHero;
  const hasWargearOptions = unit.wargear_options && unit.wargear_options.length > 0;

  return (
    <>
      <div className="unit-card">
        <div className="card-header">
          <h4 className="unit-name">
            {unit.name} ({currentCount}/{maxCount})
            <span className="unit-points">
              [{basePoints}{enhancementPoints > 0 ? ` + ${enhancementPoints}` : ''} pts]
            </span>
          </h4>
          <div className="header-buttons">
            {hasWargearOptions && (
              <button onClick={() => setWargearModalOpen(true)} className="customize-btn">Customize</button>
            )}
            {/* --- NEW BUTTON --- */}
            <button onClick={() => onDuplicateUnit(unit.instanceId)} className="duplicate-btn">Duplicate</button>
            <button onClick={() => onRemoveUnit(unit.instanceId)} className="remove-btn">Remove</button>
          </div>
        </div>
        {/* ... rest of the component is unchanged ... */}
        <div className="stats-grid">
          <div className="stat-item"><strong>M</strong><p>{m}</p></div>
          <div className="stat-item"><strong>T</strong><p>{t}</p></div>
          <div className="stat-item"><strong>SV</strong><p>{sv}</p></div>
          <div className="stat-item"><strong>W</strong><p>{w}</p></div>
          <div className="stat-item"><strong>LD</strong><p>{ld}</p></div>
          <div className="stat-item"><strong>OC</strong><p>{oc}</p></div>
        </div>
        {unit.weapon_ids && unit.weapon_ids.length > 0 && (
          <div className="weapon-section">
            {unit.weapon_ids.map(weaponId => {
              const weapon = Array.isArray(allWeapons) ? allWeapons.find(w => w.id === weaponId) : null;
              return weapon ? <WeaponProfile key={weapon.id} weapon={weapon} /> : null;
            })}
          </div>
        )}
        {unit.enhancement && (
          <div className="enhancement-details">
            <div className="enhancement-header">
              <strong>Enhancement: {unit.enhancement.name}</strong>
              <button className="rule-toggle-btn" onClick={() => setIsRuleVisible(!isRuleVisible)}>
                {isRuleVisible ? 'Hide Rule' : 'Show Rule'}
              </button>
            </div>
            {isRuleVisible && (
              <p className="enhancement-rule">{unit.enhancement.rule}</p>
            )}
          </div>
        )}
        {canTakeEnhancement && (
          <EnhancementSelector
            availableEnhancements={availableEnhancements}
            assignedEnhancement={unit.enhancement}
            onAssignEnhancement={(enhancementId) => onAssignEnhancement(unit.instanceId, enhancementId)}
            assignedEnhancementIds={assignedEnhancementIds}
          />
        )}
      </div>
      {isWargearModalOpen && (
        <WargearModal
          unit={unit}
          onClose={() => setWargearModalOpen(false)}
          onWargearChange={onWargearChange}
        />
      )}
    </>
  );
}

export default UnitCard;
import React from 'react';
import './UnitCard.css';

function UnitCard({ unit, onRemoveUnit, onOpenWargearModal, onOpenEnhancementsModal }) {
  if (!unit) { return null; }

  const stats = unit.stats || {};

  const getUnitDisplayPoints = (unit) => {
    let baseCost = Array.isArray(unit.points) ? (unit.points[0]?.cost || 0) : (unit.points || 0);
    let enhancementCost = unit.current_enhancement ? unit.current_enhancement.cost : 0;
    return baseCost + enhancementCost;
  };

  const isEnhancementEligible = unit.role === 'Character' && !unit.keywords.includes('EPIC HERO');

  return (
    <div className="unit-card">
      <div className="unit-card-header">
        <h4>{unit.name} - {getUnitDisplayPoints(unit)} pts</h4>
        <div className="unit-card-actions">
          <button
            className="action-button"
            onClick={() => onOpenWargearModal(unit)}
          >
            Wargear
          </button>
          <button
            className="action-button"
            onClick={() => onOpenEnhancementsModal(unit)}
            disabled={!isEnhancementEligible}
          >
            Enhancements
          </button>
          <button onClick={() => onRemoveUnit(unit.id)} className="action-button remove">Remove</button>
        </div>
      </div>
      
      <div className="unit-stats-grid">
        <div className="stat-header">M</div>
        <div className="stat-header">T</div>
        <div className="stat-header">SV</div>
        <div className="stat-header">W</div>
        <div className="stat-header">LD</div>
        <div className="stat-header">OC</div>
        <div className="stat-value">{stats.m || '-'}</div>
        <div className="stat-value">{stats.t || '-'}</div>
        <div className="stat-value">{stats.sv || '-'}</div>
        <div className="stat-value">{stats.w || '-'}</div>
        <div className="stat-value">{stats.ld || '-'}</div>
        <div className="stat-value">{stats.oc || '-'}</div>
      </div>

      {unit.current_wargear && (
        <div className="unit-wargear-display">
          <strong>Wargear:</strong> {unit.current_wargear.description}
        </div>
      )}
      
      {unit.current_enhancement && (
        <div className="unit-enhancement-display">
          <strong>Enhancement:</strong> {unit.current_enhancement.name} (+{unit.current_enhancement.cost} pts)
        </div>
      )}
    </div>
  );
}

export default UnitCard;
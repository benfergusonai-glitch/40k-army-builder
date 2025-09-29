import React from 'react';
import './UnitCard.css';
import { useArmy } from '../context/ArmyContext';
import { getUnitDisplayPoints } from '../utils/pointUtils';
import BattlefieldRoleIcon from './BattlefieldRoleIcon';
import WeaponStats from './WeaponStats'; 

function UnitCard({ unit, onRemoveUnit, weapons }) {
  const { handleOpenWargearModal, handleOpenEnhancementsModal } = useArmy();

  if (!unit) { return null; }

  const stats = unit.stats || {};

  const getCardTotalPoints = (unit) => {
    let baseCost = getUnitDisplayPoints(unit);
    let enhancementCost = unit.current_enhancement ? unit.current_enhancement.cost : 0;
    return baseCost + enhancementCost;
  };

  const isEnhancementEligible = unit.role === 'Character' && !unit.keywords.includes('EPIC HERO');

  // --- CORRECTED LOGIC ---
  // 1. Get all weapon objects using the 'weapon_ids' property.
  const allWeapons = unit.weapon_ids?.map(id => weapons[id]).filter(Boolean) || [];
  
  // 2. Filter weapons based on the 'range' property.
  const rangedWeapons = allWeapons.filter(w => w.range !== 'Melee');
  const meleeWeapons = allWeapons.filter(w => w.range === 'Melee');

  return (
    <div className="unit-card">
      <div className="unit-card-header">
        <h4>
          <BattlefieldRoleIcon role={unit.role} />
          {unit.name} - {getCardTotalPoints(unit)} pts
        </h4>
        <div className="unit-card-actions">
          <button className="action-button" onClick={() => handleOpenWargearModal(unit)}>Wargear</button>
          <button className="action-button" onClick={() => handleOpenEnhancementsModal(unit)} disabled={!isEnhancementEligible}>Enhancements</button>
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

      <div className="unit-weapons-section">
        {rangedWeapons.length > 0 && (
          <table className="weapon-stats-table">
            <thead>
              <tr>
                <th>Ranged Weapons</th>
                <th>Range</th>
                <th>A</th>
                <th>BS</th>
                <th>S</th>
                <th>AP</th>
                <th>D</th>
                <th>Keywords</th>
              </tr>
            </thead>
            <tbody>
              {rangedWeapons.map(weapon => <WeaponStats key={weapon.id} weapon={weapon} />)}
            </tbody>
          </table>
        )}

        {meleeWeapons.length > 0 && (
          <table className="weapon-stats-table">
            <thead>
              <tr>
                <th>Melee Weapons</th>
                <th>Range</th>
                <th>A</th>
                <th>WS</th>
                <th>S</th>
                <th>AP</th>
                <th>D</th>
                <th>Keywords</th>
              </tr>
            </thead>
            <tbody>
              {meleeWeapons.map(weapon => <WeaponStats key={weapon.id} weapon={weapon} />)}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default UnitCard;
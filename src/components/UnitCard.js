import React from 'react';
import './UnitCard.css';
import { useArmy } from '../context/ArmyContext';
import { getUnitDisplayPoints } from '../utils/pointUtils';
import BattlefieldRoleIcon from './BattlefieldRoleIcon';
import WeaponStats from './WeaponStats';

// The component now accepts 'isValid' as a prop
function UnitCard({ unit, onRemoveUnit, weapons, isValid }) {
  // It no longer needs to get isUnitValid or selectedChapter from the context
  const { handleOpenWargearModal, handleOpenEnhancementsModal } = useArmy();

  if (!unit) { return null; }
  
  const stats = unit.stats || {};

  const getCardTotalPoints = (unit) => {
    let baseCost = getUnitDisplayPoints(unit);
    let enhancementCost = unit.current_enhancement ? unit.current_enhancement.cost : 0;
    return baseCost + enhancementCost;
  };

  const currentLoadout = unit.wargear_options?.find(
    opt => opt.id === unit.wargear_selection?.loadoutId
  );

  const getWeaponIdsFromSelection = () => {
    if (!currentLoadout) return unit.weapon_ids || [];
    let finalWeaponIds = [...(currentLoadout.default_items || [])];
    if (currentLoadout.sub_options && unit.wargear_selection.sub_selections) {
      for (const subOption of currentLoadout.sub_options) {
        const selectedChoice = unit.wargear_selection.sub_selections[subOption.option_id];
        if (selectedChoice) {
          finalWeaponIds.push(selectedChoice);
        }
      }
    }
    return finalWeaponIds;
  };

  const weaponIds = getWeaponIdsFromSelection();
  const allWeapons = weaponIds.map(id => weapons[id]).filter(Boolean);
  const rangedWeapons = allWeapons.filter(w => w.range !== 'Melee');
  const meleeWeapons = allWeapons.filter(w => w.range === 'Melee');
  const isEnhancementEligible = unit.role === 'Character' && !unit.keywords.includes('EPIC HERO');

  return (
    <div className={`unit-card ${!isValid ? 'invalid' : ''}`}>
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
      
      {!isValid && (
        <div className="unit-validation-warning">
          Warning: This unit is not a valid choice for the selected Chapter.
        </div>
      )}

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

      {currentLoadout && (
        <div className="unit-wargear-display">
          <strong>Wargear:</strong> {currentLoadout.description}
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
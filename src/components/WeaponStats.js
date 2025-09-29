import React from 'react';
import './WeaponStats.css';

function WeaponStats({ weapon }) {
  if (!weapon) {
    return null;
  }

  return (
    <tr className="weapon-row">
      <td className="weapon-name">{weapon.name}</td>
      <td>{weapon.range}</td>
      <td>{weapon.A}</td>
      {/* This now correctly displays BS for ranged or WS for melee */}
      <td>{weapon.BS || weapon.WS}</td>
      <td>{weapon.S}</td>
      <td>{weapon.AP}</td>
      <td>{weapon.D}</td>
      <td className="weapon-keywords">{weapon.keywords}</td>
    </tr>
  );
}

export default WeaponStats;
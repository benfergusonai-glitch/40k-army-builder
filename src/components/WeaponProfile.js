import React from 'react';
import './WeaponProfile.css';

function WeaponProfile({ weapon }) {
  // We now destructure WS as well as BS.
  const { name, range, A, BS, WS, S, AP, D } = weapon;

  return (
    <div className="weapon-profile">
      <div className="weapon-name">{name}</div>
      <div className="weapon-stats-grid">
        <div className="weapon-stat-item"><strong>Range</strong><p>{range}</p></div>
        <div className="weapon-stat-item"><strong>A</strong><p>{A}</p></div>
        
        {/* --- NEW LOGIC START --- */}
        {/* If the range is 'Melee', display the WS stat. */}
        {range === 'Melee' ? (
          <div className="weapon-stat-item"><strong>WS</strong><p>{WS}</p></div>
        ) : (
        /* Otherwise, display the BS stat. */
          <div className="weapon-stat-item"><strong>BS</strong><p>{BS}</p></div>
        )}
        {/* --- NEW LOGIC END --- */}

        <div className="weapon-stat-item"><strong>S</strong><p>{S}</p></div>
        <div className="weapon-stat-item"><strong>AP</strong><p>{AP}</p></div>
        <div className="weapon-stat-item"><strong>D</strong><p>{D}</p></div>
      </div>
    </div>
  );
}

export default WeaponProfile;
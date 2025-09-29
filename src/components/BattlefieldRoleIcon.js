import React from 'react';

// This component now uses more reliable Unicode characters instead of emojis.
// The cases have been updated to match the canonical names generated in App.js.
function BattlefieldRoleIcon({ role }) {
  const getIcon = () => {
    switch (role) { // No longer needs toLowerCase() as the role is now clean
      case 'Epic Hero':
        return '★'; // Black Star
      case 'Character':
        return '☆'; // White Star
      case 'Battleline':
        return '⭡'; // Arrow pointing up
      case 'Infantry':
        return '⮅'; // Twin Arrows pointing up
      case 'Mounted':
        return '⮣'; // Arrow pointing up and to the right
      case 'Vehicle':
        return '⮝'; // Arrow pointing up
      case 'Transport':
          return '⮞'; // Arrow pointing right
      case 'Fortification':
          return '⛫'; // Castle
      default:
        return '?'; // Simple question mark
    }
  };

  return <span title={role} style={{ marginRight: '8px', fontFamily: 'sans-serif' }}>{getIcon()}</span>;
}

export default BattlefieldRoleIcon;
/**
 * @fileoverview ArmyConstraints.js: Displays a summary of army composition.
 * REFACTOR: This component no longer displays hard limits. It now shows the army's role
 * composition and validates the minimum character requirement.
 * Principle: Aligning UI with Core Logic.
 */
import React from 'react';
import './ArmyConstraints.css';
// --- UPDATED: Import the new validation and remove the old limit constant ---
import { useArmy } from '../context/ArmyContext';
import { countBattlefieldRoles, hasMinimumCharacter } from '../utils/rulesUtils';

function ArmyConstraints() {
    const { army } = useArmy(); 
    
    // --- NEW: Check if the minimum character requirement is met ---
    const characterMinimumMet = hasMinimumCharacter(army);
    const roleCounts = countBattlefieldRoles(army);

    // Get an array of [role, count] pairs for iteration
    const roles = Object.entries(roleCounts);

    return (
        <div className="army-constraints-display">
            {/* --- NEW: Display for the minimum character rule --- */}
            <div className={`constraint-item ${characterMinimumMet ? 'limit-ok' : 'limit-error'}`}>
                <span className="role-name">Army Requirement:</span>
                <span className="role-count">
                    {characterMinimumMet ? '✔️ 1+ Character Unit' : '⚠️ 1 Character Required'}
                </span>
            </div>

            <hr style={{borderColor: '#4a4a4a', margin: '10px 0'}}/>

            {/* --- UPDATED: This section now just shows a summary, not limits --- */}
            <div className="constraints-list">
                {roles
                    .sort(([roleA], [roleB]) => roleA.localeCompare(roleB))
                    .map(([role, count]) => {
                        if (count === 0) return null; // Don't show roles with 0 units
                        return (
                            <div key={role} className="constraint-item">
                                <span className="role-name">{role}:</span>
                                <span className="role-count">
                                    {count}
                                </span>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
}

export default ArmyConstraints;
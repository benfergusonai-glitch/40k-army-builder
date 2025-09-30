/**
 * @fileoverview Utility functions for validating army list legality and constraints.
 * REFACTOR: The validation logic has been completely overhauled to support datasheet-based limits
 * instead of role-based limits, as per the game's core rules.
 */

/**
 * Defines the maximum number of times a single datasheet can be taken, based on its role.
 * A value of 'undefined' means there is no datasheet-specific limit for that role.
 */
export const DATASHEET_LIMITS_BY_ROLE = {
    'Epic Hero': 1,
    'Character': 3,
    'Battleline': 6,
    'Infantry': 3,
    'Vehicle': 3,
    'Mounted': 3,
    'Transport': 6, // Dedicated Transports fall under this role
    'Fortification': 3,
};

/**
 * Checks if adding a specific unit would violate the datasheet limit for its role.
 * For example, you can only have 3 of the same non-Epic Hero "Character" datasheet.
 * @param {object} unitToAdd - The unit being considered for addition.
 * @param {Array<object>} army - The current army list.
 * @returns {boolean} - True if adding the unit is valid, false if it exceeds the limit.
 */
export function isDatasheetLimitValid(unitToAdd, army) {
    const limit = DATASHEET_LIMITS_BY_ROLE[unitToAdd.role];

    // If there is no defined limit for this role, it's always valid.
    if (limit === undefined) {
        return true;
    }

    // Count how many times this exact datasheet (by name) is already in the army.
    const currentCount = army.filter(unit => unit.name === unitToAdd.name).length;

    // The addition is valid if the current count is less than the limit.
    return currentCount < limit;
}

/**
 * Checks if the army meets the minimum requirement of at least one Character unit.
 * @param {Array<object>} army - The current army list.
 * @returns {boolean} - True if the minimum is met, false otherwise.
 */
export function hasMinimumCharacter(army) {
    // An army of 0 units does not meet the requirement.
    if (army.length === 0) {
        return false;
    }
    // Check if any unit in the army has the "Character" keyword. This covers both Characters and Epic Heros.
    return army.some(unit => unit.keywords && unit.keywords.includes('CHARACTER'));
}


/**
 * Determines if a unit is a valid choice based on the currently selected Chapter.
 * This function is used to display the warning on a UnitCard.
 * (This function remains unchanged from our last fix).
 */
export function isUnitChapterValid(unit, selectedChapter) {
    if (unit.chapter_id) {
        if (!selectedChapter || unit.chapter_id !== selectedChapter.id) {
            return false;
        }
    }
    return true;
}

/**
 * (This function is no longer used for validation but kept for the UI display)
 * Calculates the current count of units for each Battlefield Role in the army.
 */
export function countBattlefieldRoles(army) {
    const roleCounts = {};
    army.forEach(unit => {
        const role = unit.role;
        roleCounts[role] = (roleCounts[role] || 0) + 1;
    });
    return roleCounts;
}
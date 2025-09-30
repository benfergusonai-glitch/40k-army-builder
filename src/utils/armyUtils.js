/**
 * @typedef {import('../context/GameDataContext').UnitData} UnitData
 * @typedef {import('../context/ArmyContext').ArmyUnit} ArmyUnit
 */

/**
 * Calculates the base display cost for a unit from its data.
 * This is used in the unit selection list.
 * @param {UnitData} unit - The unit data object.
 * @returns {number} The base point cost of the unit.
 */
export const getUnitDisplayCost = (unit) => {
    if (!unit) return 0;
    if (Array.isArray(unit.points)) {
        return unit.points[0]?.cost || 0;
    }
    return unit.points || 0;
};

/**
 * Calculates the total point cost for a single unit *instance* in the army,
 * including its base cost and any selected enhancement. This is used in the army list display.
 * @param {ArmyUnit} unit - The army unit instance, which may have a `current_enhancement`.
 * @returns {number} The total point cost of the unit instance.
 */
export const calculateUnitInstanceCost = (unit) => {
    const baseCost = getUnitDisplayCost(unit);
    const enhancementCost = unit.current_enhancement ? unit.current_enhancement.cost : 0;
    return parseInt(baseCost + enhancementCost, 10) || 0;
};

/**
 * Calculates the total point cost for an entire army list by summing
 * the cost of each individual unit instance.
 * @param {ArmyUnit[]} army - An array of army unit objects.
 * @returns {number} The total point cost of the army.
 */
export const calculateTotalArmyPoints = (army) => {
    if (!Array.isArray(army)) {
        return 0;
    }
    return army.reduce((total, unit) => total + calculateUnitInstanceCost(unit), 0);
};
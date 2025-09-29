/**
 * Calculates the base display points for a given unit.
 * If the unit has a points array (for different model counts),
 * it returns the cost of the first entry.
 * @param {object} unit - The unit object.
 * @returns {number} The point cost of the unit.
 */
export const getUnitDisplayPoints = (unit) => {
  if (Array.isArray(unit.points)) {
    // Return the cost of the first option in the points array, or 0 if it's malformed
    return unit.points[0]?.cost || 0;
  }
  // Return the simple point value, or 0 if it's not defined
  return unit.points || 0;
};
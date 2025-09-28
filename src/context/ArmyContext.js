import React, { createContext, useState, useContext, useEffect } from 'react';

const ArmyContext = createContext();

export const useArmy = () => {
    return useContext(ArmyContext);
};

export const ArmyProvider = ({ children }) => {
    const [army, setArmy] = useState([]);
    const [totalPoints, setTotalPoints] = useState(0);

    useEffect(() => {
        const calculateTotalPoints = () => {
            return army.reduce((total, unit) => {
                let unitCost = Array.isArray(unit.points) ? (unit.points[0]?.cost || 0) : (unit.points || 0);
                if (unit.current_enhancement) {
                    unitCost += unit.current_enhancement.cost;
                }
                return total + parseInt(unitCost, 10);
            }, 0);
        };
        setTotalPoints(calculateTotalPoints());
    }, [army]);

    const addUnit = (unitData) => {
        const deepCopiedUnit = JSON.parse(JSON.stringify(unitData));
        const newUnit = {
            ...deepCopiedUnit,
            id: `${deepCopiedUnit.name}-${Date.now()}`,
            current_wargear: deepCopiedUnit.wargear_options ? deepCopiedUnit.wargear_options[0] : null,
            current_enhancement: null
        };
        setArmy(prevArmy => [...prevArmy, newUnit]);
    };

    const removeUnit = (unitId) => {
        setArmy(prevArmy => prevArmy.filter(unit => unit.id !== unitId));
    };

    const updateUnitWargear = (unitId, newWargear) => {
        setArmy(prevArmy =>
            prevArmy.map(unit => {
                if (unit.id === unitId) {
                    return { ...unit, current_wargear: newWargear };
                }
                return unit;
            })
        );
    };

    const updateUnitEnhancement = (unitId, newEnhancement) => {
        setArmy(prevArmy =>
            prevArmy.map(unit => {
                if (unit.id === unitId) {
                    return { ...unit, current_enhancement: newEnhancement };
                }
                return unit;
            })
        );
    };

    const value = {
        army,
        totalPoints,
        addUnit,
        removeUnit,
        updateUnitWargear,
        updateUnitEnhancement,
    };

    return (
        <ArmyContext.Provider value={value}>
            {children}
        </ArmyContext.Provider>
    );
};
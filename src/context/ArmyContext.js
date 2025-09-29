import React, { createContext, useState, useContext, useEffect } from 'react';
import { getUnitDisplayPoints } from '../utils/pointUtils';

const ArmyContext = createContext();

export const useArmy = () => {
    return useContext(ArmyContext);
};

export const ArmyProvider = ({ children }) => {
    // Army list state
    const [army, setArmy] = useState([]);
    const [totalPoints, setTotalPoints] = useState(0);

    // --- NEW: Army configuration state ---
    const [selectedChapter, setSelectedChapter] = useState(null);
    const [selectedDetachment, setSelectedDetachment] = useState(null);

    // Modal state
    const [editingWargearUnit, setEditingWargearUnit] = useState(null);
    const [editingEnhancementUnit, setEditingEnhancementUnit] = useState(null);

    useEffect(() => {
        const calculateTotalPoints = () => {
            return army.reduce((total, unit) => {
                let unitCost = getUnitDisplayPoints(unit);
                if (unit.current_enhancement) {
                    unitCost += unit.current_enhancement.cost;
                }
                return total + parseInt(unitCost, 10);
            }, 0);
        };
        setTotalPoints(calculateTotalPoints());
    }, [army]);

    // --- NEW: Functions to manage army configuration ---
    const selectChapter = (chapter) => {
        setSelectedChapter(chapter);
        setSelectedDetachment(null); // Reset detachment when chapter changes
    };

    const selectDetachment = (detachment) => {
        setSelectedDetachment(detachment);
    };

    const addUnit = (unitData) => {
        const deepCopiedUnit = JSON.parse(JSON.stringify(unitData));
        const newUnit = {
            ...deepCopiedUnit,
            id: `${deepCopiedUnit.name}-${Date.now()}`,
            current_wargear: (deepCopiedUnit.wargear_options && deepCopiedUnit.wargear_options.length > 0) ? deepCopiedUnit.wargear_options[0] : null,
            current_enhancement: null
        };
        setArmy(prevArmy => [...prevArmy, newUnit]);
    };

    const removeUnit = (unitId) => {
        setArmy(prevArmy => prevArmy.filter(unit => unit.id !== unitId));
    };

    const updateUnitWargear = (unitId, newWargear) => {
        setArmy(prevArmy => prevArmy.map(unit => unit.id === unitId ? { ...unit, current_wargear: newWargear } : unit));
    };

    const updateUnitEnhancement = (unitId, newEnhancement) => {
        setArmy(prevArmy => prevArmy.map(unit => unit.id === unitId ? { ...unit, current_enhancement: newEnhancement } : unit));
    };

    const handleOpenWargearModal = (unit) => setEditingWargearUnit(unit);
    const handleCloseWargearModal = () => setEditingWargearUnit(null);
    const handleOpenEnhancementsModal = (unit) => setEditingEnhancementUnit(unit);
    const handleCloseEnhancementsModal = () => setEditingEnhancementUnit(null);

    const value = {
        army,
        totalPoints,
        addUnit,
        removeUnit,
        updateUnitWargear,
        updateUnitEnhancement,
        editingWargearUnit,
        editingEnhancementUnit,
        handleOpenWargearModal,
        handleCloseWargearModal,
        handleOpenEnhancementsModal,
        handleCloseEnhancementsModal,
        // --- NEW: Export configuration state and functions ---
        selectedChapter,
        selectedDetachment,
        selectChapter,
        selectDetachment,
    };

    return (
        <ArmyContext.Provider value={value}>
            {children}
        </ArmyContext.Provider>
    );
};
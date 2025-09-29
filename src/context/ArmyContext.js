import React, { createContext, useState, useContext, useEffect } from 'react';
import { getUnitDisplayPoints } from '../utils/pointUtils';

const ArmyContext = createContext();

export const useArmy = () => {
    return useContext(ArmyContext);
};

export const ArmyProvider = ({ children }) => {
    const [army, setArmy] = useState([]);
    const [totalPoints, setTotalPoints] = useState(0);
    const [selectedChapter, setSelectedChapter] = useState(null);
    const [selectedDetachment, setSelectedDetachment] = useState(null);
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

    const selectChapter = (chapter) => {
        setSelectedChapter(chapter);
        setSelectedDetachment(null); 
    };

    const selectDetachment = (detachment) => {
        setSelectedDetachment(detachment);
    };

    const addUnit = (unitData) => {
        const deepCopiedUnit = JSON.parse(JSON.stringify(unitData));
        const newUnit = {
            ...deepCopiedUnit,
            id: `${deepCopiedUnit.name}-${Date.now()}`,
            wargear_selection: (deepCopiedUnit.wargear_options && deepCopiedUnit.wargear_options.length > 0) 
                ? { loadoutId: deepCopiedUnit.wargear_options[0].id, sub_selections: {} } 
                : null,
            current_enhancement: null
        };
        setArmy(prevArmy => [...prevArmy, newUnit]);
    };

    const removeUnit = (unitId) => {
        setArmy(prevArmy => prevArmy.filter(unit => unit.id !== unitId));
    };

    const updateUnitWargearSelection = (unitId, newSelection) => {
        setArmy(prevArmy => prevArmy.map(unit => unit.id === unitId ? { ...unit, wargear_selection: newSelection } : unit));
    };

    const updateUnitEnhancement = (unitId, newEnhancement) => {
        setArmy(prevArmy => prevArmy.map(unit => unit.id === unitId ? { ...unit, current_enhancement: newEnhancement } : unit));
    };
    
    const isUnitValid = (unit) => {
        if (!unit.chapter_id) {
            return true;
        }
        if (selectedChapter) {
            return unit.chapter_id === selectedChapter.id;
        }
        return false;
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
        updateUnitWargearSelection,
        updateUnitEnhancement,
        editingWargearUnit,
        editingEnhancementUnit,
        handleOpenWargearModal,
        handleCloseWargearModal,
        handleOpenEnhancementsModal,
        handleCloseEnhancementsModal,
        selectedChapter,
        selectedDetachment,
        selectChapter,
        selectDetachment,
        isUnitValid,
    };

    return (
        <ArmyContext.Provider value={value}>
            {children}
        </ArmyContext.Provider>
    );
};
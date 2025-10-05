import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
import { getUnitDisplayPoints } from '../utils/pointUtils';
import { isUnitChapterValid as isUnitChapterValidFromRules } from '../utils/rulesUtils';

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
    const [selectedUnitId, setSelectedUnitId] = useState(null);

    // --- NEW: Logic to dynamically process the army for conditional keywords ---
    const processedArmy = useMemo(() => {
        if (!selectedChapter) return army;

        // Dark Angels: Add RAVENWING and DEATHWING keywords
        if (selectedChapter.id === 'dark_angels') {
            const deathwingKeywords = [
                'TERMINATOR', 'BLADEGUARD ANCIENT', 'BLADEGUARD VETERAN SQUAD', 
                'STERNGUARD VETERAN SQUAD', 'VANGUARD VETERAN SQUAD WITH JUMP PACKS',
                'LAND RAIDER', 'LAND RAIDER CRUSADER', 'LAND RAIDER REDEEMER', 
                'REPULSOR', 'REPULSOR EXECUTIONER', 'DREADNOUGHT'
            ];

            return army.map(unit => {
                // Create a mutable copy of keywords to avoid side effects
                const newKeywords = [...unit.keywords];
                let keywordsDidChange = false;

                // Check for RAVENWING criteria
                const isRavenwing = unit.keywords.includes('MOUNTED') || (unit.keywords.includes('VEHICLE') && unit.keywords.includes('FLY'));
                if (isRavenwing && !newKeywords.includes('RAVENWING')) {
                    newKeywords.push('RAVENWING');
                    keywordsDidChange = true;
                }

                // Check for DEATHWING criteria
                const isDeathwing = deathwingKeywords.some(dk => unit.keywords.includes(dk));
                if (isDeathwing && !newKeywords.includes('DEATHWING')) {
                    newKeywords.push('DEATHWING');
                    keywordsDidChange = true;
                }

                // If keywords were added, return a new unit object
                if (keywordsDidChange) {
                    return { ...unit, keywords: newKeywords };
                }
                
                // Otherwise, return the original unit
                return unit;
            });
        }

        // If another chapter is selected, ensure no DA keywords are present
        return army.map(unit => {
            if (unit.keywords.includes('RAVENWING') || unit.keywords.includes('DEATHWING')) {
                return {
                    ...unit,
                    keywords: unit.keywords.filter(kw => kw !== 'RAVENWING' && kw !== 'DEATHWING')
                };
            }
            return unit;
        });
    }, [army, selectedChapter]);


    useEffect(() => {
        const calculateTotalPoints = () => {
            return processedArmy.reduce((total, unit) => {
                let unitCost = getUnitDisplayPoints(unit);
                if (unit.current_enhancement) {
                    unitCost += unit.current_enhancement.cost;
                }
                return total + parseInt(unitCost, 10);
            }, 0);
        };
        setTotalPoints(calculateTotalPoints());
    }, [processedArmy]);

    const selectChapter = (chapter) => {
        setSelectedChapter(chapter);
        setSelectedDetachment(null);
    };

    const selectDetachment = (detachment) => {
        setSelectedDetachment(detachment);
    };

    const selectUnit = (unitId) => {
        setSelectedUnitId(unitId);
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
        setArmy(prevArmy => {
            if (unitId === selectedUnitId) {
                setSelectedUnitId(null);
            }
            return prevArmy.filter(unit => unit.id !== unitId);
        });
    };

    const updateUnitWargearSelection = (unitId, newSelection) => {
        setArmy(prevArmy => prevArmy.map(unit => unit.id === unitId ? { ...unit, wargear_selection: newSelection } : unit));
    };

    const updateUnitEnhancement = (unitId, newEnhancement) => {
        setArmy(prevArmy => prevArmy.map(unit => unit.id === unitId ? { ...unit, current_enhancement: newEnhancement } : unit));
    };

    const isUnitChapterValid = (unit) => {
        return isUnitChapterValidFromRules(unit, selectedChapter);
    };

    const handleOpenWargearModal = (unit) => setEditingWargearUnit(unit);
    const handleCloseWargearModal = () => setEditingWargearUnit(null);
    const handleOpenEnhancementsModal = (unit) => setEditingEnhancementUnit(unit);
    const handleCloseEnhancementsModal = () => setEditingEnhancementUnit(null);

    const value = {
        army: processedArmy,
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
        isUnitChapterValid,
        selectedUnitId,
        selectUnit,
    };

    return (
        <ArmyContext.Provider value={value}>
            {children}
        </ArmyContext.Provider>
    );
};
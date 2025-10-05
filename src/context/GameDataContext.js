import React, { createContext, useState, useEffect, useContext } from 'react';

const GameDataContext = createContext(null);

export const useGameData = () => {
    const context = useContext(GameDataContext);
    if (!context) {
        throw new Error('useGameData must be used within a GameDataProvider');
    }
    return context;
};

export const GameDataProvider = ({ children }) => {
    const [allUnits, setAllUnits] = useState({});
    const [allEnhancements, setAllEnhancements] = useState([]);
    const [allWeapons, setAllWeapons] = useState({});
    const [allChapters, setAllChapters] = useState([]);
    const [allDetachments, setAllDetachments] = useState([]);
    const [allStratagems, setAllStratagems] = useState([]);
    const [allCommonRules, setAllCommonRules] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const formatRoleName = (filename) => {
            const name = filename.replace('.json', '');
            switch (name) {
                case 'epichero': return 'Epic Hero';
                case 'characters': return 'Character';
                case 'battleline': return 'Battleline';
                case 'infantry': return 'Infantry';
                case 'mounted': return 'Mounted';
                case 'vehicles': return 'Vehicle';
                case 'transports': return 'Transport';
                case 'fortifications': return 'Fortification';
                default: return name.charAt(0).toUpperCase() + name.slice(1);
            }
        };

        const enrichUnitData = (unit, chapterIdToNameMap) => {
            const newUnit = { ...unit };
            newUnit.keywords = newUnit.keywords || [];
            newUnit.faction_keywords = newUnit.faction_keywords || [];
            if (!newUnit.keywords.includes('IMPERIUM')) {
                newUnit.keywords.push('IMPERIUM');
            }
            if (!newUnit.faction_keywords.includes('ADEPTUS ASTARTES')) {
                newUnit.faction_keywords.push('ADEPTUS ASTARTES');
            }
            if (newUnit.chapter_id) {
                const chapterName = chapterIdToNameMap[newUnit.chapter_id];
                if (chapterName) {
                    const factionKeyword = chapterName.toUpperCase();
                    if (!newUnit.faction_keywords.includes(factionKeyword)) {
                        newUnit.faction_keywords.push(factionKeyword);
                    }
                }
            }
            return newUnit;
        };

        const fetchAllData = async () => {
            try {
                // Fetch manifests first
                const unitManifestRes = await fetch('/data/units/manifest.json');
                const unitManifest = await unitManifestRes.json();
                const stratManifestRes = await fetch('/data/stratagems/manifest.json');
                const stratManifest = await stratManifestRes.json();

                // Prepare promises for manifest-based files
                const unitPromises = unitManifest.map(file => fetch(`/data/units/${file}`).then(res => res.json()));
                const stratPromises = stratManifest.map(file => fetch(`/data/stratagems/${file}`).then(res => res.json()));

                // Fetch all data in a single Promise.all call
                const [
                    unitArrays, 
                    enhancementData, 
                    weaponData, 
                    chapterData, 
                    detachmentData, 
                    stratArrays,
                    commonRulesData
                ] = await Promise.all([
                    Promise.all(unitPromises),
                    fetch('/data/enhancements.json').then(res => res.json()),
                    fetch('/data/weapons.json').then(res => res.json()),
                    fetch('/data/chapters.json').then(res => res.json()),
                    fetch('/data/detachments.json').then(res => res.json()),
                    Promise.all(stratPromises),
                    fetch('/data/common_rules.json').then(res => res.json())
                ]);
                
                // Process the results
                const allStratagemsData = stratArrays.flat();
                const chapterIdToNameMap = chapterData.reduce((acc, chapter) => {
                    acc[chapter.id] = chapter.name;
                    return acc;
                }, {});

                const groupedUnits = unitManifest.reduce((acc, file, index) => {
                    const roleName = formatRoleName(file);
                    const unitsWithRole = unitArrays[index].map(unit => ({ 
                        ...enrichUnitData(unit, chapterIdToNameMap), 
                        role: roleName 
                    }));
                    if (!acc[roleName]) acc[roleName] = [];
                    acc[roleName].push(...unitsWithRole);
                    acc[roleName].sort((a, b) => a.name.localeCompare(b.name));
                    return acc;
                }, {});

                const weaponsMap = weaponData.reduce((acc, weapon) => {
                    acc[weapon.id] = weapon;
                    return acc;
                }, {});

                // Set all state
                setAllUnits(groupedUnits);
                setAllEnhancements(enhancementData);
                setAllWeapons(weaponsMap);
                setAllChapters(chapterData);
                setAllDetachments(detachmentData);
                setAllStratagems(allStratagemsData);
                setAllCommonRules(commonRulesData);

            } catch (e) {
                setError(`Failed to load game data: ${e.message}`);
                console.error("Fetch error:", e);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, []);

    const value = {
        allUnits,
        allEnhancements,
        allWeapons,
        allChapters,
        allDetachments,
        allStratagems,
        allCommonRules,
        loading,
        error,
    };

    // --- CORRECTED LINE ---
    return (
        <GameDataContext.Provider value={value}>
            {children}
        </GameDataContext.Provider>
    );
};
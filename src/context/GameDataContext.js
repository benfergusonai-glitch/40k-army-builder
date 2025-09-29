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

        const fetchAllData = async () => {
            try {
                const manifestRes = await fetch('/data/units/manifest.json');
                const manifest = await manifestRes.json();

                const [unitArrays, enhancementData, weaponData, chapterData, detachmentData] = await Promise.all([
                    Promise.all(manifest.map(file => fetch(`/data/units/${file}`).then(res => res.json()))),
                    fetch('/data/enhancements.json').then(res => res.json()),
                    fetch('/data/weapons.json').then(res => res.json()),
                    fetch('/data/chapters.json').then(res => res.json()),
                    fetch('/data/detachments.json').then(res => res.json())
                ]);
                
                const groupedUnits = manifest.reduce((acc, file, index) => {
                    const roleName = formatRoleName(file);
                    const unitsWithRole = unitArrays[index].map(unit => ({ ...unit, role: roleName }));
                    if (!acc[roleName]) {
                        acc[roleName] = [];
                    }
                    acc[roleName].push(...unitsWithRole);
                    acc[roleName].sort((a, b) => a.name.localeCompare(b.name));
                    return acc;
                }, {});

                const weaponsMap = weaponData.reduce((acc, weapon) => {
                    acc[weapon.id] = weapon;
                    return acc;
                }, {});

                setAllUnits(groupedUnits);
                setAllEnhancements(enhancementData);
                setAllWeapons(weaponsMap);
                setAllChapters(chapterData);
                setAllDetachments(detachmentData);

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
        loading,
        error,
    };

    return (
        <GameDataContext.Provider value={value}>
            {children}
        </GameDataContext.Provider>
    );
};
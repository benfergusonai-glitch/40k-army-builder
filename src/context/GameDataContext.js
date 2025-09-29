import React, { createContext, useState, useEffect, useContext } from 'react';

/**
 * @typedef {Object} GameDataContextType
 * @property {Object} allUnits - All available units, grouped by battlefield role.
 * @property {Array} allEnhancements - A list of all available enhancements.
 * @property {Object} allWeapons - A map of all weapon IDs to their stats.
 * @property {Array} allChapters - A list of all available chapters.
 * @property {Array} allDetachments - A list of all available detachments.
 *g * @property {boolean} loading - True if data is currently being fetched.
 * @property {string|null} error - An error message if fetching failed.
 */

/**
 * @type {React.Context<GameDataContextType>}
 */
const GameDataContext = createContext(null);

/**
 * Custom hook to consume the GameDataContext.
 * Simplifies access to game data across the application.
 * @returns {GameDataContextType} The game data context.
 */
export const useGameData = () => {
    const context = useContext(GameDataContext);
    if (!context) {
        throw new Error('useGameData must be used within a GameDataProvider');
    }
    return context;
};

/**
 * Provider component that fetches, stores, and provides all static game data
 * to its children. This component acts as a centralized data layer.
 */
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

                // Fetch all static data concurrently for performance
                const [unitArrays, enhancementData, weaponData, chapterData, detachmentData] = await Promise.all([
                    Promise.all(manifest.map(file => fetch(`/data/units/${file}`).then(res => res.json()))),
                    fetch('/data/enhancements.json').then(res => res.json()),
                    fetch('/data/weapons.json').then(res => res.json()),
                    fetch('/data/chapters.json').then(res => res.json()),
                    fetch('/data/detachments.json').then(res => res.json())
                ]);
                
                // Process units, grouping them by role
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

                // Process weapons into a map for quick lookups
                const weaponsMap = weaponData.reduce((acc, weapon) => {
                    acc[weapon.id] = weapon;
                    return acc;
                }, {});

                // Set all states once all data is processed
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
    }, []); // Empty dependency array ensures this runs only once on mount

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
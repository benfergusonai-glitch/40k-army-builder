import React, { useState, useEffect } from 'react';
import './App.css';
import UnitList from './components/UnitList';
import ArmyDisplay from './components/ArmyDisplay';
import WargearModal from './components/WargearModal';
import EnhancementsModal from './components/EnhancementsModal';
import ArmyConfiguration from './components/ArmyConfiguration'; // --- NEW

const formatRoleName = (filename) => { /* ... same as before ... */ };

function App() {
  const [allUnits, setAllUnits] = useState({});
  const [allEnhancements, setAllEnhancements] = useState([]);
  const [allWeapons, setAllWeapons] = useState({});
  // --- NEW: State for chapters and detachments ---
  const [allChapters, setAllChapters] = useState([]);
  const [allDetachments, setAllDetachments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const manifestRes = await fetch('/data/units/manifest.json');
        const manifest = await manifestRes.json();

        // --- NEW: Fetch all data concurrently ---
        const [unitArrays, enhancementData, weaponData, chapterData, detachmentData] = await Promise.all([
          Promise.all(manifest.map(file => fetch(`/data/units/${file}`).then(res => res.json()))),
          fetch('/data/enhancements.json').then(res => res.json()),
          fetch('/data/weapons.json').then(res => res.json()),
          fetch('/data/chapters.json').then(res => res.json()),
          fetch('/data/detachments.json').then(res => res.json())
        ]);
        
        const groupedUnits = manifest.reduce(/* ... same as before ... */);
        const weaponsMap = weaponData.reduce(/* ... same as before ... */);

        setAllUnits(groupedUnits);
        setAllEnhancements(enhancementData);
        setAllWeapons(weaponsMap);
        setAllChapters(chapterData); // --- NEW
        setAllDetachments(detachmentData); // --- NEW

      } catch (e) {
        setError(`Failed to load game data: ${e.message}`);
        console.error("Fetch error:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  if (loading) { /* ... same as before ... */ }
  if (error) { /* ... same as before ... */ }

  return (
    <div className="App">
      <header className="App-header"><h1>Warhammer 40,000 Army Builder</h1></header>
      <main className="container">
        <div className="roster-selection-panel">
          <h2>Select Units</h2>
          <UnitList unitGroups={allUnits} />
        </div>
        <div className="army-list-panel">
          <h2>My Army</h2>
          {/* --- NEW: Add configuration component and pass data --- */}
          <ArmyConfiguration chapters={allChapters} detachments={allDetachments} />
          <ArmyDisplay weapons={allWeapons} />
        </div>
      </main>
      <WargearModal />
      <EnhancementsModal enhancements={allEnhancements} />
    </div>
  );
}

// NOTE: The full code for App.js is included below for clarity.
const FullApp = () => {
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

  if (loading) {
    return <div className="container"><h1>Loading game data...</h1></div>;
  }
  if (error) {
    return <div className="container"><h1>Error</h1><p>{error}</p></div>;
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Warhammer 40,000 Army Builder</h1>
      </header>
      <main className="container">
        <div className="roster-selection-panel">
          <h2>Select Units</h2>
          <UnitList unitGroups={allUnits} />
        </div>
        <div className="army-list-panel">
          <h2>My Army</h2>
          <ArmyConfiguration chapters={allChapters} detachments={allDetachments} />
          <ArmyDisplay weapons={allWeapons} />
        </div>
      </main>

      <WargearModal />
      <EnhancementsModal enhancements={allEnhancements} />
    </div>
  );
};
export default FullApp;
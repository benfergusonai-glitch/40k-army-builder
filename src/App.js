import React, { useState, useEffect, useMemo } from 'react';
import ArmyOptions from './components/ArmyOptions';
import UnitSelector from './components/UnitSelector';
import ArmyList from './components/ArmyList';
import ArmyValidation from './components/ArmyValidation';
import './App.css';

const maxUnitCounts = {
  'Epic Hero': 1,
  'Battleline': 6,
  'Character': 3,
  'Infantry': 3,
  'Mounted': 3,
  'Vehicle': 3,
  'Dedicated Transport': 6,
  'Fortification': 3
};

function App() {
  const [allUnits, setAllUnits] = useState([]);
  const [groupedUnits, setGroupedUnits] = useState({});
  const [allWeapons, setAllWeapons] = useState([]);
  const [allChapters, setAllChapters] = useState([]);
  const [allDetachments, setAllDetachments] = useState([]);
  const [allEnhancements, setAllEnhancements] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState('');
  const [selectedDetachment, setSelectedDetachment] = useState('');
  const [selectedUnits, setSelectedUnits] = useState([]);
  const [totalPoints, setTotalPoints] = useState(0);

  // ... existing handler functions (assignEnhancement, handleChapterChange, etc.) ...
  const assignEnhancement = (unitInstanceId, enhancementId) => {
    setSelectedUnits(currentUnits =>
      currentUnits.map(unit => {
        if (unit.instanceId === unitInstanceId) {
          if (!enhancementId) {
            const { enhancement, ...restOfUnit } = unit;
            return restOfUnit;
          }
          const enhancementToAdd = allEnhancements.find(e => e.id === enhancementId);
          if (enhancementToAdd) { return { ...unit, enhancement: enhancementToAdd }; }
        }
        return unit;
      })
    );
  };
  const handleChapterChange = (chapterId) => {
    setSelectedChapter(chapterId);
    setSelectedDetachment('');
    setSelectedUnits([]);
  };
  const handleDetachmentChange = (detachmentId) => {
    setSelectedDetachment(detachmentId);
    setSelectedUnits(currentUnits =>
      currentUnits.map(unit => {
        const { enhancement, ...restOfUnit } = unit;
        return restOfUnit;
      })
    );
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [weaponsResponse, manifestResponse, chaptersResponse, detachmentsResponse, enhancementsResponse] = await Promise.all([
          fetch('/data/weapons.json'),
          fetch('/data/units/manifest.json'),
          fetch('/data/chapters.json'),
          fetch('/data/detachments.json'),
          fetch('/data/enhancements.json')
        ]);
        const weaponsData = await weaponsResponse.json();
        const manifestData = await manifestResponse.json();
        const chaptersData = await chaptersResponse.json();
        const detachmentsData = await detachmentsResponse.json();
        const enhancementsData = await enhancementsResponse.json();
        setAllWeapons(weaponsData);
        setAllChapters(chaptersData);
        setAllDetachments(detachmentsData);
        setAllEnhancements(enhancementsData);
        const unitPromises = manifestData.map(filename => fetch(`/data/units/${filename}`).then(res => res.json()));
        const allUnitArrays = await Promise.all(unitPromises);
        const combinedUnits = allUnitArrays.flat();
        setAllUnits(combinedUnits);
        const unitsByRole = combinedUnits.reduce((acc, unit) => {
          const role = unit.role;
          if (!acc[role]) { acc[role] = []; }
          acc[role].push(unit);
          return acc;
        }, {});
        setGroupedUnits(unitsByRole);
      } catch (error) {
        console.error("Failed to fetch game data:", error);
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    const newTotal = selectedUnits.reduce((sum, currentUnit) => {
      const basePoints = (currentUnit.points && currentUnit.points.length > 0) ? currentUnit.points[0].cost : 0;
      const enhancementPoints = currentUnit.enhancement ? currentUnit.enhancement.cost : 0;
      return sum + basePoints + enhancementPoints;
    }, 0);
    setTotalPoints(newTotal);
  }, [selectedUnits]);

  const addUnit = (unitId) => {
    const unitToAdd = allUnits.find(u => u.id === unitId);
    if (!unitToAdd) return;
    const currentCount = selectedUnits.filter(u => u.id === unitId).length;
    const maxCount = maxUnitCounts[unitToAdd.role] || 3;
    if (currentCount >= maxCount) {
      alert(`You can only have a maximum of ${maxCount} of the unit "${unitToAdd.name}".`);
      return;
    }
    const newUnitInstance = { ...unitToAdd, instanceId: Date.now() };
    setSelectedUnits([...selectedUnits, newUnitInstance]);
  };

  const removeUnit = (instanceId) => {
    setSelectedUnits(selectedUnits.filter(u => u.instanceId !== instanceId));
  };
  
  // --- NEW DUPLICATE FUNCTION ---
  const duplicateUnit = (unitInstanceId) => {
    const unitToDuplicate = selectedUnits.find(u => u.instanceId === unitInstanceId);
    if (!unitToDuplicate) return;

    // First, check the same validation rules as the addUnit function
    const currentCount = selectedUnits.filter(u => u.id === unitToDuplicate.id).length;
    const maxCount = maxUnitCounts[unitToDuplicate.role] || 3;
    if (currentCount >= maxCount) {
      alert(`You can only have a maximum of ${maxCount} of the unit "${unitToDuplicate.name}".`);
      return;
    }

    // Create a new copy with a new, unique instanceId
    const newUnitInstance = { ...unitToDuplicate, instanceId: Date.now() };

    // Add the new unit to the list
    setSelectedUnits(currentUnits => [...currentUnits, newUnitInstance]);
  };

  // ... existing validation and filtering logic ...
  const validationMessages = [];
  const hasCharacter = selectedUnits.some(unit => unit.role === 'Character' || unit.role === 'Epic Hero');
  if (selectedUnits.length > 0 && !hasCharacter) {
    validationMessages.push({ type: 'warning', text: 'Your army must include at least one CHARACTER unit.' });
  }
  const unitCounts = selectedUnits.reduce((acc, unit) => {
    acc[unit.id] = (acc[unit.id] || 0) + 1;
    return acc;
  }, {});
  const availableDetachments = allDetachments.filter(detachment =>
    !selectedChapter || (detachment.allowed_chapters && detachment.allowed_chapters.includes(selectedChapter))
  );
  const assignedEnhancementIds = selectedUnits.map(unit => unit.enhancement?.id).filter(Boolean);
  const availableEnhancements = allEnhancements.filter(enh => enh.detachment_id === selectedDetachment);
  const filteredGroupedUnits = !selectedChapter
    ? groupedUnits
    : Object.keys(groupedUnits).reduce((acc, role) => {
        const filteredUnitsInRole = groupedUnits[role].filter(unit => !unit.chapter || unit.chapter === selectedChapter);
        if (filteredUnitsInRole.length > 0) { acc[role] = filteredUnitsInRole; }
        return acc;
      }, {});

  return (
    <div className="App">
      <header className="App-header">
        <h1>40k Army Builder</h1>
      </header>
      <main className="App-main">
        <div className="builder-container">
          <ArmyOptions
            allChapters={allChapters}
            allDetachments={availableDetachments}
            selectedChapter={selectedChapter}
            selectedDetachment={selectedDetachment}
            onChapterChange={handleChapterChange}
            onDetachmentChange={handleDetachmentChange}
          />
          <UnitSelector groupedUnits={filteredGroupedUnits} onAddUnit={addUnit} />
        </div>
        <div className="list-container">
          <ArmyValidation messages={validationMessages} />
          <ArmyList
            selectedUnits={selectedUnits}
            allWeapons={allWeapons}
            onRemoveUnit={removeUnit}
            onDuplicateUnit={duplicateUnit} // <-- Pass the new function
            totalPoints={totalPoints}
            availableEnhancements={availableEnhancements}
            onAssignEnhancement={assignEnhancement}
            assignedEnhancementIds={assignedEnhancementIds}
            onWargearChange={() => {}}
            unitCounts={unitCounts}
            maxUnitCounts={maxUnitCounts}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
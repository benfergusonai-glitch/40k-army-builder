import React, { useMemo } from 'react';
import { useArmy } from '../context/ArmyContext';
import './ArmyConfiguration.css';

function ArmyConfiguration({ chapters, detachments }) {
  const {
    selectedChapter,
    selectedDetachment,
    selectChapter,
    selectDetachment,
  } = useArmy();

  const handleChapterChange = (e) => {
    const chapterId = e.target.value;
    const chapter = chapters.find(c => c.id === chapterId) || null;
    selectChapter(chapter);
  };

  const handleDetachmentChange = (e) => {
    const detachmentId = e.target.value;
    const detachment = detachments.find(d => d.id === detachmentId) || null;
    selectDetachment(detachment);
  };

  const availableDetachments = useMemo(() => {
    if (!selectedChapter) {
      return [];
    }
    return detachments.filter(d => d.allowed_chapters.includes(selectedChapter.id));
  }, [selectedChapter, detachments]);

  return (
    <div className="army-config-panel">
      <div className="config-item">
        <label htmlFor="chapter-select">Chapter:</label>
        <select id="chapter-select" value={selectedChapter?.id || ''} onChange={handleChapterChange}>
          <option value="">-- Select a Chapter --</option>
          {chapters.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
      <div className="config-item">
        <label htmlFor="detachment-select">Detachment:</label>
        <select id="detachment-select" value={selectedDetachment?.id || ''} onChange={handleDetachmentChange} disabled={!selectedChapter}>
          <option value="">-- Select a Detachment --</option>
          {availableDetachments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
      </div>
    </div>
  );
}

export default ArmyConfiguration;
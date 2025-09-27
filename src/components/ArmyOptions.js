import React from 'react';
import './ArmyOptions.css'; // We'll create this file next

function ArmyOptions({
  allChapters,
  allDetachments,
  selectedChapter,
  selectedDetachment,
  onChapterChange,
  onDetachmentChange
}) {
  return (
    <div className="army-options-container">
      <div className="option-group">
        <label htmlFor="chapter-select">Chapter</label>
        <select
          id="chapter-select"
          value={selectedChapter}
          onChange={(e) => onChapterChange(e.target.value)}
        >
          <option value="">-- Select a Chapter --</option>
          {allChapters.map(chapter => (
            <option key={chapter.id} value={chapter.id}>
              {chapter.name}
            </option>
          ))}
        </select>
      </div>

      <div className="option-group">
        <label htmlFor="detachment-select">Detachment</label>
        <select
          id="detachment-select"
          value={selectedDetachment}
          onChange={(e) => onDetachmentChange(e.target.value)}
        >
          <option value="">-- Select a Detachment --</option>
          {allDetachments.map(detachment => (
            <option key={detachment.id} value={detachment.id}>
              {detachment.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default ArmyOptions;
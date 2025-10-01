import React from 'react';
import './ColumnToggleButton.css';

function ColumnToggleButton({ onClick, isCollapsed, direction = 'left' }) {
    const arrow = direction === 'left' ? '‹' : '›';
    const title = isCollapsed ? 'Expand column' : 'Collapse column';

    return (
        <button
            className={`column-toggle-button ${isCollapsed ? 'collapsed' : ''}`}
            onClick={onClick}
            title={title}
        >
            <span className="toggle-arrow">{arrow}</span>
        </button>
    );
}

export default ColumnToggleButton;
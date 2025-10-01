import React, { useState } from 'react';
import './App.css';
import UnitList from './components/UnitList';
import ArmyDisplay from './components/ArmyDisplay';
import ArmyConfiguration from './components/ArmyConfiguration';
import { useGameData } from './context/GameDataContext';
import UnitDetailView from './components/UnitDetailView';
import ColumnToggleButton from './components/ColumnToggleButton';

function App() {
  const { loading, error } = useGameData();
  
  const [columnVisibility, setColumnVisibility] = useState({
    select: true,
    detail: true,
  });

  const toggleColumn = (columnName) => {
    setColumnVisibility(prevState => ({
      ...prevState,
      [columnName]: !prevState[columnName],
    }));
  };

  if (loading) {
    return <div><h1>Loading game data...</h1></div>;
  }
  if (error) {
    return <div><h1>Error</h1><p>{error}</p></div>;
  }

  const gridTemplateColumns = [
    columnVisibility.select ? '350px' : '40px',
    '1fr',
    columnVisibility.detail ? '1.5fr' : '40px',
  ].join(' ');

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-left">
          <h1>Warhammer 40,000 Army Builder</h1>
        </div>
        <div className="header-center">
          <ArmyConfiguration />
        </div>
        <div className="header-right">
            {/* The ArmyConstraints component was moved from here */}
        </div>
      </header>
      
      <main className="container-grid" style={{ gridTemplateColumns }}>
        <div className={`grid-column column-select ${!columnVisibility.select ? 'collapsed' : ''}`}>
          <div className="column-header">
            <h2>Select Units</h2>
            <ColumnToggleButton
              onClick={() => toggleColumn('select')}
              isCollapsed={!columnVisibility.select}
              direction="left"
            />
          </div>
          <UnitList />
        </div>

        <div className="grid-column column-army">
           <div className="column-header">
            <h2>My Army</h2>
           </div>
          <ArmyDisplay />
        </div>
        
        <div className={`grid-column column-detail ${!columnVisibility.detail ? 'collapsed' : ''}`}>
          <div className="column-header">
            <h2>Unit Details</h2>
            <ColumnToggleButton
              onClick={() => toggleColumn('detail')}
              isCollapsed={!columnVisibility.detail}
              direction="right"
            />
          </div>
          <UnitDetailView />
        </div>
      </main>
    </div>
  );
}

export default App;
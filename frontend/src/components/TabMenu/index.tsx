import './index.css';

import { useState } from 'react';

interface Props {
  tabs: string[];
  onSelect: (tab: string) => void;
}


const TabMenu = ({tabs, onSelect}: Props) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="tab-menu-container">
      <button className="hamburger-button" onClick={toggleMenu}>
        ☰
      </button>

      <div className={`tab-menu ${isMenuOpen ? 'open' : ''}`}>
        {tabs.map((tabItem: string)=> (
          <div
            className="tab-menu-item"
            key={tabItem}
            onClick={() => onSelect(tabItem)}
          >
            {tabItem}
          </div>
          ))
        }
      </div>
    </div>
  );
};

export default TabMenu;

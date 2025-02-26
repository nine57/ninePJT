import {useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';

interface Tab {
  label: string;
  path: string;
}

interface Props {
  tabs: Tab[];
  onTabChange: (arg0: string) => void;
}

const DrawNav = ({ tabs, onTabChange }: Props) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSelect = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
    onTabChange(path)
  };

  return (
    <>
      <button className="w-14 text-3xl px-4 py-2.5 cursor-pointer" onClick={toggleMenu}>
        {isMenuOpen ? 'x' : '☰'}
      </button>

      <div className={`absolute right-0 top-14 flex flex-col w-[200px] bg-white shadow-lg transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'opacity-100 visible translate-x-0' : 'opacity-0 invisible translate-x-8'}`}
      >
        {tabs.map((tab: Tab)=> (
          <div
            key={tab.path}
            onClick={() => handleSelect(tab.path)}
            className={`px-5 py-2 text-left cursor-pointer transition-colors duration-300 hover:bg-gray-600 hover:text-gray-200 ${
              location.pathname === tab.path && 'bg-gray-100 font-extrabold text-black underline'}`}
          >
            {tab.label}
          </div>
        ))}
      </div>
    </>
  );
};

export default DrawNav;

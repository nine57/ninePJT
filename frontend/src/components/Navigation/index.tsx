import { Link } from 'react-router-dom';
import React from 'react';

const Navigation: React.FC = () => {
  return (
    <nav>
      <ul className="flex space-x-8">
        <li>
          <Link to="/" className="text-white font-medium hover:text-gray-400 transition duration-200">
            Home
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;

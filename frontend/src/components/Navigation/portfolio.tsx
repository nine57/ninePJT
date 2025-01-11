import React from 'react';

const Navigation: React.FC = () => {
  return (
    <nav>
      <ul className="flex space-x-8">
        <li>
          <a href="#home" className="font-medium hover:text-gray-400 transition duration-200">
            Home
          </a>
        </li>
        <li>
          <a href="#about" className="font-medium hover:text-gray-400 transition duration-200">
            About
          </a>
        </li>
        <li>
          <a href="#home" className="font-medium hover:text-gray-400 transition duration-200">
            Project
          </a>
        </li>
        <li>
          <a href="#home" className="font-medium hover:text-gray-400 transition duration-200">
            Education
          </a>
        </li>
        <li>
          <a href="#contact" className="font-medium hover:text-gray-400 transition duration-200">
            Contact
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;

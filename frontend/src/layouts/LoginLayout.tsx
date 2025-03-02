import React from 'react';
import {Outlet} from 'react-router-dom';
import bgImage from '../assets/Login/login-bg.jpg'

const LoginLayout: React.FC = () => {
  return (
    <div
      className="flex flex-col h-screen w-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="flex flex-col items-center justify-center h-full">
        <Outlet/>
      </div>
    </div>
  );
};

export default LoginLayout;

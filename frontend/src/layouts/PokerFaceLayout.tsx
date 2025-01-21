import React from 'react';
import { Outlet } from 'react-router-dom';

const PokerFaceLayout: React.FC = () => {
  return (
    <>
      <header className="fixed top-0 left-0 w-full h-20 shadow">
        <div className="container mx-auto bg-white h-full w-[75vw] flex justify-between items-center px-8">
          <div className="text-3xl font-extrabold tracking-wider">
            Poker Face
          </div>
        </div>
      </header>
      <main>
        <div className="container mx-auto bg-blue-200 w-[75vw] text-center">
          <Outlet/>
        </div>
      </main>
    </>
  );
};

export default PokerFaceLayout;

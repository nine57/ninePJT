import React from 'react';
import { Outlet } from 'react-router-dom';
import Title from '../components/Title';
import Navigation from '../components/Navigation';

const DefaultLayout: React.FC = () => {
  return (
    <>
      <header className="fixed top-0 left-0 w-full h-20 shadow-lg">
        <div className="container mx-auto flex justify-between items-center h-full px-8">
          <Title/>
          <Navigation/>
        </div>
      </header>
      <main className="main">
        <Outlet/> {/* 하위 라우트 렌더링 */}
      </main>
    </>
  );
};

export default DefaultLayout;

import React from 'react';
import { Outlet } from 'react-router-dom';
import Title from '../components/Title';
import Navigation from '../components/Navigation';

const DefaultLayout: React.FC = () => {
  return (
    <>
      <Navigation />
      <main className="main">
        <Title />
        <Outlet /> {/* 하위 라우트 렌더링 */}
      </main>
    </>
  );
};

export default DefaultLayout;

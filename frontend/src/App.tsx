import Header from './components/Header';
import Navigation from './components/Navigation';
import { Outlet } from 'react-router-dom';
import React from 'react';

const App: React.FC = () => {
  return (
    <>
      <Header/>
      <Navigation />
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default App;

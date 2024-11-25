import React from 'react';
import { Outlet } from 'react-router-dom';

const PokerFaceLayout: React.FC = () => {
  return (
    <main className="poker-face-layout">
      <Outlet /> {/* 하위 라우트 렌더링 */}
    </main>
  );
};

export default PokerFaceLayout;

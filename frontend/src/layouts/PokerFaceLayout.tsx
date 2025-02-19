import React from 'react';
import {Outlet} from 'react-router-dom';
import DrawNav from '../components/DrawNav';
import mainImage from '../assets/PokerFace/main.png';

const PokerFaceLayout: React.FC = () => {
  const tabs = [
    { label: '메인', path: '/poker-face/' },
    { label: '공지', path: '/poker-face/notice' },
    { label: '갤러리', path: '/poker-face/gallery' },
    { label: '모임', path: '/poker-face/gathering' },
    // { label: '회비', path: '/poker-face/dues' },
    // { label: '로그인', path: '/poker-face/login' },
  ];

  return (
    <div className="mx-auto max-w-[600px] flex flex-col h-screen">
      <div className="relative">
        <header className="fixed top-0 z-10 w-full max-w-[600px]">
          <div className="bg-blue-200 left-0 right-0 h-14 w-full p-3 flex items-center relative">
            <div className="bg-white absolute left-0">
              <div className="font-cinzel font-bold text-2xl p-2">POKER FACE</div>
            </div>
            <div className="bg-white absolute right-0">
              <DrawNav tabs={tabs}/>
            </div>
          </div>
        </header>
        <div className="mt-14 w-full overflow-hidden">
          <div className="mx-4 my-1">
            <img src={mainImage} alt="Poker-Face Main" className="w-full h-auto object-cover rounded-3xl"/>
          </div>
        </div>
        <main className="mt-54 flex-grow-1 overflow-y-auto">
          <div className="bg-blue-100">
            <Outlet/>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PokerFaceLayout;

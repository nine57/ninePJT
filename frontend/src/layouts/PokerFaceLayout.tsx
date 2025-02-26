import React, {ReactElement, useState} from 'react';
import {Outlet} from 'react-router-dom';
import DrawNav from '../components/DrawNav';
import mainImage from '../assets/PokerFace/main.png';
import titleImage from '../assets/PokerFace/title.png';

const PokerFaceLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('/poker-face/');

  const tabs = [
    { label: '메인', path: '/poker-face/' },
    { label: '공지', path: '/poker-face/notice' },
    { label: '갤러리', path: '/poker-face/gallery' },
    { label: '모임', path: '/poker-face/gathering' },
    // { label: '회비', path: '/poker-face/dues' },
    // { label: '로그인', path: '/poker-face/login' },
  ];

  const handleTabChange = (path: string) => {
    setActiveTab(path);
  };

  const TopImage = (): ReactElement => {
    if (activeTab === '/poker-face/') {
      return <img src={mainImage} alt="Poker-Face MainPage" className="w-full h-auto object-cover rounded-2xl"/>;
    } else {
      return <img src={titleImage} alt="Poker-Face Title" className="w-full h-auto object-cover rounded-md"/>;
    }
  }

  return (
    <div className="bg-blue-50 mx-auto max-w-[600px] flex flex-col h-screen">
      <div className="relative">
        <header className="fixed top-0 z-10 w-full max-w-[600px]">
          <div className="bg-blue-50 left-0 right-0 h-14 w-full p-3 flex items-center relative">
            <div className="bg-blue-50 absolute left-0 mx-5">
              <a href='/poker-face/' onClick={() => setActiveTab('/poker-face/')}>
                <div className="font-cinzel font-bold text-2xl">POKER FACE</div>
              </a>
            </div>
            <div className="bg-blue-50 absolute right-0 mx-2">
              <DrawNav tabs={tabs} onTabChange={handleTabChange}/>
            </div>
          </div>
        </header>
        <div className="bg-blue-50 mt-14 w-full overflow-hidden">
          <div className="mx-4 my-1">
            <TopImage/>
          </div>
        </div>
        <main className="mt-54 flex-grow-1 overflow-y-auto">
          <div className="bg-blue-50">
            <Outlet/>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PokerFaceLayout;

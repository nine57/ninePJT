import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface BottomNavBarProps {
  orgId: string;
}

const Icons: Record<string, React.FC<{ className?: string }>> = {
  home: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 10.5L12 3l9 7.5" />
      <path d="M5 9.5V19a1 1 0 001 1h3.5v-5a1.5 1.5 0 011.5-1.5h2a1.5 1.5 0 011.5 1.5v5H18a1 1 0 001-1V9.5" />
    </svg>
  ),
  posts: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <line x1="8" y1="8" x2="16" y2="8" />
      <line x1="8" y1="12" x2="16" y2="12" />
      <line x1="8" y1="16" x2="12" y2="16" />
    </svg>
  ),
  albums: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="M21 15l-5-5L5 21" />
    </svg>
  ),
  settlements: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="15" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
      <line x1="6" y1="15" x2="10" y2="15" />
    </svg>
  ),
  members: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="7" r="3.5" />
      <path d="M2 20v-1a5 5 0 015-5h4a5 5 0 015 5v1" />
      <circle cx="18" cy="8" r="2.5" />
      <path d="M19.5 14.5a4 4 0 013 3.5v1" />
    </svg>
  ),
  settings: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1.08-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1.08 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001.08 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9c.26.604.852.997 1.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1.08z" />
    </svg>
  ),
  more: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="18" x2="20" y2="18" />
    </svg>
  ),
  switchOrg: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="17 1 21 5 17 9" />
      <path d="M3 11V9a4 4 0 014-4h14" />
      <polyline points="7 23 3 19 7 15" />
      <path d="M21 13v2a4 4 0 01-4 4H3" />
    </svg>
  ),
};

export const BottomNavBar: React.FC<BottomNavBarProps> = ({ orgId }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const mainMenuItems = [
    { key: 'home', label: '홈', icon: 'home', path: `/organizations/${orgId}` },
    { key: 'posts', label: '게시글', icon: 'posts', path: `/organizations/${orgId}/posts` },
    { key: 'albums', label: '앨범', icon: 'albums', path: `/organizations/${orgId}/albums` },
    { key: 'settlements', label: '정산', icon: 'settlements', path: `/organizations/${orgId}/settlements` },
  ];

  const moreMenuItems = [
    { key: 'members', label: '멤버 관리', icon: 'members', path: `/organizations/${orgId}/members` },
    { key: 'settings', label: '설정', icon: 'settings', path: `/organizations/${orgId}/settings` },
    { key: 'select', label: '모임 변경', icon: 'switchOrg', path: '/organizations/select' },
  ];

  const isActive = (path: string) => {
    if (path === `/organizations/${orgId}`) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const renderIcon = (iconKey: string, className: string) => {
    const IconComponent = Icons[iconKey];
    return IconComponent ? <IconComponent className={className} /> : null;
  };

  return (
    <>
      {/* Full-screen Menu */}
      <div
        className={`fixed inset-0 z-40 flex justify-center transition-opacity duration-300 ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* 바깥 영역 클릭으로 닫기 */}
        <div className="absolute inset-0" onClick={() => setIsMenuOpen(false)} />

        {/* 메뉴 패널 - 컨테이너 너비에 맞춤 */}
        <div
          className={`relative w-full max-w-lg bg-gradient-to-br from-white via-blue-50 to-blue-100 flex flex-col transform transition-transform duration-300 ease-out ${
            isMenuOpen ? 'translate-y-0' : 'translate-y-full'
          }`}
        >
          {/* 상단 헤더 */}
          <div className="flex items-center justify-between px-6 pt-6 pb-4">
            <h2 className="text-xl font-bold text-slate-900">더보기</h2>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-200/60 transition-colors"
            >
              <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* 메뉴 항목들 */}
          <div className="flex-1 px-4 pb-20 space-y-2">
            {moreMenuItems.map((item) => (
              <button
                key={item.key}
                onClick={() => handleNavigate(item.path)}
                className="w-full flex items-center gap-4 px-4 py-4 bg-white rounded-2xl shadow-sm hover:shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all duration-200"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                  {renderIcon(item.icon, 'w-5 h-5 text-blue-500')}
                </div>
                <span className="text-base font-semibold text-slate-800">{item.label}</span>
                <svg className="w-5 h-5 text-slate-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg bg-white border-t border-slate-200 z-50 safe-area-bottom">
        <div className="flex items-center justify-around h-16">
          {mainMenuItems.map((item) => (
            <button
              key={item.key}
              onClick={() => handleNavigate(item.path)}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive(item.path)
                  ? 'text-blue-500'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {renderIcon(item.icon, 'w-6 h-6 mb-0.5')}
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          ))}

          {/* More Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
              isMenuOpen ? 'text-blue-500' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {renderIcon('more', 'w-6 h-6 mb-0.5')}
            <span className="text-xs font-medium">더보기</span>
          </button>
        </div>
      </nav>
    </>
  );
};

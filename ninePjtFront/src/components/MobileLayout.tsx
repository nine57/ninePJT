import React from 'react';
import { useParams } from 'react-router-dom';

import { BottomNavBar } from './BottomNavBar';

interface MobileLayoutProps {
  children: React.ReactNode;
  title?: string;
  showBackButton?: boolean;
  onBack?: () => void;
  hideNavBar?: boolean;
}

export const MobileLayout: React.FC<MobileLayoutProps> = ({
  children,
  title,
  showBackButton,
  onBack,
  hideNavBar = false,
}) => {
  const { orgId, id } = useParams<{ orgId?: string; id?: string }>();
  const organizationId = orgId || id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100">
      {/* Header */}
      {(title || showBackButton) && (
        <header className="sticky top-0 bg-white/80 backdrop-blur-sm border-b border-slate-200 z-30">
          <div className="flex items-center h-14 px-4">
            {showBackButton && (
              <button
                onClick={onBack}
                className="mr-3 text-slate-600 hover:text-slate-900"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            {title && (
              <h1 className="text-lg font-bold text-slate-900 truncate">{title}</h1>
            )}
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className={`${!hideNavBar ? 'pb-20' : ''}`}>
        {children}
      </main>

      {/* Bottom Navigation */}
      {!hideNavBar && organizationId && (
        <BottomNavBar orgId={organizationId} />
      )}
    </div>
  );
};

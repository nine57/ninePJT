import {RouteObject} from 'react-router-dom';
import DefaultLayout from '../src/layouts/DefaultLayout';
import PortfolioLayout from '../src/layouts/PortfolioLayout';
import PokerFaceLayout from '../src/layouts/PokerFaceLayout';
import Portfolio from './pages/Portfolio';
import {default as PfMain} from './pages/PokerFace/MainPage.tsx';
import {default as PfGathering} from '../src/pages/PokerFace/Gathering';
import {default as PfGallery} from './pages/PokerFace/GalleryPage.tsx';
import {default as PfNotice} from './pages/PokerFace/NoticePage.tsx';
import Home from '../src/pages/Home'
import NotFound from '../src/pages/NotFound'; // 404 페이지

const routes: RouteObject[] = [
  {
    path: '/',
    element: <DefaultLayout />, // 포트폴리오 레이아웃 사용
    children: [
      { index: true, element: <Home /> }, // 기본 경로
    ],
  },
  {
    path: '/portfolio',
    element: <PortfolioLayout />, // 포트폴리오 레이아웃 사용
    children: [
      { index: true, element: <Portfolio /> }, // 기본 경로
    ],
  },
  {
    path: '/poker-face',
    element: <PokerFaceLayout />, // PokerFace 전용 레이아웃 사용
    children: [
      { index: true, element: <PfMain /> }, // /poker-face 경로
      { path: 'notice', element: <PfNotice /> },
      { path: 'gallery', element: <PfGallery /> },
      { path: 'gathering', element: <PfGathering /> },
    ],
  },
  {
    path: '*',
    element: <DefaultLayout />, // Default 레이아웃 사용
    children: [
      { index: true, element: <NotFound /> } // 404 Not Found 페이지
    ]
  },
];

export default routes;

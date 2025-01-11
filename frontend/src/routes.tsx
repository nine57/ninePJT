import { RouteObject } from 'react-router-dom';
import DefaultLayout from '../src/layouts/DefaultLayout'; // 기본 레이아웃
import PortfolioLayout from '../src/layouts/PortfolioLayout'; // 기본 레이아웃
import PokerFaceLayout from '../src/layouts/PokerFaceLayout'; // PokerFace 전용 레이아웃
import HomePage from './pages/HomePage';
import PokerFaceMain from '../src/pages/PokerFace/Main';
import GatheringPage from "../src/pages/PokerFace/Gathering";
import NotFound from '../src/pages/NotFound'; // 404 페이지

const routes: RouteObject[] = [
  {
    path: '/',
    element: <PortfolioLayout />, // 포트폴리오 레이아웃 사용
    children: [
      { index: true, element: <HomePage /> }, // 기본 경로
    ],
  },
  {
    path: '/poker-face',
    element: <PokerFaceLayout />, // PokerFace 전용 레이아웃 사용
    children: [
      { index: true, element: <PokerFaceMain /> }, // /poker-face 경로
      { path: 'gathering', element: <GatheringPage /> },
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

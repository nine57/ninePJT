import { RouteObject } from 'react-router-dom';
import DefaultLayout from '../src/layouts/DefaultLayout'; // 기본 레이아웃
import PokerFaceLayout from '../src/layouts/PokerFaceLayout'; // PokerFace 전용 레이아웃
import Home from '../src/pages/HomePage/Home.tsx';
import About from '../src/pages/HomePage/About.tsx';
import Contact from '../src/pages/HomePage/Contact.tsx';
import PokerFaceMain from '../src/pages/PokerFace/Main';
import NotFound from '../src/pages/NotFound'; // 404 페이지

const routes: RouteObject[] = [
  {
    path: '/',
    element: <DefaultLayout />, // 기본 레이아웃 사용
    children: [
      { index: true, element: <Home /> }, // 기본 경로
      { path: 'about', element: <About /> }, // /about 경로
      { path: 'contact', element: <Contact /> }, // /contact 경로
    ],
  },
  {
    path: '/poker-face',
    element: <PokerFaceLayout />, // PokerFace 전용 레이아웃 사용
    // element: <DefaultLayout />, // 기본 레이아웃 사용
    children: [
      { index: true, element: <PokerFaceMain /> }, // /poker-face 경로
    ],
  },
  {
    path: '*',
    element: <NotFound />, // 404 Not Found 페이지
  },
];

export default routes;

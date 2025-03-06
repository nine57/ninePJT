import DefaultLayout from './layouts/DefaultLayout';
import Home from './pages/Home'
import Login from './pages/Login'
import LoginLayout from './layouts/LoginLayout';
import NotFound from './pages/NotFound';
import {default as PfGallery} from './pages/PokerFace/GalleryPage.tsx';
import {default as PfGathering} from './pages/PokerFace/Gathering';
import {default as PfMain} from './pages/PokerFace/MainPage.tsx';
import {default as PfNotice} from './pages/PokerFace/NoticePage.tsx';
import PokerFaceLayout from './layouts/PokerFaceLayout';
import Portfolio from './pages/Portfolio';
import PortfolioLayout from './layouts/PortfolioLayout';
import {RouteObject} from 'react-router-dom';
import Signup from './pages/Signup'

const routes: RouteObject[] = [
  {
    path: '/',
    element: <DefaultLayout />,
    children: [{ index: true, element: <Home /> }],
  },
  {
    path: '/login/',
    element: <LoginLayout />,
    children: [{ index: true, element: <Login /> }],
  },
  {
    path: '/signup/',
    element: <LoginLayout />,
    children: [{ index: true, element: <Signup /> }],
  },
  {
    path: '/portfolio/',
    element: <PortfolioLayout />,
    children: [
      { index: true, element: <Portfolio /> },
    ],
  },
  {
    path: '/poker-face/',
    element: <PokerFaceLayout />,
    children: [
      { index: true, element: <PfMain /> },
      { path: 'notice/', element: <PfNotice /> },
      { path: 'gallery/', element: <PfGallery /> },
      { path: 'gathering/', element: <PfGathering /> },
    ],
  },
  {
    path: '*',
    element: <DefaultLayout />,
    children: [
      { index: true, element: <NotFound /> }
    ]
  },
];

export default routes;

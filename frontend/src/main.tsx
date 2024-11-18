import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import About from './pages/About'; // About 페이지 컴포넌트
import App from './App';
import Contact from './pages/Contact'; // Contact 페이지 컴포넌트
import Home from './pages/Home'; // Home 페이지 컴포넌트
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <App />,
      children: [
        { index: true,element: <Home /> },
        { path: 'about', element: <About /> },
        { path: 'contact', element: <Contact /> },
      ],
    },
  ]
);

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);

// createRoot(document.getElementById('root') as HTMLElement).render(
//   <StrictMode>
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<App />} />
//           <Route index element={<Home />} /> {/* 기본 페이지 */}
//           <Route path="about" element={<About />} />
//           <Route path="contact" element={<Contact />} />
//       </Routes>
//     </BrowserRouter>
//   </StrictMode>,
// )

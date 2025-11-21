// src/main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import App from './App.jsx';
import Home from './Components/Home/Home.jsx';
import Estimate from './Components/Estimate/Estimate.jsx';


import './index.css';

// Nested routes: App provides Navbar + Footer + <Outlet/>
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'estimate', element: <Estimate /> },
      { path: '*', element: <div style={{ padding: 16 }}>Not Found</div> },
    ],
  },
]);

// Optional PWA registration
import { registerSW } from 'virtual:pwa-register';
if ('serviceWorker' in navigator) {
  registerSW({
    onRegisteredSW(swUrl, reg) {
      if (reg) setInterval(() => reg.update(), 60 * 60 * 1000);
    },
    onRegisterError(error) {
      console.error('SW registration error:', error);
    },
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);

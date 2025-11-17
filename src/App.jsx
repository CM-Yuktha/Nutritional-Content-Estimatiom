// App.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar.jsx';
import Footer from './Components/Footer/Footer.jsx';

export default function App() {
  return (
    <>
      <Navbar />
      <main className="page-shell">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

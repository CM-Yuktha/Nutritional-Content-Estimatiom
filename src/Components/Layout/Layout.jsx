// src/Components/Layout/Layout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar/Navbar.jsx';
import Footer from '../Footer/Footer.jsx';

const Layout = () => (
  <>
    <Navbar />
    <main className="page-shell">
      <Outlet />
    </main>
    <Footer />
  </>
);

export default Layout;

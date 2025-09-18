import React from 'react';
import { Outlet } from '@tanstack/react-router';
import { Navbar } from '../Navbar/Navbar';
import { Sidebar } from '../Sidebar/Sidebar';
import { Footer } from '../Footer/Footer';
import './AppLayout.css';

export const AppLayout = () => {
  return (
    <div className="app-layout">
      <Navbar />
      <Sidebar />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

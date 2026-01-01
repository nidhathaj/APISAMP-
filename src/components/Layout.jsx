import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <header className="top-bar glass-panel">
          <div className="search-placeholder">
            <span>Search records...</span>
          </div>
          <div className="user-profile">
            <div className="avatar">JD</div>
            <span>Pentester</span>
          </div>
        </header>
        <div className="page-container">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;

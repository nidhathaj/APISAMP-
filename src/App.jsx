import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Categories from './pages/KnowledgeBase/Categories';
import Definitions from './pages/KnowledgeBase/Definitions';
import Reports from './pages/Reports/ReportList';
import ReportDetails from './pages/Reports/ReportDetails';
import Preview from './pages/Preview/ReportPreview';
import { useAuth } from './context/AuthContext';

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}
        >
          <Route index element={<Dashboard />} />
          <Route path="kb" element={<Categories />} />
          <Route path="kb/definitions" element={<Definitions />} />
          <Route path="reports" element={<Reports />} />
          <Route path="reports/:id" element={<ReportDetails />} />
          <Route path="preview/:id" element={<Preview />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

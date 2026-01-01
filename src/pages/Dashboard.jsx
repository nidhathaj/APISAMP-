import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  CheckCircle2,
  Clock,
  TrendingUp,
  Plus,
  ChevronRight
} from 'lucide-react';
import { reportService } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState({ total: 0, draft: 0, completed: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const { data } = await reportService.getReports();
        const mockFallback = [
          { id: 1, client_name: 'Mock Client A', target: 'https://test-a.com', status: 'Draft', start_date: '2025-01-01', scope: 'Web' },
          { id: 2, client_name: 'Mock Client B', target: 'https://test-b.com', status: 'Completed', start_date: '2025-01-05', scope: 'API' }
        ];
        const reportData = (data && Array.isArray(data) && data.length > 0) ? data : mockFallback;
        setReports(reportData);

        const total = reportData.length;
        const draft = reportData.filter(r => r.status === 'Draft').length;
        const completed = total - draft;
        setStats({ total, draft, completed });
      } catch (err) {
        console.warn('Backend missing or failed, using mock data');
        const mockData = [
          { id: 1, client_name: 'Acme Corp (Mock)', target: 'https://app.acme.com', status: 'Draft', start_date: '2025-01-01', scope: 'Web App' },
          { id: 2, client_name: 'GlobalTech (Mock)', target: 'https://api.gt.com', status: 'Completed', start_date: '2025-01-10', scope: 'API' }
        ];
        setReports(mockData);
        setStats({ total: 2, draft: 1, completed: 1 });
      }
    };
    fetchReports();
  }, []);

  const statCards = [
    { label: 'Total Reports', value: stats.total, icon: <FileText size={20} />, color: '#3b82f6' },
    { label: 'Draft Reports', value: stats.draft, icon: <Clock size={20} />, color: '#f59e0b' },
    { label: 'Completed', value: stats.completed, icon: <CheckCircle2 size={20} />, color: '#10b981' },
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back! Here's an overview of your active engagements.</p>
        </div>
        <button className="primary" onClick={() => navigate('/reports')}>
          <Plus size={20} /> Create New Report
        </button>
      </div>

      <div className="stats-grid">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card stat-card"
          >
            <div className="stat-icon" style={{ backgroundColor: `${stat.color}20`, color: stat.color }}>
              {stat.icon}
            </div>
            <div className="stat-info">
              <h3>{stat.label}</h3>
              <p className="stat-value">{stat.value}</p>
            </div>
            <div className="stat-trend">
              <TrendingUp size={16} />
              <span>+0%</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="recent-reports glass-panel">
        <div className="section-header">
          <h2>Recent Reports</h2>
          <button className="secondary" onClick={() => navigate('/reports')}>View All</button>
        </div>

        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Client Name</th>
                <th>Target</th>
                <th>Status</th>
                <th>Start Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(reports) && reports.length > 0 ? reports.slice(0, 5).map((report) => (
                <tr key={report.id}>
                  <td>{report.client_name}</td>
                  <td><code>{report.target}</code></td>
                  <td>
                    <span className={`status-badge ${report.status.toLowerCase()}`}>
                      {report.status}
                    </span>
                  </td>
                  <td>{report.start_date}</td>
                  <td>
                    <button className="icon-btn" onClick={() => navigate(`/reports/${report.id}`)}>
                      <ChevronRight size={18} />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="empty-state">No reports found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 2rem;
        }

        .dashboard-header h1 { margin: 0; font-size: 1.875rem; }
        .dashboard-header p { color: var(--text-secondary); margin: 0.25rem 0 0 0; }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2.5rem;
        }

        .stat-card {
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          position: relative;
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-info h3 {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-secondary);
          margin: 0;
        }

        .stat-value {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0.25rem 0 0 0;
        }

        .stat-trend {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.75rem;
          color: var(--accent-success);
        }

        .recent-reports {
          padding: 1.5rem;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .section-header h2 { font-size: 1.25rem; margin: 0; }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th {
          text-align: left;
          padding: 1rem;
          font-size: 0.75rem;
          text-transform: uppercase;
          color: var(--text-secondary);
          border-bottom: 1px solid var(--border-color);
        }

        td {
          padding: 1rem;
          font-size: 0.875rem;
          border-bottom: 1px solid var(--border-color);
        }

        code {
          background: rgba(255, 255, 255, 0.05);
          padding: 0.2rem 0.4rem;
          border-radius: 4px;
          font-family: monospace;
          color: var(--accent-primary);
        }

        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .status-badge.draft { background: rgba(245, 158, 11, 0.1); color: var(--accent-warning); }
        .status-badge.completed { background: rgba(16, 185, 129, 0.1); color: var(--accent-success); }

        .icon-btn {
          background: transparent;
          border: none;
          padding: 0.5rem;
          color: var(--text-secondary);
        }

        .icon-btn:hover { color: var(--accent-primary); }

        .empty-state {
          text-align: center;
          padding: 3rem !important;
          color: var(--text-secondary);
        }
      `}</style>
    </div>
  );
};

export default Dashboard;

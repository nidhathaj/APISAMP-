import React, { useEffect, useState } from 'react';
import { reportService } from '../../services/api';
import { Plus, Search, Calendar, Globe, Pencil, Trash2, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const ReportList = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const { data } = await reportService.getReports();
            const mockFallback = [
                { id: 1, client_name: 'Acme Corp', target: 'https://app.acme.com', status: 'Draft', start_date: '2025-12-01', end_date: '2025-12-10', scope: 'Web' },
                { id: 2, client_name: 'Global Finance', target: 'https://api.globalfinance.com', status: 'Completed', start_date: '2025-11-15', end_date: '2025-11-20', scope: 'API' }
            ];
            setReports(Array.isArray(data) && data.length > 0 ? data : mockFallback);
        } catch (err) {
            console.warn('Backend missing, using mock reports');
            setReports([
                { id: 1, client_name: 'Acme Corp', target: 'https://app.acme.com', status: 'Draft', start_date: '2025-12-01', end_date: '2025-12-10', scope: 'Web' },
                { id: 2, client_name: 'Global Finance', target: 'https://api.globalfinance.com', status: 'Completed', start_date: '2025-11-15', end_date: '2025-11-20', scope: 'API' }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const filteredReports = Array.isArray(reports) ? reports.filter(r =>
        (r?.client_name?.toLowerCase()?.includes(searchTerm.toLowerCase())) ||
        (r?.target?.toLowerCase()?.includes(searchTerm.toLowerCase()))
    ) : [];

    return (
        <div className="reports-container">
            <div className="section-header">
                <div>
                    <h1>Security Engagements</h1>
                    <p>Manage your VAPT reports and findings.</p>
                </div>
                <button className="primary">
                    <Plus size={18} /> New Report
                </button>
            </div>

            <div className="filter-bar glass-panel">
                <div className="search-input">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Search by client or target URL..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="reports-grid">
                {loading ? (
                    <div className="loading-state">Loading engagements...</div>
                ) : filteredReports.length > 0 ? filteredReports.map((report, i) => (
                    <motion.div
                        key={report.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="glass-card report-row"
                        onClick={() => navigate(`/reports/${report.id}`)}
                    >
                        <div className="report-main">
                            <div className="client-info">
                                <h3>{report.client_name}</h3>
                                <div className="target-url">
                                    <Globe size={14} />
                                    <span>{report.target}</span>
                                </div>
                            </div>
                            <div className="report-meta">
                                <div className="meta-item">
                                    <Calendar size={14} />
                                    <span>{report.start_date} - {report.end_date}</span>
                                </div>
                                <div className="meta-item">
                                    <span className="scope-tag">{report.scope}</span>
                                </div>
                            </div>
                        </div>

                        <div className="report-status-area">
                            <span className={`status-badge ${report.status.toLowerCase()}`}>
                                {report.status}
                            </span>
                            <div className="action-btns">
                                <button className="icon-btn" onClick={(e) => { e.stopPropagation(); /* edit login */ }}>
                                    <Pencil size={16} />
                                </button>
                                <button className="icon-btn hover-danger" onClick={(e) => { e.stopPropagation(); /* delete logic */ }}>
                                    <Trash2 size={16} />
                                </button>
                                <ChevronRight size={20} className="arrow" />
                            </div>
                        </div>
                    </motion.div>
                )) : (
                    <div className="empty-state">No engagements found.</div>
                )}
            </div>

            <style>{`
        .reports-container { padding: 1rem; }
        .section-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2rem; }
        .section-header h1 { margin: 0; font-size: 1.5rem; }
        .section-header p { color: var(--text-secondary); margin: 0.25rem 0 0 0; }

        .filter-bar { padding: 1rem; margin-bottom: 1.5rem; }
        .search-input { display: flex; align-items: center; gap: 0.75rem; color: var(--text-secondary); }
        .search-input input { background: transparent; border: none; padding: 0.8rem; width: 100%; color: white; }
        .search-input input:focus { outline: none; }

        .reports-grid { display: flex; flex-direction: column; gap: 0.75rem; }

        .report-row {
          padding: 1.25rem 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
        }

        .report-main { display: flex; flex-direction: column; gap: 0.5rem; }
        .client-info h3 { margin: 0; font-size: 1.125rem; }
        .target-url { display: flex; align-items: center; gap: 0.4rem; color: var(--accent-primary); font-size: 0.875rem; font-family: monospace; }

        .report-meta { display: flex; align-items: center; gap: 1.5rem; color: var(--text-secondary); font-size: 0.8rem; }
        .meta-item { display: flex; align-items: center; gap: 0.4rem; }

        .scope-tag {
          background: rgba(255, 255, 255, 0.05);
          padding: 0.1rem 0.6rem;
          border-radius: 4px;
          border: 1px solid var(--border-color);
        }

        .report-status-area { display: flex; align-items: center; gap: 2rem; }

        .action-btns { display: flex; align-items: center; gap: 0.5rem; }
        .icon-btn { 
          background: transparent; 
          border: none; 
          color: var(--text-secondary); 
          padding: 0.5rem;
          opacity: 0.6;
        }
        .icon-btn:hover { opacity: 1; color: var(--accent-primary); background: rgba(255, 255, 255, 0.05); }
        .icon-btn.hover-danger:hover { color: var(--accent-danger); background: rgba(239, 68, 68, 0.05); }

        .arrow { color: var(--text-secondary); transition: transform 0.2s; }
        .report-row:hover .arrow { transform: translateX(4px); color: var(--accent-primary); }

        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: capitalize;
        }
        .status-badge.draft { background: rgba(245, 158, 11, 0.1); color: var(--accent-warning); }
        .status-badge.completed { background: rgba(16, 185, 129, 0.1); color: var(--accent-success); }

        .loading-state, .empty-state { text-align: center; padding: 4rem; color: var(--text-secondary); }
      `}</style>
        </div>
    );
};

export default ReportList;

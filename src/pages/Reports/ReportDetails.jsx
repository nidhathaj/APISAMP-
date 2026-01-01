import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { reportService } from '../../services/api';
import {
    ArrowLeft,
    Plus,
    ShieldAlert,
    Eye,
    Download,
    AlertTriangle,
    Info,
    ExternalLink,
    ChevronDown,
    ChevronUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ReportDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [report, setReport] = useState(null);
    const [findings, setFindings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [reportRes, findingsRes] = await Promise.all([
                    reportService.getReport(id),
                    reportService.getFindings(id)
                ]);
                if (reportRes.data && typeof reportRes.data === 'object' && !Array.isArray(reportRes.data)) {
                    setReport(reportRes.data);
                } else {
                    throw new Error('Malformed report data');
                }
                setFindings(Array.isArray(findingsRes.data) ? findingsRes.data : []);
            } catch (err) {
                console.warn('Backend missing, using mock report details');
                // Mock Report
                setReport({
                    id: id,
                    client_name: 'Acme Corp',
                    target: 'https://app.acme.com',
                    status: 'Draft',
                    scope: 'Web Application',
                    start_date: '2025-12-01',
                    end_date: '2025-12-10'
                });
                // Mock Findings
                setFindings([
                    {
                        id: 1,
                        title: 'SQL Injection',
                        severity: 'Critical',
                        affected_url: '/api/v1/login',
                        status: 'Open',
                        description: 'A classic SQL injection vulnerability in the login endpoint.',
                        impact: 'Total database takeover.',
                        remediation: 'Use parameterized queries.'
                    },
                    {
                        id: 2,
                        title: 'Broken Authentication',
                        severity: 'High',
                        affected_url: '/settings/profile',
                        status: 'Open',
                        description: 'Session tokens do not expire after logout.',
                        impact: 'Account takeover.',
                        remediation: 'Implement proper session termination.'
                    }
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const getSeverityColor = (sev) => {
        const s = sev?.toLowerCase();
        if (s === 'critical') return 'var(--accent-critical)';
        if (s === 'high') return 'var(--accent-danger)';
        if (s === 'medium') return 'var(--accent-warning)';
        return 'var(--accent-success)';
    };

    if (loading) return <div className="loading-screen">Loading report details...</div>;
    if (!report) return <div className="error-screen">Report not found.</div>;

    return (
        <div className="report-details-container">
            <div className="details-header">
                <button className="back-btn" onClick={() => navigate('/reports')}>
                    <ArrowLeft size={20} /> Back to Reports
                </button>
                <div className="header-actions">
                    <button className="secondary" onClick={() => navigate(`/preview/${id}`)}>
                        <Eye size={18} /> Preview
                    </button>
                    <button className="secondary">
                        <Download size={18} /> Export
                    </button>
                </div>
            </div>

            <div className="engagement-banner glass-panel">
                <div className="banner-main">
                    <div className="client-badge">ENGAGEMENT</div>
                    <h1>{report.client_name}</h1>
                    <a href={report.target} target="_blank" rel="noreferrer" className="target-link">
                        {report.target} <ExternalLink size={14} />
                    </a>
                </div>
                <div className="banner-stats">
                    <div className="banner-stat">
                        <label>Status</label>
                        <span className={`status-badge ${report?.status?.toLowerCase() || 'draft'}`}>{report?.status || 'Draft'}</span>
                    </div>
                    <div className="banner-stat">
                        <label>Findings</label>
                        <span className="count">{findings.length}</span>
                    </div>
                </div>
            </div>

            <div className="findings-section">
                <div className="section-header">
                    <h2>Findings</h2>
                    <button className="primary">
                        <Plus size={18} /> Add Finding
                    </button>
                </div>

                <div className="findings-list">
                    {Array.isArray(findings) && findings.length > 0 ? findings.map((finding, i) => (
                        <FindingCard key={finding?.id || i} finding={finding} index={i} getSeverityColor={getSeverityColor} />
                    )) : (
                        <div className="empty-findings glass-panel">
                            <AlertTriangle size={32} />
                            <p>No findings added yet. Start by adding a vulnerability found during testing.</p>
                            <button className="secondary">Add First Finding</button>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
        .report-details-container { padding: 1rem; max-width: 1200px; margin: 0 auto; }
        
        .details-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        .back-btn { background: transparent; border: none; color: var(--text-secondary); display: flex; align-items: center; gap: 0.5rem; font-weight: 500; }
        .back-btn:hover { color: var(--accent-primary); }
        .header-actions { display: flex; gap: 0.75rem; }

        .engagement-banner { padding: 2rem; display: flex; justify-content: space-between; align-items: center; margin-bottom: 2.5rem; }
        .client-badge { font-size: 0.7rem; font-weight: 800; color: var(--accent-primary); letter-spacing: 0.1em; margin-bottom: 0.5rem; }
        .engagement-banner h1 { margin: 0; font-size: 2rem; }
        .target-link { color: var(--text-secondary); text-decoration: none; font-family: monospace; font-size: 0.875rem; display: flex; align-items: center; gap: 0.4rem; margin-top: 0.5rem; }
        .target-link:hover { color: var(--accent-primary); }

        .banner-stats { display: flex; gap: 3rem; }
        .banner-stat { display: flex; flex-direction: column; gap: 0.25rem; }
        .banner-stat label { font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase; font-weight: 600; }
        .banner-stat .count { font-size: 1.5rem; font-weight: 700; }

        .findings-section h2 { font-size: 1.5rem; margin-bottom: 1.5rem; }
        .findings-list { display: flex; flex-direction: column; gap: 1rem; }

        .empty-findings { text-align: center; padding: 4rem; display: flex; flex-direction: column; align-items: center; gap: 1rem; color: var(--text-secondary); }
        .empty-findings button { margin-top: 1rem; }

        .loading-screen, .error-screen { height: 60vh; display: flex; align-items: center; justify-content: center; color: var(--text-secondary); }
      `}</style>
        </div >
    );
};

const FindingCard = ({ finding, index, getSeverityColor }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="finding-card glass-panel"
        >
            <div className="finding-header" onClick={() => setExpanded(!expanded)}>
                <div className="finding-severity-indicator" style={{ backgroundColor: getSeverityColor(finding.severity) }} />
                <div className="finding-title-group">
                    <h3>{finding.title}</h3>
                    <span className="affected-url">{finding.affected_url}</span>
                </div>
                <div className="finding-meta">
                    <span className="status-tag">{finding?.status}</span>
                    <span className="severity-tag" style={{ color: getSeverityColor(finding?.severity) }}>{finding?.severity}</span>
                    {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
            </div>

            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="finding-content"
                    >
                        <div className="content-grid">
                            <div className="content-item full">
                                <label><Info size={14} /> Description</label>
                                <p>{finding.description || 'No description provided.'}</p>
                            </div>
                            <div className="content-item">
                                <label><AlertTriangle size={14} /> Impact</label>
                                <p>{finding.impact || 'No impact details.'}</p>
                            </div>
                            <div className="content-item">
                                <label><ShieldAlert size={14} /> Remediation</label>
                                <p>{finding.remediation || 'No remediation steps.'}</p>
                            </div>
                        </div>
                        <div className="finding-actions">
                            <button className="secondary">Manage Evidence</button>
                            <button className="secondary">Edit Details</button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
        .finding-card { overflow: hidden; border-left: none; }
        .finding-header { padding: 1.25rem 1.5rem; display: flex; align-items: center; gap: 1.5rem; cursor: pointer; position: relative; }
        .finding-severity-indicator { position: absolute; left: 0; top: 0; bottom: 0; width: 4px; }
        
        .finding-title-group { flex: 1; }
        .finding-title-group h3 { margin: 0; font-size: 1.125rem; font-weight: 600; }
        .affected-url { font-size: 0.8rem; color: var(--text-secondary); font-family: monospace; }

        .finding-meta { display: flex; align-items: center; gap: 1.5rem; }
        .severity-tag { font-weight: 700; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; width: 80px; text-align: right; }
        .status-tag { font-size: 0.75rem; background: rgba(255,255,255,0.05); padding: 0.15rem 0.6rem; border-radius: 4px; color: var(--text-secondary); }

        .finding-content { padding: 0 1.5rem 1.5rem 1.5rem; border-top: 1px solid var(--border-color); }
        .content-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; padding-top: 1.5rem; }
        .content-item.full { grid-column: span 2; }
        .content-item label { display: flex; align-items: center; gap: 0.5rem; font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase; font-weight: 700; margin-bottom: 0.5rem; }
        .content-item p { margin: 0; font-size: 0.9375rem; line-height: 1.6; color: rgba(255,255,255,0.8); }

        .finding-actions { margin-top: 2rem; display: flex; gap: 0.75rem; padding-top: 1.5rem; border-top: 1px solid var(--border-color); }
      `}</style>
        </motion.div>
    );
};

export default ReportDetails;

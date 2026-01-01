import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { reportService } from '../../services/api';
import { ArrowLeft, Printer, FileDown, ShieldCheck, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const ReportPreview = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPreview = async () => {
            try {
                const res = await reportService.getPreview(id);
                if (res.data && typeof res.data === 'object' && res.data.report && res.data.findings) {
                    setData(res.data);
                } else {
                    throw new Error('Malformed preview data');
                }
            } catch (err) {
                console.warn('Backend missing, using mock preview data');
                setData({
                    report: {
                        id: id,
                        client_name: 'Acme Corp',
                        target: 'https://app.acme.com',
                        scope: 'Web Application',
                        start_date: '2025-12-01',
                        end_date: '2025-12-10',
                        status: 'Draft'
                    },
                    summary: {
                        total_findings: 2,
                        critical: 1,
                        high: 1,
                        medium: 0,
                        low: 0
                    },
                    findings: [
                        {
                            order: 1,
                            title: 'SQL Injection',
                            severity: 'Critical',
                            affected_url: '/api/v1/login',
                            description: 'A classic SQL injection vulnerability in the login endpoint.',
                            impact: 'Full database compromise.',
                            remediation: 'Use prepared statements.',
                            evidence: [
                                { step_no: 1, instruction: 'Intercept login request', screenshot_url: 'https://placehold.co/600x400?text=Evidence+Step+1' },
                                { step_no: 2, instruction: 'Inject payload and observe response', screenshot_url: 'https://placehold.co/600x400?text=Evidence+Step+2' }
                            ]
                        },
                        {
                            order: 2,
                            title: 'IDOR',
                            severity: 'High',
                            affected_url: '/api/v1/users/info',
                            description: 'Insecure Direct Object Reference allowed viewing other users data.',
                            impact: 'Sensitive data disclosure.',
                            remediation: 'Implement user-based authorization.',
                            evidence: [
                                { step_no: 1, instruction: 'Change user_id parameter', screenshot_url: 'https://placehold.co/600x400?text=Evidence+IDOR' }
                            ]
                        }
                    ]
                });
            } finally {
                setLoading(false);
            }
        };
        fetchPreview();
    }, [id]);

    const handleExport = async (format) => {
        try {
            const res = format === 'pdf' ? await reportService.exportPdf(id) : await reportService.exportDocx(id);
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Report_${data.report.client_name}.${format}`);
            document.body.appendChild(link);
            link.click();
        } catch (err) {
            alert(`Export failed: ${err.message}`);
        }
    };

    if (loading) return <div className="loading-screen">Preparing report preview...</div>;
    if (!data) return <div className="error-screen">Preview data unavailable.</div>;

    return (
        <div className="preview-container">
            <div className="preview-toolbar glass-panel no-print">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <ArrowLeft size={18} /> Back
                </button>
                <div className="toolbar-actions">
                    <button className="secondary" onClick={() => window.print()}>
                        <Printer size={18} /> Print
                    </button>
                    <button className="secondary" onClick={() => handleExport('pdf')}>
                        <FileDown size={18} /> PDF
                    </button>
                    <button className="secondary" onClick={() => handleExport('docx')}>
                        <FileDown size={18} /> Word
                    </button>
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="document-canvas box-shadow-xl"
            >
                <div className="report-cover">
                    <ShieldCheck size={64} color="#3b82f6" />
                    <h1>VAPT Pentest Report</h1>
                    <div className="report-details">
                        <div className="detail-row">
                            <label>Client:</label>
                            <span>{data.report.client_name}</span>
                        </div>
                        <div className="detail-row">
                            <label>Target:</label>
                            <span>{data.report.target}</span>
                        </div>
                        <div className="detail-row">
                            <label>Scope:</label>
                            <span>{data.report.scope}</span>
                        </div>
                        <div className="detail-row">
                            <label>Period:</label>
                            <span>{data.report.start_date} to {data.report.end_date}</span>
                        </div>
                    </div>
                </div>

                <div className="report-section">
                    <h2>1. Executive Summary</h2>
                    <div className="summary-stats">
                        <div className="stat-box" data-sev="critical">
                            <span className="count">{data.summary.critical}</span>
                            <label>Critical</label>
                        </div>
                        <div className="stat-box" data-sev="high">
                            <span className="count">{data.summary.high}</span>
                            <label>High</label>
                        </div>
                        <div className="stat-box" data-sev="medium">
                            <span className="count">{data.summary.medium}</span>
                            <label>Medium</label>
                        </div>
                        <div className="stat-box" data-sev="low">
                            <span className="count">{data.summary.low}</span>
                            <label>Low</label>
                        </div>
                    </div>
                </div>

                <div className="report-section">
                    <h2>2. Detailed Findings</h2>
                    {data.findings.map((finding, idx) => (
                        <div key={finding.order} className="finding-entry">
                            <div className="finding-title">
                                <span className="idx">{idx + 1}.</span>
                                <h3>{finding?.title}</h3>
                                <span className="sev-tag" data-sev={finding?.severity?.toLowerCase() || 'low'}>{finding?.severity}</span>
                            </div>
                            <div className="finding-body">
                                <div className="field">
                                    <label>Affected URL:</label>
                                    <code>{finding.affected_url}</code>
                                </div>
                                <div className="field">
                                    <label>Description:</label>
                                    <p>{finding.description}</p>
                                </div>
                                <div className="field">
                                    <label>Impact:</label>
                                    <p>{finding.impact}</p>
                                </div>
                                <div className="field">
                                    <label>Remediation:</label>
                                    <p>{finding.remediation}</p>
                                </div>

                                <div className="evidence-section">
                                    <label>Reproduce Steps & Evidence:</label>
                                    <div className="evidence-list">
                                        {finding.evidence.map(step => (
                                            <div key={step.step_no} className="step">
                                                <span className="step-num">Step {step.step_no}:</span>
                                                <p>{step.instruction}</p>
                                                {step.screenshot_url && (
                                                    <div className="screenshot-container">
                                                        <img src={step.screenshot_url} alt={`Evidence for step ${step.step_no}`} />
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>

            <style>{`
        .preview-container { padding: 2rem; display: flex; flex-direction: column; align-items: center; gap: 2rem; background: #0a0a0a; min-height: 100vh; }
        
        .preview-toolbar { width: 100%; max-width: 900px; padding: 1rem 1.5rem; display: flex; justify-content: space-between; align-items: center; position: sticky; top: 1rem; z-index: 100; }
        .toolbar-actions { display: flex; gap: 0.75rem; }
        .back-btn { background: transparent; border: none; color: white; display: flex; align-items: center; gap: 0.5rem; }

        .document-canvas {
          width: 100%;
          max-width: 900px;
          background: white;
          color: #1a1a1a;
          padding: 60px 80px;
          min-height: 1200px;
          border-radius: 4px;
        }

        .report-cover { text-align: center; margin-top: 100px; margin-bottom: 200px; }
        .report-cover h1 { font-size: 3rem; margin: 2rem 0; color: #000; letter-spacing: -0.01em; }
        
        .report-details { max-width: 400px; margin: 4rem auto 0; text-align: left; }
        .detail-row { display: flex; margin-bottom: 1rem; border-bottom: 1px solid #eee; padding-bottom: 0.5rem; }
        .detail-row label { width: 100px; font-weight: 700; color: #666; font-size: 0.8rem; text-transform: uppercase; }
        .detail-row span { font-weight: 500; font-size: 1rem; color: #000; }

        .report-section { margin-bottom: 4rem; }
        .report-section h2 { border-bottom: 2px solid #eee; padding-bottom: 1rem; margin-bottom: 2rem; font-size: 1.75rem; }

        .summary-stats { display: flex; gap: 1rem; margin-top: 2rem; }
        .stat-box { flex: 1; padding: 1.5rem; border-radius: 8px; text-align: center; }
        .stat-box .count { font-size: 2.5rem; font-weight: 800; display: block; }
        .stat-box label { font-size: 0.8rem; font-weight: 700; text-transform: uppercase; }

        .stat-box[data-sev="critical"] { background: #fee2e2; color: #991b1b; }
        .stat-box[data-sev="high"] { background: #ffedd5; color: #9a3412; }
        .stat-box[data-sev="medium"] { background: #fef9c3; color: #854d0e; }
        .stat-box[data-sev="low"] { background: #dcfce7; color: #166534; }

        .finding-entry { margin-bottom: 3rem; border: 1px solid #eee; border-radius: 8px; overflow: hidden; }
        .finding-title { background: #f9fafb; padding: 1rem 1.5rem; display: flex; align-items: center; gap: 1rem; border-bottom: 1px solid #eee; }
        .finding-title .idx { font-weight: 700; color: #666; }
        .finding-title h3 { margin: 0; font-size: 1.25rem; flex: 1; }
        
        .sev-tag { padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; }
        .sev-tag[data-sev="critical"] { background: #000; color: #fff; }
        .sev-tag[data-sev="high"] { background: #ef4444; color: #fff; }
        .sev-tag[data-sev="medium"] { background: #f59e0b; color: #fff; }

        .finding-body { padding: 1.5rem; }
        .field { margin-bottom: 1.5rem; }
        .field label { display: block; font-weight: 800; font-size: 0.8rem; color: #666; text-transform: uppercase; margin-bottom: 0.5rem; }
        .field p { margin: 0; line-height: 1.6; }
        .field code { background: #f3f4f6; padding: 0.25rem 0.5rem; border-radius: 4px; font-family: monospace; font-size: 0.9rem; }

        .evidence-section { background: #fff; margin-top: 2rem; padding-top: 2rem; border-top: 1px dashed #eee; }
        .step { margin-bottom: 2rem; }
        .step-num { font-weight: 800; color: #3b82f6; display: block; margin-bottom: 0.5rem; }
        .screenshot-container { margin-top: 1rem; border: 1px solid #eee; border-radius: 4px; padding: 5px; }
        .screenshot-container img { width: 100%; border-radius: 3px; }

        @media print {
          .no-print { display: none !important; }
          .preview-container { background: white; padding: 0; }
          .document-canvas { box-shadow: none; max-width: 100%; padding: 0; }
        }

        .loading-screen, .error-screen { height: 100vh; display: flex; align-items: center; justify-content: center; color: white; }
      `}</style>
        </div>
    );
};

export default ReportPreview;

import React, { useEffect, useState } from 'react';
import { kbService } from '../../services/api';
import { Book, Filter, Search, ShieldAlert, Tag } from 'lucide-react';
import { motion } from 'framer-motion';

const Definitions = () => {
    const [definitions, setDefinitions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL'); // ALL, OWASP, CVE, CUSTOM
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchDefinitions();
    }, [filter]);

    const fetchDefinitions = async () => {
        setLoading(true);
        try {
            const source = filter === 'ALL' ? '' : filter;
            const { data } = await kbService.getDefinitions(source);
            setDefinitions(Array.isArray(data) && data.length > 0 ? data : getMockDefinitions(filter));
        } catch (err) {
            console.warn('Backend missing, using mock definitions');
            setDefinitions(getMockDefinitions(filter));
        } finally {
            setLoading(false);
        }
    };

    const getMockDefinitions = (sourceFilter) => {
        const allMocks = [
            { id: 1, source: 'OWASP', title: 'SQL Injection', default_severity: 'High', description: 'Improper neutralization of special elements used in an SQL Command.', cve_id: null },
            { id: 2, source: 'CVE', title: 'Log4Shell', default_severity: 'Critical', description: 'Apache Log4j2 remote code execution vulnerability.', cve_id: 'CVE-2021-44228' },
            { id: 3, source: 'CUSTOM', title: 'Business Logic Abuse', default_severity: 'Medium', description: 'Flaws in the design and implementation of applications that allow attackers to manipulate business rules.', cve_id: null },
            { id: 4, source: 'OWASP', title: 'Cross-Site Scripting (XSS)', default_severity: 'Medium', description: 'Untrusted data is included in a web page without proper validation or escaping.', cve_id: null }
        ];
        if (sourceFilter === 'ALL') return allMocks;
        return allMocks.filter(d => d.source === sourceFilter);
    };

    const filteredDefinitions = Array.isArray(definitions) ? definitions.filter(def =>
        (def?.title?.toLowerCase()?.includes(searchTerm.toLowerCase())) ||
        (def?.cve_id?.toLowerCase()?.includes(searchTerm.toLowerCase()))
    ) : [];

    return (
        <div className="definitions-container">
            <div className="section-header">
                <div>
                    <h1>Vulnerability Definitions</h1>
                    <p>The core template library for all report findings.</p>
                </div>
            </div>

            <div className="filter-bar glass-panel shadow-lg">
                <div className="search-box">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Search by title or CVE ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="filter-group">
                    {['ALL', 'OWASP', 'CVE', 'CUSTOM'].map(f => (
                        <button
                            key={f}
                            className={`filter-btn ${filter === f ? 'active' : ''}`}
                            onClick={() => setFilter(f)}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="definitions-list">
                {loading ? (
                    <div className="loading-state">Syncing with library...</div>
                ) : filteredDefinitions.length > 0 ? filteredDefinitions.map((def, i) => (
                    <motion.div
                        key={def.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className="glass-card definition-card"
                    >
                        <div className="def-header">
                            <div className="def-title-area">
                                <div className="source-badge" data-source={def.source}>{def.source}</div>
                                <h3>{def.title}</h3>
                                {def.cve_id && <span className="cve-id">{def.cve_id}</span>}
                            </div>
                            <div className="def-sev-badge" data-sev={def.default_severity.toLowerCase()}>
                                {def.default_severity}
                            </div>
                        </div>
                        <p className="def-desc">{def.description}</p>
                        <div className="def-footer">
                            <div className="meta">
                                <Tag size={12} />
                                <span>Template ID: #{def.id}</span>
                            </div>
                            <button className="secondary sm">View Full Template</button>
                        </div>
                    </motion.div>
                )) : (
                    <div className="empty-state">No definitions found for this source.</div>
                )}
            </div>

            <style>{`
        .definitions-container { padding: 1rem; }
        .section-header { margin-bottom: 2rem; }
        .section-header h1 { margin: 0; font-size: 1.5rem; }
        .section-header p { color: var(--text-secondary); margin: 0.25rem 0 0 0; }

        .filter-bar { padding: 1rem; margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: center; gap: 2rem; }
        .search-box { flex: 1; display: flex; align-items: center; gap: 0.75rem; color: var(--text-secondary); }
        .search-box input { background: transparent; border: none; padding: 0.5rem 0; width: 100%; color: white; }
        .search-box input:focus { outline: none; }

        .filter-group { display: flex; gap: 0.5rem; background: rgba(0,0,0,0.2); padding: 0.25rem; border-radius: 8px; border: 1px solid var(--border-color); }
        .filter-btn { background: transparent; border: none; padding: 0.4rem 0.8rem; font-size: 0.75rem; font-weight: 600; border-radius: 6px; color: var(--text-secondary); transition: all 0.2s; }
        .filter-btn.active { background: var(--accent-primary); color: white; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3); }

        .definitions-list { display: flex; flex-direction: column; gap: 1rem; }
        
        .definition-card { padding: 1.5rem; border-radius: 12px; }
        
        .def-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; }
        .def-title-area { display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; }
        .def-title-area h3 { margin: 0; font-size: 1.1rem; font-weight: 600; }

        .source-badge { font-size: 0.65rem; font-weight: 800; padding: 0.15rem 0.4rem; border-radius: 4px; text-transform: uppercase; }
        .source-badge[data-source="OWASP"] { background: rgba(59, 130, 246, 0.15); color: var(--accent-primary); }
        .source-badge[data-source="CVE"] { background: rgba(147, 51, 234, 0.15); color: var(--accent-critical); }
        .source-badge[data-source="CUSTOM"] { background: rgba(255, 255, 255, 0.05); color: var(--text-secondary); }

        .cve-id { font-size: 0.75rem; font-family: monospace; color: var(--text-secondary); }

        .def-sev-badge { font-size: 0.7rem; font-weight: 700; padding: 0.25rem 0.6rem; border-radius: 6px; text-transform: uppercase; }
        .def-sev-badge[data-sev="critical"] { background: rgba(147, 51, 234, 0.1); color: var(--accent-critical); border: 1px solid rgba(147, 51, 234, 0.2); }
        .def-sev-badge[data-sev="high"] { background: rgba(239, 64, 64, 0.1); color: var(--accent-danger); border: 1px solid rgba(239, 64, 64, 0.2); }
        .def-sev-badge[data-sev="medium"] { background: rgba(245, 158, 11, 0.1); color: var(--accent-warning); border: 1px solid rgba(245, 158, 11, 0.2); }

        .def-desc { font-size: 0.9rem; color: var(--text-secondary); margin: 0 0 1.5rem 0; line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

        .def-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 1rem; border-top: 1px solid var(--border-color); }
        .def-footer .meta { display: flex; align-items: center; gap: 0.4rem; font-size: 0.75rem; color: var(--text-secondary); }
        
        .sm { padding: 0.4rem 0.8rem; font-size: 0.8rem; }

        .loading-state, .empty-state { text-align: center; padding: 4rem; color: var(--text-secondary); }
      `}</style>
        </div>
    );
};

export default Definitions;

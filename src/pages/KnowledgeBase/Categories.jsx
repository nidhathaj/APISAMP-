import React, { useEffect, useState } from 'react';
import { kbService } from '../../services/api';
import { Shield, ChevronRight, Plus, Search } from 'lucide-react';
import { motion } from 'framer-motion';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await kbService.getCategories();
                const mockFallback = [
                    { id: 1, code: 'A01:2021', name: 'Broken Access Control', description: 'Broken access control occurs when users can access data or perform actions outside of their intended permissions.' },
                    { id: 2, code: 'A03:2021', name: 'Injection', description: 'Injection flaws, such as SQL, NoSQL, OS, and LDAP injection, occur when untrusted data is sent to an interpreter.' },
                    { id: 3, code: 'A05:2021', name: 'Security Misconfiguration', description: 'Security misconfiguration is the most common security issue, often due to default configurations or incomplete setups.' }
                ];
                setCategories(Array.isArray(data) && data.length > 0 ? data : mockFallback);
            } catch (err) {
                console.warn('Backend missing, using mock categories');
                setCategories([
                    { id: 1, code: 'A01:2021', name: 'Broken Access Control', description: 'Broken access control occurs when users can access data or perform actions outside of their intended permissions.' },
                    { id: 2, code: 'A03:2021', name: 'Injection', description: 'Injection flaws, such as SQL, NoSQL, OS, and LDAP injection, occur when untrusted data is sent to an interpreter.' },
                    { id: 3, code: 'A05:2021', name: 'Security Misconfiguration', description: 'Security misconfiguration is the most common security issue, often due to default configurations or incomplete setups.' }
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    const filteredCategories = Array.isArray(categories) ? categories.filter(cat =>
        (cat?.name?.toLowerCase()?.includes(searchTerm.toLowerCase())) ||
        (cat?.code?.toLowerCase()?.includes(searchTerm.toLowerCase()))
    ) : [];

    return (
        <div className="kb-container">
            <div className="section-header">
                <div>
                    <h1>OWASP Categories</h1>
                    <p>Global classification for security vulnerabilities.</p>
                </div>
                <button className="primary" onClick={() => navigate('/kb/definitions')}>
                    <Plus size={18} /> Add Category
                </button>
            </div>

            <div className="filter-bar glass-panel">
                <div className="search-input">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Search categories (e.g. Injection, A01)..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="categories-grid">
                {loading ? (
                    <div className="loading-state">Loading categories...</div>
                ) : filteredCategories.length > 0 ? filteredCategories.map((cat, i) => (
                    <motion.div
                        key={cat.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="glass-card category-card"
                    >
                        <div className="category-icon">
                            <Shield size={24} />
                        </div>
                        <div className="category-details">
                            <div className="category-meta">
                                <span className="category-code">{cat.code}</span>
                            </div>
                            <h3>{cat.name}</h3>
                            <p>{cat.description}</p>
                        </div>
                        <div className="category-action">
                            <ChevronRight size={20} />
                        </div>
                    </motion.div>
                )) : (
                    <div className="empty-state">No categories found matching your search.</div>
                )}
            </div>

            <style>{`
        .kb-container { padding: 1rem; }
        .section-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2rem; }
        .section-header h1 { margin: 0; font-size: 1.5rem; }
        .section-header p { color: var(--text-secondary); margin: 0.25rem 0 0 0; }

        .filter-bar { padding: 1rem; margin-bottom: 1.5rem; }
        .search-input { display: flex; align-items: center; gap: 0.75rem; color: var(--text-secondary); }
        .search-input input { background: transparent; border: none; padding: 0; }
        .search-input input:focus { box-shadow: none; border: none; }

        .categories-grid { display: grid; gap: 1rem; }
        
        .category-card {
          padding: 1.25rem;
          display: flex;
          align-items: center;
          gap: 1.25rem;
          cursor: pointer;
        }

        .category-icon {
          width: 48px;
          height: 48px;
          background: rgba(59, 130, 246, 0.1);
          color: var(--accent-primary);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .category-details { flex: 1; }
        .category-details h3 { font-size: 1rem; margin: 0.25rem 0; }
        .category-details p { font-size: 0.875rem; color: var(--text-secondary); margin: 0; line-height: 1.4; }

        .category-meta { margin-bottom: 0.25rem; }
        .category-code {
          font-size: 0.7rem;
          font-weight: 700;
          background: rgba(255, 255, 255, 0.05);
          padding: 0.1rem 0.4rem;
          border-radius: 4px;
          color: var(--accent-primary);
          text-transform: uppercase;
        }

        .category-action { color: var(--text-secondary); opacity: 0.5; }
        .category-card:hover .category-action { opacity: 1; color: var(--accent-primary); }

        .loading-state, .empty-state { text-align: center; padding: 3rem; color: var(--text-secondary); }
      `}</style>
        </div>
    );
};

export default Categories;

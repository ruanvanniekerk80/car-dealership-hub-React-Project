import React from 'react';

export default function Navbar({ currentView, onViewChange, currentFilter, onFilterChange }) {
    return (
        <nav style={styles.nav}>
            <div style={styles.navContainer}>
                {/* Brand Logo / Home trigger */}
                <div
                    onClick={() => onViewChange('catalog')}
                    style={{ ...styles.brand, cursor: 'pointer' }}
                >
                    🏁 Ruan's Dealership
                </div>

                {/* Category Filters (Only show when looking at the catalog) */}
                {currentView === 'catalog' && (
                    <div style={styles.filterGroup}>
                        {['All', 'New', 'Used'].map((category) => (
                            <button
                                key={category}
                                onClick={() => onFilterChange(category)}
                                style={{
                                    ...styles.filterBtn,
                                    backgroundColor: currentFilter === category ? '#21262d' : 'transparent',
                                    borderColor: currentFilter === category ? '#58a6ff' : '#30363d',
                                    color: currentFilter === category ? '#58a6ff' : '#c9d1d9'
                                }}
                            >
                                {category} Stock
                            </button>
                        ))}
                    </div>
                )}

                {/* View Switch / Control Toggle */}
                <div>
                    {currentView === 'admin' ? (
                        <button onClick={() => onViewChange('catalog')} style={styles.signOutBtn}>
                            Exit Control Desk
                        </button>
                    ) : (
                        <button onClick={() => onViewChange('admin')} style={styles.signInBtn}>
                            Employee Login
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
}

const styles = {
    nav: {
        backgroundColor: '#161b22',
        borderBottom: '1px solid #30363d',
        padding: '0 20px',
        position: 'sticky',
        top: 0,
        zIndex: 100
    },
    navContainer: {
        maxWidth: '1200px',
        height: '64px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    brand: {
        fontSize: '1.25rem',
        fontWeight: 'bold',
        color: '#e6edf3',
        letterSpacing: '0.5px'
    },
    filterGroup: {
        display: 'flex',
        gap: '8px'
    },
    filterBtn: {
        padding: '6px 14px',
        border: '1px solid',
        borderRadius: '6px',
        fontSize: '0.9rem',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'all 0.1s ease'
    },
    signInBtn: {
        padding: '8px 16px',
        backgroundColor: '#21262d',
        color: '#c9d1d9',
        border: '1px solid #30363d',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: '500'
    },
    signOutBtn: {
        padding: '8px 16px',
        backgroundColor: '#21262d',
        color: '#f85149',
        border: '1px solid #f85149',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: '500'
    }
};
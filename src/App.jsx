import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Catalog from './pages/Catalog';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';

export default function App() {
  const [view, setView] = useState('catalog');         // 'catalog', 'login', or 'admin'
  const [filter, setFilter] = useState('All');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Custom view toggle handling
  const handleViewChange = (targetView) => {
    if (targetView === 'admin' && !isAuthenticated) {
      setView('login'); // Require login if not authenticated yet
    } else {
      setView(targetView);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setView('catalog');
  };

  return (
    <div style={{ backgroundColor: '#0d1117', minHeight: '100vh', margin: 0 }}>
      <Navbar
        currentView={view === 'login' ? 'catalog' : view} // Keep nav consistent during login view
        onViewChange={handleViewChange}
        currentFilter={filter}
        onFilterChange={setFilter}
      />

      <main>
        {view === 'catalog' && <Catalog filter={filter} />}

        {view === 'login' && (
          <Login onLoginSuccess={() => {
            setIsAuthenticated(true);
            setView('admin');
          }} />
        )}

        {view === 'admin' && isAuthenticated && (
          <div style={{ position: 'relative' }}>
            {/* Quick manual log out action button top deck shortcut */}
            <button
              onClick={handleLogout}
              style={{ position: 'absolute', top: '10px', right: '20px', padding: '6px 12px', backgroundColor: '#f85149', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold', zIndex: 10 }}
            >
              Sign Out Securely
            </button>
            <AdminDashboard />
          </div>
        )}
      </main>
    </div>
  );
}
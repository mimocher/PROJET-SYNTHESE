// src/pages/secretaire/SecretaireLayout.jsx
import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/authActions';
import './secretaire.css';

const LINKS = [
  { to: '/secretaire',               icon: '📊', label: 'Tableau de bord' },
  { to: '/secretaire/patients',      icon: '👥', label: 'Patients'        },
  { to: '/secretaire/agenda',        icon: '📅', label: 'Agenda'          },
  { to: '/secretaire/facturation',   icon: '💳', label: 'Facturation'     },
  { to: '/secretaire/communication', icon: '✉️',  label: 'Communication'  },
];

export default function SecretaireLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user     = useSelector(s => s.auth?.user);

  const initiales = user?.name
    ? user.name.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2)
    : 'SC';

  const handleLogout = () => { dispatch(logout()); navigate('/login'); };

  return (
    <div className="sec-layout">

      {/* ── Navbar ── */}
      <nav className="sec-navbar">
        <div className="sec-navbar-brand">
          <div className="sec-navbar-logo">BS</div>
          <div className="sec-navbar-title">Bright <em>Smile</em></div>
        </div>
        <div className="sec-navbar-right">
          <div className="sec-avatar">{initiales}</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--sec-dark)' }}>{user?.name || 'Secrétaire'}</div>
            <div style={{ fontSize: 10, color: 'var(--sec-muted)' }}>Secrétaire</div>
          </div>
        </div>
      </nav>

      <div className="sec-body">

        {/* ── Sidebar ── */}
        <aside className="sec-sidebar">
          <div className="sec-sidebar-label">Navigation</div>
          {LINKS.map(({ to, icon, label }) => (
            <NavLink
              key={to} to={to} end={to === '/secretaire'}
              className={({ isActive }) => `sec-nav-link${isActive ? ' sec-active' : ''}`}
            >
              <span className="sec-nav-icon">{icon}</span>
              {label}
            </NavLink>
          ))}
          <div style={{ flex: 1 }} />
          <div className="sec-sidebar-label">Compte</div>
          <button className="sec-nav-link" onClick={handleLogout} style={{ color: 'var(--sec-red)' }}>
            <span className="sec-nav-icon">🚪</span> Déconnexion
          </button>
        </aside>

        {/* ── Contenu ── */}
        <main className="sec-main">
          <Outlet />
        </main>

      </div>
    </div>
  );
}
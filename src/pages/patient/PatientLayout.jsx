import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/authActions';
import './patient.css';
import logo from '../../assets/dental.png'; // adapte le chemin si besoin

const LINKS = [
  { to: '/patient',             label: 'DASHBORD'         },
  { to: '/patient/prendre-rdv', label: 'PRENDRE RDV'     },
  { to: '/patient/rdv',         label: 'MES RENDEZ-VOUS' },
  { to: '/patient/dossier',     label: 'MON DOSSIER'     },
  { to: '/patient/factures',    label: 'MES FACTURES'    },
  { to: '/patient/ordonnances', label: 'ORDONNANCES'     },
  { to: '/patient/profil', label: 'PROFIL'     },
];

export default function PatientLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(s => s.auth?.user);

  const initiales = user?.name
    ? user.name.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2)
    : 'PA';

  return (
    <div className="pat-layout">
      <nav className="pat-topnav">
        <div className="pat-topnav-brand">
          <div className="pat-topnav-logo">
            <img
              src={logo}
              alt="Logo Bright Smile"
              className="pat-topnav-logo-img"
            />
          </div>

          <div>
            <div className="pat-topnav-name">BRIGHT SMILE</div>
            <div className="pat-topnav-sub">CLINIQUE DENTAIRE</div>
          </div>
        </div>

        <div className="pat-topnav-links">
          {LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/patient'}
              className={({ isActive }) =>
                `pat-topnav-link${isActive ? ' pat-topnav-active' : ''}`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>

        <div className="pat-topnav-right">
          <div className="pat-topnav-avatar">{initiales}</div>
          <span className="pat-topnav-username">
            Bonjour, {user?.name || 'Patient'}
          </span>
          <button
            className="pat-topnav-logout"
            onClick={() => {
              dispatch(logout());
              navigate('/login');
            }}
          >
            DÉCONNEXION
          </button>
        </div>
      </nav>

      <main className="pat-content">
        <Outlet />
      </main>
    </div>
  );
}
// // src/pages/patient/Dashboard.jsx
// // (page index de /patient)
// import React from 'react';
// import { useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';

// const NOTIFS = [
//   { id: 1, type: 'info', texte: 'Rappel : RDV demain à 10h00 avec Dr. Benali', temps: 'Il y a 1h' },
//   { id: 2, type: 'ok',   texte: 'Ordonnance du 15/01/2025 disponible en téléchargement', temps: 'Il y a 2 jours' },
//   { id: 3, type: 'warn', texte: 'Facture FAC-0092 en attente de paiement', temps: 'Il y a 3 jours' },
// ];

// const DOT = { info: 'var(--pat-blue)', ok: 'var(--pat-green)', warn: 'var(--pat-amber)' };

// export default function Dashboard() {
//   const navigate = useNavigate();
//   const user     = useSelector(s => s.auth?.user);
//   const dateLabel = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

//   return (
//     <div>
//       <div className="pat-page-header">
//         <div className="pat-page-label">Tableau de bord</div>
//         <h1 className="pat-page-title">Bonjour, <em>{user?.name?.split(' ')[0] || 'Patient'}</em></h1>
//         <p className="pat-page-sub">{dateLabel}</p>
//       </div>

//       <div className="pat-stats-grid">
//         <div className="pat-stat-card">
//           <div className="pat-stat-val">2</div>
//           <div className="pat-stat-lbl">RDV à venir</div>
//           <div className="pat-stat-delta pat-delta-info">Prochains</div>
//         </div>
//         <div className="pat-stat-card">
//           <div className="pat-stat-val">5</div>
//           <div className="pat-stat-lbl">Consultations</div>
//           <div className="pat-stat-delta pat-delta-up">Depuis 2024</div>
//         </div>
//         <div className="pat-stat-card">
//           <div className="pat-stat-val">1</div>
//           <div className="pat-stat-lbl">Facture en attente</div>
//           <div className="pat-stat-delta pat-delta-warn">450 MAD</div>
//         </div>
//         <div className="pat-stat-card">
//           <div className="pat-stat-val">3</div>
//           <div className="pat-stat-lbl">Ordonnances</div>
//           <div className="pat-stat-delta pat-delta-up">Disponibles</div>
//         </div>
//       </div>

//       <div className="pat-grid-2">
//         {/* Prochain RDV */}
//         <div className="pat-card">
//           <div className="pat-card-title">
//   Prochain rendez-vous
//   <button
//     className="pat-card-action"
//     onClick={() => navigate('/patient/rdv')}
//   >
//     Voir tout ›
//   </button>
// </div>
//           <div style={{ padding: '14px 16px', background: 'var(--pat-red-light)', borderRadius: 10, borderLeft: '3px solid var(--pat-red)' }}>
//             <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--pat-dark)', marginBottom: 4 }}>
//               Demain — Mardi 2 avril 2025
//             </div>
//             <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--pat-dark)', marginBottom: 4 }}>
//               10:00 — Détartrage + bilan
//             </div>
//             <div style={{ fontSize: 12, color: 'var(--pat-muted)' }}>Dr. Benali — Cabinet Bright Smile</div>
//             <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
//               <span style={{ fontSize: 10, background: 'var(--pat-red)', color: '#fff', padding: '2px 8px', borderRadius: 6 }}>Confirmé</span>
//             </div>
//           </div>
//           <div style={{ marginTop: 12 }}>
//             <button className="pat-btn-primary" style={{ width: '100%' }} onClick={() => navigate('/patient/prendre-rdv')}>
//               + Prendre un nouveau RDV
//             </button>
//           </div>
//         </div>

//         {/* Notifications */}
//         <div className="pat-card">
//           <div className="pat-card-title">Notifications</div>
//           <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
//             {NOTIFS.map(n => (
//               <div key={n.id} style={{ display: 'flex', gap: 8, padding: '8px 10px', background: 'var(--pat-bg)', borderRadius: 8, alignItems: 'flex-start' }}>
//                 <div style={{ width: 8, height: 8, borderRadius: '50%', background: DOT[n.type], marginTop: 5, flexShrink: 0 }} />
//                 <div>
//                   <div style={{ fontSize: 12, color: 'var(--pat-dark)', lineHeight: 1.4 }}>{n.texte}</div>
//                   <div style={{ fontSize: 10, color: 'var(--pat-muted)', marginTop: 2 }}>{n.temps}</div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Accès rapides */}
//   <div className="pat-card">
//   <div className="pat-card-title">Accès rapides</div>
//   <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
//     {[
//       { icon: '📅', label: 'Prendre un RDV',  path: '/patient/prendre-rdv' },
//       { icon: '📋', label: 'Mon dossier',     path: '/patient/dossier' },
//       { icon: '📝', label: 'Mes ordonnances', path: '/patient/ordonnances' },
//       { icon: '💳', label: 'Mes factures',    path: '/patient/factures' },
//       { icon: '👤', label: 'Mon profil',      path: '/patient/profil' },
//       { icon: '🗓️', label: 'Mes rendez-vous', path: '/patient/rdv' },
//     ].map(item => (
//       <button
//         key={item.path}
//         onClick={() => navigate(item.path)}
//         style={{
//           display: 'flex',
//           flexDirection: 'column',
//           alignItems: 'center',
//           gap: 6,
//           padding: '14px 10px',
//           background: 'var(--pat-bg)',
//           border: '0.5px solid var(--pat-border)',
//           borderRadius: 10,
//           cursor: 'pointer',
//           transition: 'all .18s',
//           fontSize: 13,
//           color: 'var(--pat-dark)',
//         }}
//         onMouseEnter={e => {
//           e.currentTarget.style.background = 'var(--pat-red-light)';
//           e.currentTarget.style.color = 'var(--pat-red)';
//         }}
//         onMouseLeave={e => {
//           e.currentTarget.style.background = 'var(--pat-bg)';
//           e.currentTarget.style.color = 'var(--pat-dark)';
//         }}
//       >
//         <span style={{ fontSize: 22 }}>{item.icon}</span>
//         <span style={{ fontWeight: 500 }}>{item.label}</span>
//       </button>
//     ))}
//   </div>
// </div>
//     </div>
//   );
// }
// src/pages/patient/Dashboard.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const NOTIFS = [
  { id: 1, type: 'info', texte: 'Rappel : RDV demain à 10h00 avec Dr. Benali', temps: 'Il y a 1h' },
  { id: 2, type: 'ok',   texte: 'Ordonnance du 15/01/2025 disponible en téléchargement', temps: 'Il y a 2 jours' },
  { id: 3, type: 'warn', texte: 'Facture FAC-0092 en attente de paiement', temps: 'Il y a 3 jours' },
];

const DOT_COLOR = {
  info: 'var(--pat-blue)',
  ok:   'var(--pat-green)',
  warn: 'var(--pat-amber)',
};

const IconCalendar = () => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.3">
    <rect x="3" y="4" width="14" height="13" rx="2"/>
    <path d="M3 8h14M7 2v4M13 2v4" strokeLinecap="round"/>
  </svg>
);
const IconDossier = () => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.3">
    <path d="M5 3h10a1 1 0 011 1v13a1 1 0 01-1 1H5a1 1 0 01-1-1V4a1 1 0 011-1z"/>
    <path d="M7 7h6M7 10h6M7 13h4" strokeLinecap="round"/>
  </svg>
);
const IconOrdonnance = () => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.3">
    <path d="M6 3h8a1 1 0 011 1v12a1 1 0 01-1 1H6a1 1 0 01-1-1V4a1 1 0 011-1z"/>
    <path d="M7 7h6M7 10h6M7 13h3" strokeLinecap="round"/>
  </svg>
);
const IconFacture = () => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.3">
    <rect x="2" y="5" width="16" height="11" rx="2"/>
    <path d="M2 9h16"/>
    <circle cx="6" cy="13" r="1" fill="currentColor"/>
  </svg>
);
const IconProfil = () => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.3">
    <circle cx="10" cy="7" r="3"/>
    <path d="M4 17c0-3.314 2.686-5 6-5s6 1.686 6 5" strokeLinecap="round"/>
  </svg>
);
const IconRdvList = () => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.3">
    <rect x="3" y="4" width="14" height="13" rx="2"/>
    <path d="M3 8h14M7 2v4M13 2v4M7 12h2M11 12h2M7 14.5h2M11 14.5h2" strokeLinecap="round"/>
  </svg>
);

const ACCES = [
  { Icon: IconCalendar,   label: 'Prendre un RDV',  path: '/patient/prendre-rdv' },
  { Icon: IconDossier,    label: 'Mon dossier',      path: '/patient/dossier' },
  { Icon: IconOrdonnance, label: 'Mes ordonnances',  path: '/patient/ordonnances' },
  { Icon: IconFacture,    label: 'Mes factures',     path: '/patient/factures' },
  { Icon: IconProfil,     label: 'Mon profil',       path: '/patient/profil' },
  { Icon: IconRdvList,    label: 'Mes rendez-vous',  path: '/patient/rdv' },
];

export default function Dashboard() {
  const navigate  = useNavigate();
  const user      = useSelector(s => s.auth?.user);
  const dateLabel = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <div>
      {/* En-tête */}
      <div className="pat-page-header">
        <div className="pat-page-label">Tableau de bord</div>
        <h1 className="pat-page-title">
          Bonjour, <em>{user?.name?.split(' ')[0] || 'Patient'}</em>
        </h1>
        <p className="pat-page-sub">{dateLabel}</p>
      </div>

      {/* Stats */}
      <div className="pat-stats-grid">
        {[
          { val: 2, lbl: 'RDV à venir',        delta: 'Prochains',    cls: 'pat-delta-info' },
          { val: 5, lbl: 'Consultations',       delta: 'Depuis 2024',  cls: 'pat-delta-up'   },
          { val: 1, lbl: 'Facture en attente',  delta: '450 MAD',      cls: 'pat-delta-warn' },
          { val: 3, lbl: 'Ordonnances',         delta: 'Disponibles',  cls: 'pat-delta-up'   },
        ].map(({ val, lbl, delta, cls }) => (
          <div key={lbl} className="pat-stat-card">
            <div className="pat-stat-val">{val}</div>
            <div className="pat-stat-lbl">{lbl}</div>
            <div className={`pat-stat-delta ${cls}`}>{delta}</div>
          </div>
        ))}
      </div>

      {/* Grille 2 colonnes */}
      <div className="pat-grid-2">
        {/* Prochain RDV */}
        <div className="pat-card">
          <div className="pat-card-title">
            Prochain rendez-vous
            <button className="pat-card-action" onClick={() => navigate('/patient/rdv')}>
              Voir tout ›
            </button>
          </div>
          <div style={{ padding: '12px 14px', background: 'var(--pat-red-light)', borderRadius: 8, borderLeft: '2px solid var(--pat-red)' }}>
            <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--pat-muted)', marginBottom: 4 }}>
              Mardi 2 avril 2025 — Demain
            </div>
            <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--pat-dark)', marginBottom: 3 }}>
              10:00 — Détartrage + bilan
            </div>
            <div style={{ fontSize: 12, color: 'var(--pat-muted)' }}>
              Dr. Benali · Cabinet Bright Smile
            </div>
            <span style={{
              display: 'inline-block', marginTop: 10,
              fontSize: 10, fontWeight: 500,
              background: 'var(--pat-red)', color: '#fff',
              padding: '2px 10px', borderRadius: 20,
            }}>
              Confirmé
            </span>
          </div>
          <button
            className="pat-btn-primary"
            style={{ width: '100%', marginTop: 12 }}
            onClick={() => navigate('/patient/prendre-rdv')}
          >
            + Prendre un nouveau RDV
          </button>
        </div>

        {/* Notifications */}
        <div className="pat-card">
          <div className="pat-card-title">Notifications</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {NOTIFS.map(n => (
              <div key={n.id} style={{ display: 'flex', gap: 10, padding: '9px 10px', background: 'var(--pat-bg)', borderRadius: 8, alignItems: 'flex-start' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: DOT_COLOR[n.type], marginTop: 5, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 12, color: 'var(--pat-dark)', lineHeight: 1.45 }}>{n.texte}</div>
                  <div style={{ fontSize: 10, color: 'var(--pat-muted)', marginTop: 2 }}>{n.temps}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Accès rapides */}
      <div className="pat-card">
        <div className="pat-card-title">Accès rapides</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {ACCES.map(({ Icon, label, path }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7,
                padding: '14px 8px',
                background: 'var(--pat-bg)',
                border: '0.5px solid var(--pat-border)',
                borderRadius: 8,
                cursor: 'pointer',
                fontSize: 12, fontWeight: 500,
                color: 'var(--pat-dark)',
                transition: 'all .15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--pat-red-light)'; e.currentTarget.style.color = 'var(--pat-red)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--pat-bg)'; e.currentTarget.style.color = 'var(--pat-dark)'; }}
            >
              <Icon />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
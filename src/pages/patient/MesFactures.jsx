// // src/pages/patient/MesFactures.jsx
// import React, { useState } from 'react';

// const FACTURES = [
//   { id: 92, numero: 'FAC-0092', date: '01/04/2025', acte: 'Détartrage',          montant: 450,  statut: 'pending' },
//   { id: 91, numero: 'FAC-0091', date: '15/01/2025', acte: 'Détartrage + bilan',  montant: 450,  statut: 'paid'    },
//   { id: 90, numero: 'FAC-0090', date: '03/11/2024', acte: 'Obturation carie',    montant: 350,  statut: 'paid'    },
//   { id: 89, numero: 'FAC-0089', date: '20/08/2024', acte: 'Consultation générale', montant: 150, statut: 'paid'   },
// ];

// const LABELS = { paid: 'Payé', pending: 'En attente', unpaid: 'Impayé' };

// export default function MesFactures() {
//   const [selected, setSelected] = useState(null);

//   const totalImpaye = FACTURES
//     .filter(f => f.statut !== 'paid')
//     .reduce((s, f) => s + f.montant, 0);

//   return (
//     <div>
//       <div className="pat-page-header">
//         <div className="pat-page-label">Facturation</div>
//         <h1 className="pat-page-title">Mes <em>factures</em></h1>
//         <p className="pat-page-sub">Historique de vos paiements</p>
//       </div>

//       {totalImpaye > 0 && (
//         <div style={{ background: 'var(--pat-red-light)', border: '0.5px solid var(--pat-red-mid)', borderRadius: 10, padding: '12px 16px', marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//           <div>
//             <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--pat-red)' }}>Solde en attente</div>
//             <div style={{ fontSize: 11, color: 'var(--pat-muted)' }}>Vous avez {FACTURES.filter(f => f.statut !== 'paid').length} facture(s) non réglée(s)</div>
//           </div>
//           <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, fontWeight: 600, color: 'var(--pat-red)' }}>
//             {totalImpaye.toLocaleString('fr-MA')} MAD
//           </div>
//         </div>
//       )}

//       <div className="pat-card">
//         <div className="pat-card-title">Toutes mes factures</div>
//         <div className="pat-facture-list">
//           {FACTURES.map(f => (
//             <div key={f.id} className="pat-facture-row">
//               <div className="pat-facture-num">{f.numero}</div>
//               <div className="pat-facture-info">
//                 <div className="pat-facture-name">{f.acte}</div>
//                 <div className="pat-facture-date">{f.date}</div>
//               </div>
//               <div className="pat-facture-amt">{f.montant.toLocaleString('fr-MA')} MAD</div>
//               <span className={`pat-badge pat-badge-${f.statut === 'paid' ? 'paid' : 'pending'}`}>
//                 {LABELS[f.statut]}
//               </span>
//               <button className="pat-btn-icon" onClick={() => setSelected(f)} title="Voir le détail">📄</button>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Modale détail */}
//       {selected && (
//         <div className="pat-modal-overlay" onClick={() => setSelected(null)}>
//           <div className="pat-modal-box" onClick={e => e.stopPropagation()}>
//             <div className="pat-card-title" style={{ marginBottom: 18 }}>
//               Facture {selected.numero}
//               <button className="pat-card-action" onClick={() => setSelected(null)}>✕</button>
//             </div>
//             <div className="pat-info-row"><span className="pat-info-key">Numéro</span><span className="pat-info-val">{selected.numero}</span></div>
//             <div className="pat-info-row"><span className="pat-info-key">Date</span><span className="pat-info-val">{selected.date}</span></div>
//             <div className="pat-info-row"><span className="pat-info-key">Acte</span><span className="pat-info-val">{selected.acte}</span></div>
//             <div className="pat-info-row"><span className="pat-info-key">Praticien</span><span className="pat-info-val">Dr. Benali</span></div>
//             <div className="pat-info-row"><span className="pat-info-key">Cabinet</span><span className="pat-info-val">Bright Smile, 45 Bd Anfa</span></div>
//             <div className="pat-info-row">
//               <span className="pat-info-key">Montant</span>
//               <span className="pat-info-val">{selected.montant.toLocaleString('fr-MA')} MAD</span>
//             </div>
//             <div className="pat-info-row">
//               <span className="pat-info-key">Statut</span>
//               <span className={`pat-badge pat-badge-${selected.statut === 'paid' ? 'paid' : 'pending'}`}>{LABELS[selected.statut]}</span>
//             </div>
//             <button className="pat-btn-primary" style={{ width: '100%', marginTop: 16 }} onClick={() => alert('Téléchargement PDF — fonctionnalité à connecter au backend.')}>
//               📄 Télécharger le PDF
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
// src/pages/patient/MesFactures.jsx
import React, { useState } from 'react';

const FACTURES = [
  { id: 92, numero: 'FAC-0092', date: '01/04/2025', acte: 'Détartrage',           montant: 450,  statut: 'pending' },
  { id: 91, numero: 'FAC-0091', date: '15/01/2025', acte: 'Détartrage + bilan',   montant: 450,  statut: 'paid'    },
  { id: 90, numero: 'FAC-0090', date: '03/11/2024', acte: 'Obturation carie',     montant: 350,  statut: 'paid'    },
  { id: 89, numero: 'FAC-0089', date: '20/08/2024', acte: 'Consultation générale',montant: 150,  statut: 'paid'    },
];

const STATUT = {
  paid:    { label: 'Payé',       bg: '#eaf6f0', color: '#1a7a4a', icon: '✅' },
  pending: { label: 'En attente', bg: '#fff8e6', color: '#cc8800', icon: '⏳' },
  unpaid:  { label: 'Impayé',     bg: '#f9eceb', color: '#C0392B', icon: '❌' },
};

export default function MesFactures() {
  const [selected, setSelected] = useState(null);

  const totalImpaye = FACTURES.filter(f => f.statut !== 'paid').reduce((s, f) => s + f.montant, 0);
  const totalPaye   = FACTURES.filter(f => f.statut === 'paid').reduce((s, f) => s + f.montant, 0);

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'inline-flex', background: 'var(--pat-red)', color: '#fff', fontSize: 10, fontWeight: 500, padding: '3px 12px', borderRadius: 12, letterSpacing: '.6px', textTransform: 'uppercase', marginBottom: 8 }}>
          Facturation
        </div>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 26, color: 'var(--pat-dark)', margin: '0 0 4px' }}>
          Mes <em style={{ fontStyle: 'italic', color: 'var(--pat-red)' }}>factures</em>
        </h1>
        <p style={{ fontSize: 13, color: 'var(--pat-muted)', margin: 0 }}>Historique de vos paiements au cabinet</p>
      </div>

      {/* Résumé */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 24 }}>
        <div style={{ background: '#fff', border: '0.5px solid var(--pat-border)', borderRadius: 14, padding: '20px 22px', borderTop: '3px solid var(--pat-green)' }}>
          <div style={{ fontSize: 12, color: 'var(--pat-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.06em' }}>Total réglé</div>
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, fontWeight: 600, color: 'var(--pat-green)' }}>
            {totalPaye.toLocaleString('fr-MA')} <span style={{ fontSize: 16 }}>MAD</span>
          </div>
          <div style={{ fontSize: 11, color: 'var(--pat-muted)', marginTop: 4 }}>{FACTURES.filter(f => f.statut === 'paid').length} facture(s) payée(s)</div>
        </div>
        <div style={{ background: '#fff', border: '0.5px solid var(--pat-border)', borderRadius: 14, padding: '20px 22px', borderTop: `3px solid ${totalImpaye > 0 ? 'var(--pat-red)' : 'var(--pat-green)'}` }}>
          <div style={{ fontSize: 12, color: 'var(--pat-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.06em' }}>Solde restant</div>
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, fontWeight: 600, color: totalImpaye > 0 ? 'var(--pat-red)' : 'var(--pat-green)' }}>
            {totalImpaye.toLocaleString('fr-MA')} <span style={{ fontSize: 16 }}>MAD</span>
          </div>
          <div style={{ fontSize: 11, color: 'var(--pat-muted)', marginTop: 4 }}>
            {totalImpaye > 0 ? `${FACTURES.filter(f => f.statut !== 'paid').length} facture(s) en attente` : 'Aucun impayé'}
          </div>
        </div>
      </div>

      {/* Alerte impayé */}
      {totalImpaye > 0 && (
        <div style={{ background: 'var(--pat-red-light)', border: '0.5px solid var(--pat-red-mid)', borderRadius: 10, padding: '12px 16px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 18 }}>⚠️</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--pat-red)' }}>Vous avez une facture en attente</div>
            <div style={{ fontSize: 12, color: 'var(--pat-muted)' }}>Contactez le cabinet pour régulariser votre situation.</div>
          </div>
        </div>
      )}

      {/* Liste */}
      <div style={{ background: '#fff', border: '0.5px solid var(--pat-border)', borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ padding: '16px 22px', borderBottom: '0.5px solid var(--pat-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--pat-dark)' }}>Toutes mes factures</div>
          <span style={{ fontSize: 11, background: 'var(--pat-bg)', color: 'var(--pat-muted)', padding: '3px 10px', borderRadius: 8 }}>
            {FACTURES.length} facture(s)
          </span>
        </div>

        {FACTURES.map((f, i) => {
          const s = STATUT[f.statut] || STATUT.pending;
          return (
            <div key={f.id} style={{
              display: 'flex', alignItems: 'center', gap: 16, padding: '16px 22px',
              borderBottom: i < FACTURES.length - 1 ? '0.5px solid var(--pat-border)' : 'none',
              transition: 'background .15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--pat-bg)'}
            onMouseLeave={e => e.currentTarget.style.background = '#fff'}
            >
              <div style={{ fontSize: 24 }}>{s.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--pat-dark)' }}>{f.acte}</div>
                  <span style={{ fontSize: 10, color: 'var(--pat-muted)', background: 'var(--pat-bg)', padding: '1px 6px', borderRadius: 6 }}>{f.numero}</span>
                </div>
                <div style={{ fontSize: 11, color: 'var(--pat-muted)' }}>{f.date} · Cabinet Bright Smile</div>
              </div>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 16, fontWeight: 600, color: 'var(--pat-dark)' }}>
                {f.montant.toLocaleString('fr-MA')} MAD
              </div>
              <span style={{ fontSize: 11, padding: '4px 12px', borderRadius: 20, fontWeight: 500, background: s.bg, color: s.color }}>
                {s.label}
              </span>
              <button onClick={() => setSelected(f)}
                style={{ padding: '7px 14px', borderRadius: 8, border: '0.5px solid var(--pat-border)', background: '#fff', color: 'var(--pat-dark)', fontSize: 12, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', flexShrink: 0 }}>
                Détails
              </button>
            </div>
          );
        })}
      </div>

      {/* Modale */}
      {selected && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300 }}
          onClick={() => setSelected(null)}>
          <div style={{ background: '#fff', borderRadius: 16, padding: '28px 30px', width: 420, boxShadow: '0 20px 60px rgba(0,0,0,.15)' }}
            onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, color: 'var(--pat-dark)' }}>
                Facture <em style={{ color: 'var(--pat-red)', fontStyle: 'italic' }}>{selected.numero}</em>
              </div>
              <button onClick={() => setSelected(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: 'var(--pat-muted)' }}>✕</button>
            </div>
            {[
              { key: 'Numéro',    val: selected.numero },
              { key: 'Date',      val: selected.date },
              { key: 'Acte',      val: selected.acte },
              { key: 'Praticien', val: 'Dr. Benali' },
              { key: 'Cabinet',   val: 'Bright Smile, 45 Bd Anfa' },
              { key: 'Montant',   val: `${selected.montant.toLocaleString('fr-MA')} MAD` },
            ].map(({ key, val }) => (
              <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '0.5px solid var(--pat-border)', fontSize: 13 }}>
                <span style={{ color: 'var(--pat-muted)' }}>{key}</span>
                <span style={{ fontWeight: 500, color: 'var(--pat-dark)' }}>{val}</span>
              </div>
            ))}
            <button onClick={() => alert('PDF — à connecter au backend.')}
              style={{ width: '100%', marginTop: 20, padding: '11px', background: 'var(--pat-red)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
              📄 Télécharger le PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
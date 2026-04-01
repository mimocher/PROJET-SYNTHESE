// src/pages/secretaire/Dashboard.jsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { changeRdvStatus } from '../../redux/secretaireActions';

const STATUT_CFG = {
  confirmed: { classe: 'confirmed', badge: 'sec-badge-confirmed', label: 'Confirmé'  },
  pending:   { classe: 'pending',   badge: 'sec-badge-pending',   label: 'En attente' },
  urgent:    { classe: 'urgent',    badge: 'sec-badge-urgent',    label: 'Urgence'    },
  done:      { classe: 'done',      badge: 'sec-badge-done',      label: 'Terminé'    },
};
const SUIVANT = { confirmed: 'done', pending: 'confirmed', urgent: 'confirmed' };
const NOTIFS  = [
  { id: 1, type: 'danger', texte: 'Facture impayée — Mansouri K. (8 500 MAD)', temps: 'Il y a 2h' },
  { id: 2, type: 'warn',   texte: 'RDV annulé — Berrada N. à 15h30',          temps: 'Il y a 3h' },
  { id: 3, type: 'info',   texte: 'Rappels email envoyés — 3 patients',        temps: 'Ce matin'  },
];
const DOT = { danger: 'var(--sec-red)', warn: 'var(--sec-amber)', info: 'var(--sec-green)' };

export default function Dashboard() {
  const dispatch    = useDispatch();
  const rdvListe    = useSelector(s => s.rdv?.liste || []);
  const factures    = useSelector(s => s.factures?.liste || []);
  const today       = new Date().toISOString().split('T')[0];
  const rdvDuJour   = rdvListe.filter(r => r.date === today);
  const urgences    = rdvDuJour.filter(r => r.statut === 'urgent').length;
  const impayeTotal = factures.filter(f => f.statut !== 'paid').reduce((s, f) => s + (f.montant - (f.paye || 0)), 0);
  const dateLabel   = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div>
      <div className="sec-page-header">
        <div className="sec-page-label">Tableau de bord</div>
        <h1 className="sec-page-title">Espace <em>secrétaire</em></h1>
        <p className="sec-page-sub">{dateLabel}</p>
      </div>

      <div className="sec-stats-grid">
        <div className="sec-stat-card">
          <div className="sec-stat-val">{rdvDuJour.length}</div>
          <div className="sec-stat-lbl">RDV aujourd'hui</div>
          <div className="sec-stat-delta sec-delta-up">{rdvDuJour.filter(r => r.statut === 'confirmed').length} confirmés</div>
        </div>
        <div className="sec-stat-card">
          <div className="sec-stat-val">{rdvDuJour.filter(r => r.statut === 'pending').length}</div>
          <div className="sec-stat-lbl">En attente</div>
          <div className="sec-stat-delta sec-delta-warn">En salle</div>
        </div>
        <div className="sec-stat-card">
          <div className="sec-stat-val">7<span>K</span></div>
          <div className="sec-stat-lbl">Recettes du jour (MAD)</div>
          <div className="sec-stat-delta sec-delta-up">+2 paiements</div>
        </div>
        <div className="sec-stat-card">
          <div className="sec-stat-val" style={{ color: urgences > 0 ? 'var(--sec-red)' : undefined }}>{urgences}</div>
          <div className="sec-stat-lbl">Urgences</div>
          <div className={`sec-stat-delta ${urgences > 0 ? 'sec-delta-danger' : 'sec-delta-up'}`}>{urgences > 0 ? 'À traiter' : 'Aucune'}</div>
        </div>
      </div>

      <div className="sec-grid-3">
        <div className="sec-card sec-col-2">
          <div className="sec-card-title">RDV du jour — Dr. Benali</div>
          <div className="sec-rdv-list">
            {rdvDuJour.map(rdv => {
              const cfg = STATUT_CFG[rdv.statut] || STATUT_CFG.pending;
              return (
                <div key={rdv.id} className={`sec-rdv-item ${cfg.classe}`}>
                  <div className="sec-rdv-time">{rdv.heure}</div>
                  <div className="sec-rdv-info">
                    <div className="sec-rdv-name">{rdv.patient}</div>
                    <div className="sec-rdv-motif">{rdv.motif}</div>
                  </div>
                  <span className={`sec-badge ${cfg.badge}`}>{cfg.label}</span>
                  {rdv.statut !== 'done' && (
                    <button className="sec-btn-icon" onClick={() => dispatch(changeRdvStatus(rdv.id, SUIVANT[rdv.statut]))} title="Avancer">✓</button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="sec-card">
          <div className="sec-card-title">Notifications</div>
          <div className="sec-notif-list">
            {NOTIFS.map(n => (
              <div key={n.id} className="sec-notif-item">
                <div className="sec-notif-dot" style={{ background: DOT[n.type] }} />
                <div>
                  <div className="sec-notif-text">{n.texte}</div>
                  <div className="sec-notif-time">{n.temps}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="sec-card">
        <div className="sec-card-title">
          Solde impayé total
          <span style={{ fontFamily: 'Playfair Display,serif', fontSize: 18, fontWeight: 600, color: 'var(--sec-red)' }}>
            {impayeTotal.toLocaleString('fr-MA')} MAD
          </span>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {factures.filter(f => f.statut !== 'paid').map(f => (
            <span key={f.id} style={{ background: 'var(--sec-red-light)', color: 'var(--sec-red)', fontSize: 12, padding: '4px 10px', borderRadius: 8 }}>
              {f.patient} — {(f.montant - (f.paye || 0)).toLocaleString('fr-MA')} MAD
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
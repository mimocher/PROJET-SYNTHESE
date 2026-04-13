// src/pages/patient/RendezVous.jsx
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createRdvPatient, cancelRdvPatient } from '../../redux/patientActions';

const MOTIFS = [
  'Détartrage', 'Bilan + radiographie', 'Obturation / Carie',
  'Couronne', 'Extraction', 'Implant', 'Blanchiment',
  'Orthodontie', 'Urgence douleur', 'Contrôle annuel', 'Autre',
];

const CRENEAUX = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
                  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'];

const STATUT_LABELS = {
  confirmed: 'Confirmé', pending: 'En attente', done: 'Terminé', cancelled: 'Annulé',
};

// Mini calendrier interactif
function MiniCalendar({ selected, onSelect }) {
  const [mois, setMois] = useState(new Date());

  const annee    = mois.getFullYear();
  const moisNum  = mois.getMonth();
  const premier  = new Date(annee, moisNum, 1).getDay();
  const offset   = premier === 0 ? 6 : premier - 1; // lundi = 0
  const nbJours  = new Date(annee, moisNum + 1, 0).getDate();
  const today    = new Date().toISOString().split('T')[0];

  const label = mois.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });

  const toISO = (j) => {
    const d = new Date(annee, moisNum, j);
    return d.toISOString().split('T')[0];
  };

  const prev = () => setMois(m => new Date(m.getFullYear(), m.getMonth() - 1, 1));
  const next = () => setMois(m => new Date(m.getFullYear(), m.getMonth() + 1, 1));

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <button className="pat-btn-icon" onClick={prev}>‹</button>
        <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--pat-dark)', textTransform: 'capitalize' }}>
          {label}
        </span>
        <button className="pat-btn-icon" onClick={next}>›</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 3 }}>
        {['L','M','M','J','V','S','D'].map((j, i) => (
          <div key={i} style={{ textAlign: 'center', fontSize: 10, color: 'var(--pat-muted)', padding: '3px 0' }}>{j}</div>
        ))}

        {Array.from({ length: offset }).map((_, i) => <div key={`e${i}`} />)}

        {Array.from({ length: nbJours }, (_, i) => i + 1).map(j => {
          const iso     = toISO(j);
          const isToday = iso === today;
          const isPast  = iso < today;
          const isSel   = iso === selected;
          const isWE    = [0, 6].includes(new Date(annee, moisNum, j).getDay());

          return (
            <div
              key={j}
              onClick={() => !isPast && !isWE && onSelect(iso)}
              style={{
                textAlign: 'center', padding: '6px 2px', borderRadius: 6, fontSize: 12,
                cursor: isPast || isWE ? 'not-allowed' : 'pointer',
                background: isSel ? 'var(--pat-red)' : isToday ? 'var(--pat-red-light)' : 'transparent',
                color: isSel ? '#fff' : isPast || isWE ? 'var(--pat-border)' : 'var(--pat-dark)',
                fontWeight: isSel || isToday ? 600 : 400,
              }}
            >
              {j}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function RendezVous() {
  const dispatch = useDispatch();
  const rdvListe = useSelector(s => s.rdvPatient?.liste || []);

  const [tab, setTab]     = useState('liste'); // 'liste' | 'nouveau'
  const [dateRdv, setDate] = useState('');
  const [heure, setHeure]  = useState('');
  const [motif, setMotif]  = useState('');
  const [success, setSuccess] = useState(false);
  const [cancelMsg, setCancelMsg] = useState(null);

  const today = new Date().toISOString().split('T')[0];
  const rdvAVenir  = rdvListe.filter(r => r.date >= today && r.statut !== 'cancelled').sort((a,b) => a.date.localeCompare(b.date));
  const rdvPasses  = rdvListe.filter(r => r.date < today || r.statut === 'done' || r.statut === 'cancelled').sort((a,b) => b.date.localeCompare(a.date));

  const formatDate = d => new Date(d).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });

  const soumettre = () => {
    if (!dateRdv || !heure || !motif) return;
    dispatch(createRdvPatient({ date: dateRdv, heure, motif, dentiste: 'Dr. Benali' }));
    setSuccess(true);
    setDate(''); setHeure(''); setMotif('');
    setTimeout(() => { setSuccess(false); setTab('liste'); }, 2500);
  };

  const annuler = (rdv) => {
    const result = dispatch(cancelRdvPatient(rdv.id, rdv.date, rdv.heure));
    if (result && !result.ok) {
      setCancelMsg(result.message);
      setTimeout(() => setCancelMsg(null), 4000);
    }
  };

  const RdvItem = ({ rdv, showCancel }) => (
    <div className={`pat-rdv-item ${rdv.statut}`}>
      <div className="pat-rdv-date">{formatDate(rdv.date)}</div>
      <div className="pat-rdv-info">
        <div className="pat-rdv-motif">{rdv.motif}</div>
        <div className="pat-rdv-dent">{rdv.dentiste} — {rdv.heure}</div>
      </div>
      <span className={`pat-badge pat-badge-${rdv.statut}`}>{STATUT_LABELS[rdv.statut] || rdv.statut}</span>
      {showCancel && rdv.statut !== 'cancelled' && rdv.statut !== 'done' && (
        <button className="pat-btn-icon" style={{ color: 'var(--pat-red)', marginLeft: 4 }}
          onClick={() => annuler(rdv)} title="Annuler ce RDV">✕</button>
      )}
    </div>
  );

  return (
    <div>
      <div className="pat-page-header">
        <div className="pat-page-label">Rendez-vous</div>
        <h1 className="pat-page-title">Mes <em>rendez-vous</em></h1>
        <p className="pat-page-sub">Consultez et gérez vos consultations</p>
      </div>

      {/* Onglets */}
      <div className="pat-tab-bar" style={{ marginBottom: 20 }}>
        <button className={`pat-tab ${tab === 'liste' ? 'pat-tab-active' : ''}`} onClick={() => setTab('liste')}>
          Mes RDV
        </button>
        <button className={`pat-tab ${tab === 'nouveau' ? 'pat-tab-active' : ''}`} onClick={() => setTab('nouveau')}>
          + Prendre un RDV
        </button>
      </div>

      {/* ── Liste des RDV ── */}
      {tab === 'liste' && (
        <>
          {cancelMsg && <div className="pat-alert pat-alert-err">{cancelMsg}</div>}

          <div className="pat-card">
            <div className="pat-card-title">
              Rendez-vous à venir
              <span style={{ fontSize: 11, background: 'var(--pat-red-light)', color: 'var(--pat-red)', padding: '2px 8px', borderRadius: 8 }}>
                {rdvAVenir.length}
              </span>
            </div>
            <div className="pat-rdv-list">
              {rdvAVenir.length === 0
                ? <p style={{ textAlign: 'center', padding: 20, fontSize: 13, color: 'var(--pat-muted)' }}>Aucun rendez-vous à venir.</p>
                : rdvAVenir.map(rdv => <RdvItem key={rdv.id} rdv={rdv} showCancel />)
              }
            </div>
          </div>

          <div className="pat-card">
            <div className="pat-card-title">Historique des rendez-vous</div>
            <div className="pat-rdv-list">
              {rdvPasses.length === 0
                ? <p style={{ textAlign: 'center', padding: 20, fontSize: 13, color: 'var(--pat-muted)' }}>Aucun historique.</p>
                : rdvPasses.map(rdv => <RdvItem key={rdv.id} rdv={rdv} showCancel={false} />)
              }
            </div>
          </div>

          <div className="pat-alert pat-alert-warn">
            ⚠️ L'annulation d'un rendez-vous n'est possible que jusqu'à 24h avant la consultation.
          </div>
        </>
      )}

      {/* ── Nouveau RDV ── */}
      {tab === 'nouveau' && (
        <div className="pat-grid-2">
          {/* Calendrier */}
          <div className="pat-card">
            <div className="pat-card-title">Choisir une date</div>
            <MiniCalendar selected={dateRdv} onSelect={setDate} />

            {dateRdv && (
              <>
                <div style={{ margin: '14px 0 8px', fontSize: 12, color: 'var(--pat-muted)' }}>
                  Créneaux disponibles — {new Date(dateRdv).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 6 }}>
                  {CRENEAUX.map(c => (
                    <button
                      key={c}
                      onClick={() => setHeure(c)}
                      style={{
                        padding: '7px 4px', borderRadius: 6, border: '0.5px solid var(--pat-border)',
                        background: heure === c ? 'var(--pat-red)' : 'var(--pat-bg)',
                        color: heure === c ? '#fff' : 'var(--pat-dark)',
                        fontSize: 12, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
                      }}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Formulaire */}
          <div className="pat-card">
            <div className="pat-card-title">Détails du rendez-vous</div>

            {success ? (
              <div className="pat-alert pat-alert-ok" style={{ textAlign: 'center', padding: 24 }}>
                ✓ Rendez-vous pris avec succès !<br />
                <span style={{ fontSize: 12 }}>Vous recevrez une confirmation par email.</span>
              </div>
            ) : (
              <>
                <div className="pat-form-group">
                  <label className="pat-form-label">Date sélectionnée</label>
                  <div style={{
                    padding: '9px 12px', background: 'var(--pat-bg)', borderRadius: 8,
                    border: '0.5px solid var(--pat-border)', fontSize: 13, color: dateRdv ? 'var(--pat-dark)' : 'var(--pat-muted)',
                  }}>
                    {dateRdv
                      ? new Date(dateRdv).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
                      : 'Sélectionnez une date dans le calendrier'}
                  </div>
                </div>

                <div className="pat-form-group">
                  <label className="pat-form-label">Heure sélectionnée</label>
                  <div style={{
                    padding: '9px 12px', background: 'var(--pat-bg)', borderRadius: 8,
                    border: '0.5px solid var(--pat-border)', fontSize: 13, color: heure ? 'var(--pat-dark)' : 'var(--pat-muted)',
                  }}>
                    {heure || 'Sélectionnez un créneau horaire'}
                  </div>
                </div>

                <div className="pat-form-group">
                  <label className="pat-form-label">Motif de la consultation *</label>
                  <select className="pat-form-control" value={motif} onChange={e => setMotif(e.target.value)}>
                    <option value="">-- Sélectionner un motif --</option>
                    {MOTIFS.map(m => <option key={m}>{m}</option>)}
                  </select>
                </div>

                <div className="pat-form-group">
                  <label className="pat-form-label">Dentiste</label>
                  <div style={{ padding: '9px 12px', background: 'var(--pat-bg)', borderRadius: 8, border: '0.5px solid var(--pat-border)', fontSize: 13, color: 'var(--pat-dark)' }}>
                    Dr. Benali
                  </div>
                </div>

                {dateRdv && heure && motif ? null : (
                  <div className="pat-alert pat-alert-warn">
                    Sélectionnez une date, un créneau et un motif pour confirmer.
                  </div>
                )}

                <button
                  className="pat-btn-primary"
                  onClick={soumettre}
                  disabled={!dateRdv || !heure || !motif}
                  style={{ width: '100%', opacity: (!dateRdv || !heure || !motif) ? .5 : 1 }}
                >
                  Confirmer le rendez-vous
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

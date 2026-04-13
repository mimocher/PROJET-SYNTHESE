// src/pages/secretaire/Agenda.jsx
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createRdv } from '../../redux/secretaireActions';

const JOURS  = ['Lun 31', 'Mar 1', 'Mer 2', 'Jeu 3', 'Ven 4'];
const HEURES = ['08:00','09:00','10:00','11:00','12:00','14:00','15:00','16:00'];
const MOTIFS = ['Détartrage','Bilan + radio','Obturation','Couronne','Extraction','Implant','Blanchiment','Urgence','Autre'];
const RDV_WEEK = {
  'Lun 31-09:00': { patient: 'Tazi A.',     statut: 'confirmed' },
  'Lun 31-10:00': { patient: 'El Fassi Y.', statut: 'pending'   },
  'Mar 1-09:00':  { patient: 'Benali T.',   statut: 'pending'   },
  'Mar 1-11:00':  { patient: 'Urgence',     statut: 'urgent'    },
  'Mer 2-10:00':  { patient: 'Rachidi H.',  statut: 'confirmed' },
  'Jeu 3-09:00':  { patient: 'Mansouri K.', statut: 'confirmed' },
  'Ven 4-10:00':  { patient: 'Idrissi S.',  statut: 'confirmed' },
};

function NouveauRdvModal({ onClose }) {
  const dispatch = useDispatch();
  const patients = useSelector(s => s.patients?.liste || []);
  const today    = new Date().toISOString().split('T')[0];
  const [form, setForm] = useState({ patient_id: '', date: today, heure: '09:00', motif: '' });
  const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const soumettre = () => {
    if (!form.patient_id || !form.motif) return;
    const p = patients.find(p => p.id === Number(form.patient_id));
    dispatch(createRdv({ patient: p?.nom || 'Inconnu', date: form.date, heure: form.heure, motif: form.motif, statut: 'pending' }));
    onClose();
  };
  return (
    <div className="sec-modal-overlay">
      <div className="sec-modal-box">
        <div className="sec-card-title" style={{ marginBottom: 18 }}>
          Nouveau RDV <button className="sec-card-action" onClick={onClose}>✕</button>
        </div>
        <div className="sec-form-group">
          <label className="sec-form-label">Patient *</label>
          <select className="sec-form-control" name="patient_id" value={form.patient_id} onChange={onChange}>
            <option value="">-- Sélectionner --</option>
            {patients.map(p => <option key={p.id} value={p.id}>{p.nom}</option>)}
          </select>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div className="sec-form-group">
            <label className="sec-form-label">Date *</label>
            <input className="sec-form-control" type="date" name="date" value={form.date} onChange={onChange} />
          </div>
          <div className="sec-form-group">
            <label className="sec-form-label">Heure *</label>
            <input className="sec-form-control" type="time" name="heure" value={form.heure} onChange={onChange} />
          </div>
        </div>
        <div className="sec-form-group">
          <label className="sec-form-label">Motif *</label>
          <select className="sec-form-control" name="motif" value={form.motif} onChange={onChange}>
            <option value="">-- Motif --</option>
            {MOTIFS.map(m => <option key={m}>{m}</option>)}
          </select>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="sec-btn-primary" onClick={soumettre} style={{ flex: 1 }}>Créer le RDV</button>
          <button className="sec-btn-secondary" onClick={onClose}>Annuler</button>
        </div>
      </div>
    </div>
  );
}

export default function Agenda() {
  const rdvListe = useSelector(s => s.rdv?.liste || []);
  const [vue, setVue]         = useState('semaine');
  const [showModal, setModal] = useState(false);
  const today     = new Date().toISOString().split('T')[0];
  const rdvDuJour = rdvListe.filter(r => r.date === today);

  return (
    <div>
      <div className="sec-page-header">
        <div className="sec-page-label">Planning</div>
        <h1 className="sec-page-title">Gestion de l'<em>agenda</em></h1>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {['jour','semaine','mois'].map(v => (
            <button key={v} className={`sec-btn-secondary ${vue === v ? 'sec-btn-active' : ''}`} onClick={() => setVue(v)}>
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
        <button className="sec-btn-primary" onClick={() => setModal(true)}>+ Nouveau RDV</button>
      </div>

      {vue === 'semaine' && (
        <div className="sec-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="sec-week-grid">
            <div className="sec-week-header-cell" />
            {JOURS.map((j, i) => (
              <div key={j} className={`sec-week-header-cell ${i === 1 ? 'sec-today-col' : ''}`}>{j}</div>
            ))}
            {HEURES.map(h => (
              <React.Fragment key={h}>
                <div className="sec-week-time">{h}</div>
                {JOURS.map(j => {
                  const rdv = RDV_WEEK[`${j}-${h}`];
                  return (
                    <div key={j} className="sec-week-slot" onClick={() => !rdv && setModal(true)}>
                      {rdv && <div className={`sec-week-event ${rdv.statut === 'confirmed' ? 'green' : rdv.statut === 'pending' ? 'amber' : ''}`}>{rdv.patient}</div>}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {vue === 'jour' && (
        <div className="sec-card">
          <div className="sec-card-title">Aujourd'hui</div>
          <div className="sec-rdv-list">
            {rdvDuJour.map(rdv => (
              <div key={rdv.id} className={`sec-rdv-item ${rdv.statut}`}>
                <div className="sec-rdv-time">{rdv.heure}</div>
                <div className="sec-rdv-info">
                  <div className="sec-rdv-name">{rdv.patient}</div>
                  <div className="sec-rdv-motif">{rdv.motif}</div>
                </div>
                <span className={`sec-badge sec-badge-${rdv.statut}`}>{rdv.statut}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {vue === 'mois' && (
        <div className="sec-card">
          <div className="sec-card-title">Avril 2025</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 4 }}>
            {['L','M','M','J','V','S','D'].map((j, i) => (
              <div key={i} style={{ textAlign: 'center', fontSize: 11, color: 'var(--sec-muted)', padding: '4px 0' }}>{j}</div>
            ))}
            {[null,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30].map((d, i) => (
              <div key={i} onClick={() => d && setVue('jour')}
                style={{ textAlign: 'center', padding: '8px 4px', borderRadius: 8, cursor: d ? 'pointer' : 'default',
                  background: d === 1 ? 'var(--sec-red)' : 'transparent',
                  color: d === 1 ? 'white' : d ? 'var(--sec-dark)' : 'transparent', fontSize: 13 }}>
                {d || ''}
              </div>
            ))}
          </div>
        </div>
      )}

      {showModal && <NouveauRdvModal onClose={() => setModal(false)} />}
    </div>
  );
}
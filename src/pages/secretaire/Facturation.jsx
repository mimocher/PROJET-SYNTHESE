// src/pages/secretaire/Facturation.jsx
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createFacture, setFactureFiltre } from '../../redux/secretaireActions';

const LABELS = { all: 'Tous', paid: 'Payé', partial: 'Partiel', unpaid: 'Impayé' };
const ACTES  = [
  { label: 'Détartrage',         prix: 450  },
  { label: 'Obturation',         prix: 350  },
  { label: 'Couronne céramique', prix: 3200 },
  { label: 'Extraction',         prix: 300  },
  { label: 'Implant',            prix: 8500 },
  { label: 'Blanchiment',        prix: 2100 },
];
const RECETTES = [
  { mois: 'Jan', v: 28400 }, { mois: 'Fév', v: 31200 },
  { mois: 'Mar', v: 38700 }, { mois: 'Avr', v: 7000  },
];
const MAX = 38700;

function FactureModal({ onClose }) {
  const dispatch = useDispatch();
  const patients = useSelector(s => s.patients?.liste || []);
  const [form, setForm] = useState({ patient_id: '', acte: '', montant: '', statut: 'unpaid' });

  const onChange = e => {
    const { name, value } = e.target;
    if (name === 'acte') {
      const a = ACTES.find(a => a.label === value);
      setForm(f => ({ ...f, acte: value, montant: a ? a.prix : '' }));
    } else setForm(f => ({ ...f, [name]: value }));
  };

  const soumettre = () => {
    if (!form.patient_id || !form.acte) return;
    const p   = patients.find(p => p.id === Number(form.patient_id));
    const num = String(Math.floor(Math.random() * 900) + 100);
    dispatch(createFacture({ numero: `FAC-0${num}`, patient: p?.nom || 'Inconnu', date: new Date().toLocaleDateString('fr-FR'), acte: form.acte, montant: Number(form.montant), statut: form.statut }));
    onClose();
  };

  return (
    <div className="sec-modal-overlay">
      <div className="sec-modal-box">
        <div className="sec-card-title" style={{ marginBottom: 18 }}>
          Nouvelle facture <button className="sec-card-action" onClick={onClose}>✕</button>
        </div>
        <div className="sec-form-group">
          <label className="sec-form-label">Patient *</label>
          <select className="sec-form-control" name="patient_id" value={form.patient_id} onChange={onChange}>
            <option value="">-- Sélectionner --</option>
            {patients.map(p => <option key={p.id} value={p.id}>{p.nom}</option>)}
          </select>
        </div>
        <div className="sec-form-group">
          <label className="sec-form-label">Acte *</label>
          <select className="sec-form-control" name="acte" value={form.acte} onChange={onChange}>
            <option value="">-- Sélectionner --</option>
            {ACTES.map(a => <option key={a.label} value={a.label}>{a.label} — {a.prix} MAD</option>)}
          </select>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div className="sec-form-group">
            <label className="sec-form-label">Montant (MAD)</label>
            <input className="sec-form-control" type="number" name="montant" value={form.montant} onChange={onChange} />
          </div>
          <div className="sec-form-group">
            <label className="sec-form-label">Statut</label>
            <select className="sec-form-control" name="statut" value={form.statut} onChange={onChange}>
              <option value="paid">Payé</option>
              <option value="partial">Partiel</option>
              <option value="unpaid">Impayé</option>
            </select>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="sec-btn-primary" onClick={soumettre} style={{ flex: 1 }}>Créer la facture</button>
          <button className="sec-btn-secondary" onClick={onClose}>Annuler</button>
        </div>
      </div>
    </div>
  );
}

export default function Facturation() {
  const dispatch = useDispatch();
  const { liste, filtreStatut } = useSelector(s => s.factures);
  const [showModal, setModal]   = useState(false);

  const filtrees    = filtreStatut === 'all' ? liste : liste.filter(f => f.statut === filtreStatut);
  const impayeTotal = liste.filter(f => f.statut !== 'paid').reduce((s, f) => s + (f.montant - (f.paye || 0)), 0);

  return (
    <div>
      <div className="sec-page-header">
        <div className="sec-page-label">Finance</div>
        <h1 className="sec-page-title">Gestion de la <em>facturation</em></h1>
      </div>

      <div className="sec-stats-grid">
        <div className="sec-stat-card"><div className="sec-stat-val">38<span>K</span></div><div className="sec-stat-lbl">Recettes du mois (MAD)</div><div className="sec-stat-delta sec-delta-up">+12%</div></div>
        <div className="sec-stat-card"><div className="sec-stat-val" style={{ color: 'var(--sec-red)' }}>{(impayeTotal/1000).toFixed(1)}<span>K</span></div><div className="sec-stat-lbl">Impayés (MAD)</div><div className="sec-stat-delta sec-delta-danger">À relancer</div></div>
        <div className="sec-stat-card"><div className="sec-stat-val">{liste.filter(f => f.statut === 'paid').length}</div><div className="sec-stat-lbl">Factures payées</div><div className="sec-stat-delta sec-delta-up">Ce mois</div></div>
        <div className="sec-stat-card"><div className="sec-stat-val">{liste.filter(f => f.statut === 'unpaid').length}</div><div className="sec-stat-lbl">Factures impayées</div><div className="sec-stat-delta sec-delta-danger">À relancer</div></div>
      </div>

      <div className="sec-card">
        <div className="sec-card-title">
          Factures
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {Object.entries(LABELS).map(([val, label]) => (
              <button key={val} className={`sec-btn-secondary ${filtreStatut === val ? 'sec-btn-active' : ''}`}
                style={{ fontSize: 12, padding: '4px 10px' }} onClick={() => dispatch(setFactureFiltre(val))}>{label}</button>
            ))}
            <button className="sec-btn-primary" style={{ fontSize: 12, padding: '5px 12px' }} onClick={() => setModal(true)}>+ Nouvelle</button>
          </div>
        </div>
        <div className="sec-facture-list">
          {filtrees.map(f => (
            <div key={f.id} className="sec-facture-row">
              <div className="sec-facture-num">{f.numero}</div>
              <div className="sec-facture-info">
                <div className="sec-facture-name">{f.patient}</div>
                <div className="sec-facture-date">{f.date} — {f.acte}</div>
              </div>
              <div className="sec-facture-amt">{f.montant.toLocaleString('fr-MA')} MAD</div>
              <span className={`sec-badge sec-badge-${f.statut === 'paid' ? 'paid' : f.statut === 'unpaid' ? 'unpaid' : 'partial'}`}>{LABELS[f.statut]}</span>
              <button className="sec-btn-icon" style={{ marginLeft: 4 }}>📄</button>
            </div>
          ))}
        </div>
      </div>

      {/* Graphique CSS pur */}
      <div className="sec-card">
        <div className="sec-card-title">Recettes par mois (MAD)</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, height: 120 }}>
          {RECETTES.map((r, i) => (
            <div key={r.mois} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{ fontSize: 11, color: 'var(--sec-muted)' }}>{(r.v/1000).toFixed(0)}K</div>
              <div style={{ width: '100%', height: `${Math.round((r.v / MAX) * 80)}px`, background: i === RECETTES.length-1 ? 'var(--sec-red-mid)' : 'var(--sec-red)', borderRadius: '4px 4px 0 0' }} />
              <div style={{ fontSize: 11, color: 'var(--sec-muted)' }}>{r.mois}</div>
            </div>
          ))}
        </div>
      </div>

      {showModal && <FactureModal onClose={() => setModal(false)} />}
    </div>
  );
}
// src/pages/secretaire/Patients.jsx
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addPatient, updatePatient, deletePatient, setSearch } from '../../redux/secretaireActions';

const initiales = nom => nom.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2);

function PatientModal({ patient, onClose }) {
  const dispatch = useDispatch();
  const isEdit   = !!patient;
  const [form, setForm] = useState({
    nom: patient?.nom || '', age: patient?.age || '',
    ville: patient?.ville || '', telephone: patient?.telephone || '',
    email: patient?.email || '', allergie: patient?.allergie || '',
  });
  const onChange  = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const soumettre = () => {
    if (!form.nom.trim()) return;
    isEdit ? dispatch(updatePatient(patient.id, form)) : dispatch(addPatient(form));
    onClose();
  };

  return (
    <div className="sec-modal-overlay">
      <div className="sec-modal-box">
        <div className="sec-card-title" style={{ marginBottom: 18 }}>
          {isEdit ? 'Modifier le patient' : 'Nouveau patient'}
          <button className="sec-card-action" onClick={onClose}>✕ Fermer</button>
        </div>
        {[
          { name: 'nom',       label: 'Nom complet *', type: 'text'   },
          { name: 'age',       label: 'Âge',           type: 'number' },
          { name: 'ville',     label: 'Ville',         type: 'text'   },
          { name: 'telephone', label: 'Téléphone',     type: 'tel'    },
          { name: 'email',     label: 'Email',         type: 'email'  },
          { name: 'allergie',  label: 'Allergie(s)',   type: 'text'   },
        ].map(({ name, label, type }) => (
          <div className="sec-form-group" key={name}>
            <label className="sec-form-label">{label}</label>
            <input className="sec-form-control" type={type} name={name}
              value={form[name]} onChange={onChange} placeholder={label.replace(' *', '')} />
          </div>
        ))}
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <button className="sec-btn-primary" onClick={soumettre} style={{ flex: 1 }}>
            {isEdit ? 'Enregistrer' : 'Créer le patient'}
          </button>
          <button className="sec-btn-secondary" onClick={onClose}>Annuler</button>
        </div>
      </div>
    </div>
  );
}

export default function Patients() {
  const dispatch = useDispatch();
  const { liste, recherche } = useSelector(s => s.patients);
  const [modal, setModal]    = useState(undefined);

  const filtres = recherche
    ? liste.filter(p => p.nom.toLowerCase().includes(recherche.toLowerCase()) || (p.ville || '').toLowerCase().includes(recherche.toLowerCase()))
    : liste;

  return (
    <div>
      <div className="sec-page-header">
        <div className="sec-page-label">Gestion</div>
        <h1 className="sec-page-title">Mes <em>patients</em></h1>
        <p className="sec-page-sub">{filtres.length} patient(s)</p>
      </div>

      <div className="sec-search-bar">
        <input className="sec-input" placeholder="🔍 Rechercher par nom, ville..."
          value={recherche} onChange={e => dispatch(setSearch(e.target.value))} />
        <button className="sec-btn-primary" onClick={() => setModal(null)}>+ Nouveau patient</button>
      </div>
      <div className="sec-card">
        <div className="sec-card-title">
          Liste des patients
          <span style={{ fontSize: 11, background: 'var(--sec-red-light)', color: 'var(--sec-red)', padding: '2px 10px', borderRadius: 10 }}>{filtres.length} total</span>
        </div>
        <div className="sec-patient-list">
          {filtres.map(p => (
            <div key={p.id} className="sec-patient-row">
              <div className="sec-pat-avatar">{initiales(p.nom)}</div>
              <div style={{ flex: 1 }}>
                <div className="sec-pat-name">{p.nom}</div>
                <div className="sec-pat-meta">
                  {p.age} ans — {p.ville}
                  {p.allergie && <span style={{ color: 'var(--sec-red)', marginLeft: 8 }}>⚠ {p.allergie}</span>}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button className="sec-btn-icon" onClick={() => setModal(p)}>✏️</button>
                <button className="sec-btn-icon" style={{ color: 'var(--sec-red)' }}
                  onClick={() => window.confirm('Archiver ?') && dispatch(deletePatient(p.id))}>🗑</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {modal !== undefined && <PatientModal patient={modal} onClose={() => setModal(undefined)} />}
    </div>
  );
}
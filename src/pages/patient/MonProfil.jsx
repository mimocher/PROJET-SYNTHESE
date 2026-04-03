// src/pages/patient/MonProfil.jsx
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

export default function MonProfil() {
  const user = useSelector(s => s.auth?.user);

  const [form, setForm] = useState({
    name:     user?.name     || '',
    email:    user?.email    || '',
    phone:    user?.phone    || '',
    adresse:  '',
    naissance:'',
  });

  const [enregistre, setEnregistre] = useState(false);

  const onChange  = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const soumettre = (e) => {
    e.preventDefault();
    // En production → dispatch(updateUser(form))
    setEnregistre(true);
    setTimeout(() => setEnregistre(false), 2500);
  };

  const initiales = form.name
    ? form.name.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2)
    : 'PA';

  return (
    <div>
      <div className="pat-page-header">
        <div className="pat-page-label">Profil</div>
        <h1 className="pat-page-title">Mon <em>profil</em></h1>
        <p className="pat-page-sub">Gérez vos informations personnelles</p>
      </div>

      <div className="pat-grid-2">
        {/* Carte identité */}
        <div className="pat-card" style={{ textAlign: 'center', padding: 30 }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%', background: 'var(--pat-red-light)',
            border: '2px solid var(--pat-red-mid)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 22, fontWeight: 600, color: 'var(--pat-red)',
            margin: '0 auto 12px',
          }}>
            {initiales}
          </div>
          <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--pat-dark)', marginBottom: 4 }}>{form.name || 'Patient'}</div>
          <div style={{ fontSize: 12, color: 'var(--pat-muted)', marginBottom: 4 }}>{form.email}</div>
          <div style={{ fontSize: 12, color: 'var(--pat-muted)', marginBottom: 14 }}>{form.phone}</div>
          <span style={{ fontSize: 10, background: 'var(--pat-green-light)', color: 'var(--pat-green)', padding: '3px 10px', borderRadius: 8, fontWeight: 500 }}>
            Patient actif
          </span>
          <div style={{ marginTop: 16, paddingTop: 14, borderTop: '0.5px solid var(--pat-border)' }}>
            <div className="pat-info-row"><span className="pat-info-key">Rôle</span><span className="pat-info-val">Patient</span></div>
            <div className="pat-info-row"><span className="pat-info-key">Cabinet</span><span className="pat-info-val">Bright Smile</span></div>
            <div className="pat-info-row"><span className="pat-info-key">Dentiste</span><span className="pat-info-val">Dr. Benali</span></div>
          </div>
        </div>

        {/* Formulaire */}
        <div className="pat-card">
          <div className="pat-card-title">Modifier mes informations</div>
          <form onSubmit={soumettre}>
            {[
              { name: 'name',      label: 'Nom complet',       type: 'text'  },
              { name: 'email',     label: 'Email',             type: 'email' },
              { name: 'phone',     label: 'Téléphone',         type: 'tel'   },
              { name: 'adresse',   label: 'Adresse',           type: 'text'  },
              { name: 'naissance', label: 'Date de naissance', type: 'date'  },
            ].map(({ name, label, type }) => (
              <div className="pat-form-group" key={name}>
                <label className="pat-form-label">{label}</label>
                <input
                  className="pat-form-control"
                  type={type} name={name} value={form[name]}
                  onChange={onChange} placeholder={label}
                />
              </div>
            ))}

            {enregistre ? (
              <div style={{ background: 'var(--pat-green-light)', color: 'var(--pat-green)', borderRadius: 8, padding: '10px 14px', fontSize: 13, fontWeight: 500, textAlign: 'center' }}>
                ✓ Profil mis à jour !
              </div>
            ) : (
              <button type="submit" className="pat-btn-primary" style={{ width: '100%', marginTop: 4 }}>
                Enregistrer les modifications
              </button>
            )}
          </form>
        </div>
      </div>

      {/* Sécurité */}
      <div className="pat-card">
        <div className="pat-card-title">Sécurité du compte</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--pat-dark)' }}>Mot de passe</div>
            <div style={{ fontSize: 12, color: 'var(--pat-muted)' }}>Dernière modification : inconnue</div>
          </div>
          <button className="pat-btn-secondary" onClick={() => alert('Réinitialisation du mot de passe — à connecter au backend.')}>
            Modifier le mot de passe
          </button>
        </div>
      </div>
    </div>
  );
}

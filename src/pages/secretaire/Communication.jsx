// src/pages/secretaire/Communication.jsx
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

const MODELES = [
  { id: 1, titre: 'Rappel RDV — 24h',       type: 'Email', contenu: 'Bonjour {patient},\n\nRappel de votre RDV demain {date} à {heure} avec {dentiste}.\n\nBright Smile' },
  { id: 2, titre: 'Rappel RDV — 1h',        type: 'SMS',   contenu: 'Bright Smile : RDV dans 1h ({heure}) au 45 Bd Anfa, Casablanca.' },
  { id: 3, titre: 'Relance facture',         type: 'Email', contenu: 'Bonjour {patient},\n\nLa facture {numero} de {montant} MAD est impayée. Merci de régulariser.\n\nBright Smile' },
  { id: 4, titre: 'Confirmation RDV',        type: 'Email', contenu: 'Bonjour {patient},\n\nVotre RDV est confirmé le {date} à {heure}.\n\nBright Smile' },
];
const HISTORIQUE = [
  { id: 1, type: 'Email', patient: 'Amina Tazi',    sujet: 'Rappel RDV 24h',    date: 'Hier, 16:00' },
  { id: 2, type: 'SMS',   patient: 'Karim Mansouri', sujet: 'Relance facture',   date: 'Hier, 14:30' },
  { id: 3, type: 'Email', patient: '8 patients',     sujet: 'Rappels auto',      date: 'Ce matin'    },
];

export default function Communication() {
  const patients = useSelector(s => s.patients?.liste || []);
  const [dest, setDest]         = useState('');
  const [type, setType]         = useState('Email');
  const [contenu, setContenu]   = useState('');
  const [modeleId, setModeleId] = useState(null);
  const [envoye, setEnvoye]     = useState(false);

  const chargerModele = m => { setModeleId(m.id); setType(m.type); setContenu(m.contenu); };
  const envoyer = () => {
    if (!contenu.trim() || !dest) return;
    setEnvoye(true);
    setTimeout(() => { setEnvoye(false); setContenu(''); setDest(''); }, 2500);
  };

  return (
    <div>
      <div className="sec-page-header">
        <div className="sec-page-label">Communication</div>
        <h1 className="sec-page-title">Messages & <em>rappels</em></h1>
      </div>

      <div className="sec-grid-2">
        <div className="sec-card">
          <div className="sec-card-title">Nouveau message</div>
          <div className="sec-form-group">
            <label className="sec-form-label">Destinataire *</label>
            <select className="sec-form-control" value={dest} onChange={e => setDest(e.target.value)}>
              <option value="">-- Sélectionner --</option>
              <option value="all_today">Tous les patients du jour</option>
              <option value="all_unpaid">Patients avec impayés</option>
              <optgroup label="Patient individuel">
                {patients.map(p => <option key={p.id} value={p.id}>{p.nom}</option>)}
              </optgroup>
            </select>
          </div>
          <div className="sec-form-group">
            <label className="sec-form-label">Type</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {['Email','SMS'].map(t => (
                <button key={t} className={`sec-btn-secondary ${type === t ? 'sec-btn-active' : ''}`}
                  onClick={() => setType(t)} style={{ flex: 1 }}>
                  {t === 'Email' ? '📧 Email' : '📱 SMS'}
                </button>
              ))}
            </div>
          </div>
          <div className="sec-form-group">
            <label className="sec-form-label">Message *</label>
            <textarea className="sec-form-control" value={contenu} onChange={e => setContenu(e.target.value)}
              placeholder="Rédigez ou choisissez un modèle →" style={{ minHeight: 120 }} />
          </div>
          {envoye
            ? <div style={{ background: 'var(--sec-green-light)', color: 'var(--sec-green)', borderRadius: 8, padding: '10px 14px', fontSize: 13, fontWeight: 500, textAlign: 'center' }}>✓ Envoyé !</div>
            : <div style={{ display: 'flex', gap: 8 }}>
                <button className="sec-btn-primary" onClick={envoyer} style={{ flex: 1 }}>Envoyer</button>
                <button className="sec-btn-secondary" onClick={() => setContenu('')}>Effacer</button>
              </div>
          }
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="sec-card">
            <div className="sec-card-title">Modèles</div>
            {MODELES.map(m => (
              <div key={m.id} onClick={() => chargerModele(m)} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 8,
                cursor: 'pointer', marginBottom: 6,
                background: modeleId === m.id ? 'var(--sec-red-light)' : 'var(--sec-bg)',
                border: `0.5px solid ${modeleId === m.id ? 'var(--sec-red-mid)' : 'transparent'}`,
              }}>
                <span>{m.type === 'Email' ? '📧' : '📱'}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--sec-dark)' }}>{m.titre}</div>
                  <div style={{ fontSize: 11, color: 'var(--sec-muted)' }}>{m.type}</div>
                </div>
                <span style={{ fontSize: 10, color: modeleId === m.id ? 'var(--sec-red)' : 'var(--sec-muted)' }}>
                  {modeleId === m.id ? '✓ Actif' : 'Utiliser'}
                </span>
              </div>
            ))}
          </div>

          <div className="sec-card">
            <div className="sec-card-title">Historique</div>
            <div className="sec-notif-list">
              {HISTORIQUE.map(h => (
                <div key={h.id} className="sec-notif-item">
                  <div className="sec-notif-dot" style={{ background: h.type === 'SMS' ? 'var(--sec-amber)' : 'var(--sec-green)' }} />
                  <div style={{ flex: 1 }}>
                    <div className="sec-notif-text"><strong style={{ fontWeight: 500 }}>{h.patient}</strong> — {h.sujet}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div className="sec-notif-time">{h.date}</div>
                      <span style={{ fontSize: 10, color: 'var(--sec-green)', background: 'var(--sec-green-light)', padding: '1px 6px', borderRadius: 6 }}>envoyé</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
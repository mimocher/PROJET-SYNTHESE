// // src/pages/patient/MesRdv.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RDV_DATA = [
  { id: 1, date: '02/04/2025', heure: '10:00', motif: 'Détartrage + bilan',       statut: 'confirmed', dentiste: 'Dr. Benali', futur: true  },
  { id: 2, date: '15/04/2025', heure: '14:30', motif: 'Blanchiment séance 2/3',   statut: 'pending',   dentiste: 'Dr. Benali', futur: true  },
  { id: 3, date: '15/01/2025', heure: '09:00', motif: 'Détartrage + polissage',   statut: 'done',      dentiste: 'Dr. Benali', futur: false },
  { id: 4, date: '03/11/2024', heure: '10:30', motif: 'Obturation carie dent 36', statut: 'done',      dentiste: 'Dr. Benali', futur: false },
  { id: 5, date: '20/08/2024', heure: '11:00', motif: 'Consultation générale',    statut: 'done',      dentiste: 'Dr. Benali', futur: false },
];

const STATUT = {
  confirmed: { label: 'Confirmé',   bg: '#eaf6f0', color: '#1a7a4a', dot: '#1a7a4a' },
  pending:   { label: 'En attente', bg: '#fff8e6', color: '#cc8800', dot: '#cc8800' },
  done:      { label: 'Terminé',    bg: '#f0f0f0', color: '#555',    dot: '#aaa'    },
  cancelled: { label: 'Annulé',     bg: '#f9eceb', color: '#C0392B', dot: '#C0392B' },
};

export default function MesRdv() {
  const navigate = useNavigate();
  const [onglet, setOnglet] = useState('futur');

  const liste = RDV_DATA.filter(r => onglet === 'futur' ? r.futur : !r.futur);

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'inline-flex', background: 'var(--pat-red)', color: '#fff', fontSize: 10, fontWeight: 500, padding: '3px 12px', borderRadius: 12, letterSpacing: '.6px', textTransform: 'uppercase', marginBottom: 8 }}>
          Planning
        </div>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 26, color: 'var(--pat-dark)', margin: '0 0 4px' }}>
          Mes <em style={{ fontStyle: 'italic', color: 'var(--pat-red)' }}>rendez-vous</em>
        </h1>
        <p style={{ fontSize: 13, color: 'var(--pat-muted)', margin: 0 }}>
          Historique et prochains rendez-vous au cabinet
        </p>
      </div>

      {/* Tabs + bouton */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
        {[
          { id: 'futur', label: 'À venir', count: RDV_DATA.filter(r => r.futur).length },
          { id: 'passe', label: 'Passés',  count: RDV_DATA.filter(r => !r.futur).length },
        ].map(o => (
          <button key={o.id} onClick={() => setOnglet(o.id)}
            style={{
              padding: '8px 18px', borderRadius: 20, fontSize: 13, fontWeight: 500,
              cursor: 'pointer', border: 'none', fontFamily: 'DM Sans, sans-serif',
              background: onglet === o.id ? 'var(--pat-red)' : '#fff',
              color: onglet === o.id ? '#fff' : 'var(--pat-muted)',
              boxShadow: onglet === o.id ? '0 4px 12px rgba(192,57,43,.25)' : 'none',
              transition: 'all .2s',
            }}>
            {o.label}
            <span style={{
              marginLeft: 6, fontSize: 11, padding: '1px 6px', borderRadius: 10,
              background: onglet === o.id ? 'rgba(255,255,255,.25)' : 'var(--pat-bg)',
              color: onglet === o.id ? '#fff' : 'var(--pat-muted)',
            }}>{o.count}</span>
          </button>
        ))}
        <button onClick={() => navigate('/patient/prendre-rdv')}
          style={{
            marginLeft: 'auto', padding: '9px 18px', borderRadius: 8,
            background: 'var(--pat-red)', color: '#fff', border: 'none',
            fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
          }}>
          + Nouveau RDV
        </button>
      </div>

      {/* Liste */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {liste.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 20px', background: '#fff', borderRadius: 14, border: '0.5px solid var(--pat-border)' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📅</div>
            <p style={{ fontSize: 14, color: 'var(--pat-muted)' }}>
              Aucun rendez-vous {onglet === 'futur' ? 'à venir' : 'passé'}
            </p>
            {onglet === 'futur' && (
              <button onClick={() => navigate('/patient/prendre-rdv')}
                style={{ marginTop: 12, padding: '9px 20px', background: 'var(--pat-red)', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontFamily: 'DM Sans, sans-serif' }}>
                Prendre un RDV
              </button>
            )}
          </div>
        ) : (
          liste.map(rdv => {
            const s = STATUT[rdv.statut] || STATUT.pending;
            return (
              <div key={rdv.id} style={{
                background: '#fff', border: '0.5px solid var(--pat-border)',
                borderRadius: 14, padding: '18px 22px',
                display: 'flex', alignItems: 'center', gap: 18,
                transition: 'box-shadow .2s',
              }}>
                {/* Indicateur couleur */}
                <div style={{ width: 4, height: 52, borderRadius: 4, background: s.dot, flexShrink: 0 }} />

                {/* Date */}
                <div style={{ textAlign: 'center', minWidth: 52, flexShrink: 0 }}>
                  <div style={{ fontSize: 22, fontFamily: 'Playfair Display, serif', fontWeight: 600, color: 'var(--pat-dark)', lineHeight: 1 }}>
                    {rdv.date.split('/')[0]}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--pat-muted)', marginTop: 2 }}>
                    {['','Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc'][parseInt(rdv.date.split('/')[1])]}
                  </div>
                </div>

                <div style={{ width: 1, height: 44, background: 'var(--pat-border)', flexShrink: 0 }} />

                {/* Info */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--pat-dark)', marginBottom: 3 }}>
                    {rdv.motif}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--pat-muted)' }}>
                    {rdv.dentiste} · {rdv.heure}
                  </div>
                </div>

                {/* Badge statut */}
                <span style={{ fontSize: 11, padding: '4px 12px', borderRadius: 20, fontWeight: 500, background: s.bg, color: s.color, flexShrink: 0 }}>
                  {s.label}
                </span>

                {/* Action annuler */}
                {rdv.futur && (
                  <button onClick={() => alert('Annulation soumise à validation 24h avant.')}
                    style={{ padding: '6px 12px', borderRadius: 8, border: '0.5px solid var(--pat-border)', background: '#fff', color: 'var(--pat-red)', fontSize: 12, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', flexShrink: 0 }}>
                    Annuler
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
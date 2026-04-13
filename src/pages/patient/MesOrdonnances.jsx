// src/pages/patient/MesOrdonnances.jsx
import React from 'react';

const ORDONNANCES = [
  {
    id: 1, numero: 'ORD-045', date: '15/01/2025', dentiste: 'Dr. Benali',
    medicaments: 'Paracétamol 1g — 3x/jour pendant 5 jours\nIbuprofène 400mg — après repas si douleur, max 3/jour',
  },
  {
    id: 2, numero: 'ORD-038', date: '03/11/2024', dentiste: 'Dr. Benali',
    medicaments: 'Amoxicilline 1g — 2x/jour pendant 7 jours\nParacétamol 1g — si douleur, max 4/jour\nChlrohexidine 0.12% bain de bouche — 2x/jour pendant 5 jours',
  },
  {
    id: 3, numero: 'ORD-021', date: '20/08/2024', dentiste: 'Dr. Benali',
    medicaments: 'Gel fluoré — application quotidienne le soir\nBain de bouche Eludril — 2x/jour pendant 10 jours',
  },
];

export default function MesOrdonnances() {
  return (
    <div>
      <div className="pat-page-header">
        <div className="pat-page-label">Ordonnances</div>
        <h1 className="pat-page-title">Mes <em>ordonnances</em></h1>
        <p className="pat-page-sub">Prescriptions médicales de votre dentiste</p>
      </div>

      <div className="pat-ordo-list">
        {ORDONNANCES.map(o => (
          <div key={o.id} className="pat-ordo-item">
            <div className="pat-ordo-header">
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--pat-dark)' }}>{o.numero}</div>
                <div className="pat-ordo-date">{o.dentiste} — {o.date}</div>
              </div>
              <button
                className="pat-btn-icon"
                onClick={() => alert('Téléchargement PDF — à connecter au backend Laravel.')}
                title="Télécharger PDF"
              >
                📄 PDF
              </button>
            </div>
            <div className="pat-ordo-meds">{o.medicaments}</div>
          </div>
        ))}
      </div>

      <div className="pat-card" style={{ marginTop: 16, textAlign: 'center', padding: 20 }}>
        <div style={{ fontSize: 13, color: 'var(--pat-muted)' }}>
          Les ordonnances sont générées par votre dentiste après chaque consultation. Pour toute question sur une prescription, contactez le cabinet.
        </div>
        <div style={{ marginTop: 10, fontSize: 13, color: 'var(--pat-dark)' }}>
          📞 +212 5 22 00 11 22
        </div>
      </div>
    </div>
  );
}

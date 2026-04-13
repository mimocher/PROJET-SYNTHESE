// src/pages/patient/DossierMedical.jsx
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

// ── Génération PDF ordonnance (jsPDF) ─────────────────────────────────────────
function genererPDFOrdonnance(ordonnance, user) {
  // Charge jsPDF dynamiquement si pas encore chargé
  const generer = (jsPDF) => {
    const doc = new jsPDF();
    const rouge = [192, 57, 43];

    // En-tête cabinet
    doc.setFillColor(...rouge);
    doc.rect(0, 0, 210, 28, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Bright Smile', 14, 12);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('Cabinet dentaire — Dr. Benali', 14, 19);
    doc.text('45 Boulevard Anfa, 20100 Casablanca', 14, 24);

    // Titre ordonnance
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('ORDONNANCE MÉDICALE', 14, 44);
    doc.setDrawColor(...rouge);
    doc.setLineWidth(0.8);
    doc.line(14, 47, 196, 47);

    // Infos patient
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Patient : ${user?.name || 'Patient'}`, 14, 56);
    doc.text(`N° Ordonnance : ${ordonnance.numero}`, 14, 62);
    doc.text(`Date : ${ordonnance.date}`, 14, 68);

    // Prescription
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Prescription :', 14, 82);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);

    const lignes = ordonnance.medicaments.split('\n');
    let y = 92;
    lignes.forEach((ligne, i) => {
      doc.setFillColor(250, 248, 246);
      doc.rect(12, y - 5, 186, 10, 'F');
      doc.text(`${i + 1}. ${ligne}`, 16, y);
      y += 14;
    });

    // Signature
    y += 10;
    doc.setDrawColor(200, 200, 200);
    doc.line(140, y, 196, y);
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text('Signature et cachet du praticien', 140, y + 5);

    // Pied de page
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('Document généré par Bright Smile — cabinet-dentaire.ma', 14, 285);
    doc.text(`Page 1 / 1`, 180, 285);

    doc.save(`${ordonnance.numero}_${user?.name?.replace(/ /g, '_') || 'patient'}.pdf`);
  };

  if (window.jspdf?.jsPDF) {
    generer(window.jspdf.jsPDF);
  } else {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    script.onload = () => generer(window.jspdf.jsPDF);
    document.head.appendChild(script);
  }
}

// ─────────────────────────────────────────────────────────────────────────────

const TABS = [
  { id: 'infos',         label: 'Mes infos'       },
  { id: 'antecedents',   label: 'Antécédents'     },
  { id: 'consultations', label: 'Consultations'   },
  { id: 'traitements',   label: 'Traitements'     },
  { id: 'ordonnances',   label: 'Ordonnances'     },
];

export default function DossierMedical() {
  const user    = useSelector(s => s.auth?.user);
  const dossier = useSelector(s => s.dossierPatient);
  const [tab, setTab] = useState('infos');

  return (
    <div>
      <div className="pat-page-header">
        <div className="pat-page-label">Dossier médical</div>
        <h1 className="pat-page-title">Mon <em>dossier</em></h1>
        <p className="pat-page-sub">Consultation en lecture seule — toute modification est effectuée par le dentiste</p>
      </div>

      <div className="pat-alert pat-alert-warn" style={{ marginBottom: 16 }}>
        🔒 Ce dossier est en lecture seule. Contactez le cabinet pour toute correction.
      </div>

      <div className="pat-card">
        {/* Onglets */}
        <div className="pat-tab-bar">
          {TABS.map(t => (
            <button key={t.id} className={`pat-tab ${tab === t.id ? 'pat-tab-active' : ''}`}
              onClick={() => setTab(t.id)}>{t.label}</button>
          ))}
        </div>

        {/* ── Infos ── */}
        {tab === 'infos' && (
          <>
            <div className="pat-info-row">
              <span className="pat-info-key">Nom complet</span>
              <span className="pat-info-val">{user?.name}</span>
            </div>
            <div className="pat-info-row">
              <span className="pat-info-key">Email</span>
              <span className="pat-info-val">{user?.email}</span>
            </div>
            <div className="pat-info-row">
              <span className="pat-info-key">Téléphone</span>
              <span className="pat-info-val">{user?.phone || 'Non renseigné'}</span>
            </div>
            <div className="pat-info-row">
              <span className="pat-info-key">Groupe sanguin</span>
              <span className="pat-info-val">{dossier.groupe_sanguin}</span>
            </div>
            <div className="pat-info-row">
              <span className="pat-info-key">Allergie(s)</span>
              <span className={`pat-info-val ${dossier.allergies ? 'danger' : ''}`}>
                {dossier.allergies ? `⚠ ${dossier.allergies}` : 'Aucune allergie connue'}
              </span>
            </div>
          </>
        )}

        {/* ── Antécédents ── */}
        {tab === 'antecedents' && (
          <div style={{ fontSize: 13, color: 'var(--pat-dark)', lineHeight: 1.8, background: 'var(--pat-bg)', padding: 16, borderRadius: 8 }}>
            {dossier.antecedents || 'Aucun antécédent renseigné.'}
          </div>
        )}

        {/* ── Consultations ── */}
        {tab === 'consultations' && (
          <div className="pat-timeline">
            {dossier.consultations.length === 0
              ? <p style={{ textAlign: 'center', padding: 20, fontSize: 13, color: 'var(--pat-muted)' }}>Aucune consultation enregistrée.</p>
              : dossier.consultations.map(c => (
                  <div key={c.id} className="pat-timeline-item">
                    <div className="pat-timeline-dot done" />
                    <div className="pat-timeline-body">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--pat-dark)' }}>{c.motif}</div>
                        <div style={{ fontSize: 11, color: 'var(--pat-muted)' }}>{c.date}</div>
                      </div>
                      {c.diagnostic && (
                        <div style={{ fontSize: 12, color: 'var(--pat-muted)', marginTop: 4 }}>
                          Diagnostic : {c.diagnostic}
                        </div>
                      )}
                      {c.notes && (
                        <div style={{ fontSize: 12, color: 'var(--pat-muted)', marginTop: 2, fontStyle: 'italic' }}>
                          {c.notes}
                        </div>
                      )}
                    </div>
                  </div>
                ))
            }
          </div>
        )}

        {/* ── Traitements ── */}
        {tab === 'traitements' && (
          <div className="pat-timeline">
            {dossier.traitements.map(t => (
              <div key={t.id} className="pat-timeline-item">
                <div className={`pat-timeline-dot ${t.statut === 'termine' ? 'done' : ''}`} />
                <div className="pat-timeline-body">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--pat-dark)' }}>{t.intitule}</div>
                    <span className={`pat-badge pat-badge-${t.statut}`}>
                      {t.statut === 'termine' ? 'Terminé' : 'En cours'}
                    </span>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--pat-muted)', marginTop: 4 }}>
                    Début : {t.date_debut}{t.date_fin ? ` — Fin : ${t.date_fin}` : ''}
                  </div>
                  {t.seances && (
                    <>
                      <div style={{ fontSize: 11, color: 'var(--pat-muted)', marginTop: 4 }}>
                        Séance {t.seance_actuelle}/{t.seances}
                      </div>
                      <div className="pat-progress-bar">
                        <div className="pat-progress-fill" style={{ width: `${Math.round((t.seance_actuelle / t.seances) * 100)}%` }} />
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Ordonnances ── */}
        {tab === 'ordonnances' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {dossier.ordonnances.length === 0
              ? <p style={{ textAlign: 'center', padding: 20, fontSize: 13, color: 'var(--pat-muted)' }}>Aucune ordonnance.</p>
              : dossier.ordonnances.map(o => (
                  <div key={o.id} style={{
                    padding: '12px 14px', background: 'var(--pat-bg)', borderRadius: 10,
                    borderLeft: '3px solid var(--pat-red)', display: 'flex', alignItems: 'flex-start', gap: 12,
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--pat-dark)' }}>{o.numero}</span>
                        <span style={{ fontSize: 11, color: 'var(--pat-muted)' }}>{o.date}</span>
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--pat-muted)', whiteSpace: 'pre-line', lineHeight: 1.6 }}>
                        {o.medicaments.length > 100 ? o.medicaments.slice(0, 100) + '...' : o.medicaments}
                      </div>
                    </div>
                    <button
                      className="pat-btn-primary"
                      style={{ fontSize: 11, padding: '6px 12px', flexShrink: 0 }}
                      onClick={() => genererPDFOrdonnance(o, user)}
                      title="Télécharger en PDF"
                    >
                      📄 PDF
                    </button>
                  </div>
                ))
            }
          </div>
        )}
      </div>
    </div>
  );
}

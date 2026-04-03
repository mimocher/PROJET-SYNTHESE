// src/pages/patient/Factures.jsx
import React from 'react';
import { useSelector } from 'react-redux';

// ── Génération PDF facture (jsPDF) ────────────────────────────────────────────
function genererPDFFacture(facture, user) {
  const generer = (jsPDF) => {
    const doc = new jsPDF();
    const rouge = [192, 57, 43];

    // En-tête rouge
    doc.setFillColor(...rouge);
    doc.rect(0, 0, 210, 28, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Bright Smile', 14, 12);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('Cabinet dentaire — Dr. Benali', 14, 19);
    doc.text('45 Boulevard Anfa, 20100 Casablanca | +212 5 22 00 11 22', 14, 24);

    // Titre
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('FACTURE', 14, 44);
    doc.setDrawColor(...rouge);
    doc.setLineWidth(0.8);
    doc.line(14, 47, 196, 47);

    // Infos facture + patient
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`N° Facture : ${facture.numero}`, 14, 56);
    doc.text(`Date : ${facture.date}`, 14, 62);
    doc.text(`Patient : ${user?.name || 'Patient'}`, 120, 56);
    doc.text(`Email : ${user?.email || ''}`, 120, 62);

    // Ligne de détail
    doc.setFillColor(250, 248, 246);
    doc.rect(12, 74, 186, 12, 'F');
    doc.setFont('helvetica', 'bold');
    doc.text('Prestation', 16, 82);
    doc.text('Montant', 170, 82);

    doc.setFont('helvetica', 'normal');
    doc.setFillColor(255, 255, 255);
    doc.rect(12, 86, 186, 12, 'F');
    doc.text(facture.acte, 16, 94);
    doc.text(`${facture.montant.toLocaleString('fr-MA')} MAD`, 170, 94);

    // Total
    doc.setDrawColor(220, 220, 220);
    doc.line(14, 106, 196, 106);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Total TTC :', 130, 118);
    doc.setTextColor(...rouge);
    doc.text(`${facture.montant.toLocaleString('fr-MA')} MAD`, 170, 118);

    // Statut
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const statutLabel = facture.statut === 'paid' ? 'PAYÉ' : facture.statut === 'partial' ? 'PARTIELLEMENT PAYÉ' : 'EN ATTENTE';
    if (facture.statut === 'paid') doc.setTextColor(26, 122, 74);
    else doc.setTextColor(204, 136, 0);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`Statut : ${statutLabel}`, 14, 134);

    if (facture.statut === 'partial') {
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Montant payé : ${(facture.paye || 0).toLocaleString('fr-MA')} MAD`, 14, 144);
      doc.setTextColor(204, 136, 0);
      doc.text(`Reste à payer : ${(facture.montant - (facture.paye || 0)).toLocaleString('fr-MA')} MAD`, 14, 152);
    }

    // Pied de page
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('Merci de votre confiance — Bright Smile Cabinet Dentaire', 14, 285);
    doc.text('Page 1/1', 186, 285);

    doc.save(`${facture.numero}_${user?.name?.replace(/ /g, '_') || 'patient'}.pdf`);
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

const STATUT_LABELS = { paid: 'Payé', partial: 'Partiel', unpaid: 'Impayé' };

export default function Factures() {
  const user     = useSelector(s => s.auth?.user);
  const { liste } = useSelector(s => s.facturesPatient);

  const total    = liste.reduce((s, f) => s + f.montant, 0);
  const totalPaye = liste.reduce((s, f) => s + (f.paye || 0), 0);
  const impaye   = total - totalPaye;

  return (
    <div>
      <div className="pat-page-header">
        <div className="pat-page-label">Facturation</div>
        <h1 className="pat-page-title">Mes <em>factures</em></h1>
        <p className="pat-page-sub">Historique et téléchargement de vos factures</p>
      </div>

      {/* KPIs */}
      <div className="pat-stats-grid">
        <div className="pat-stat-card">
          <div className="pat-stat-val">{liste.length}</div>
          <div className="pat-stat-lbl">Factures totales</div>
        </div>
        <div className="pat-stat-card">
          <div className="pat-stat-val">{(total / 1000).toFixed(1)}<span>K</span></div>
          <div className="pat-stat-lbl">Total MAD</div>
        </div>
        <div className="pat-stat-card">
          <div className="pat-stat-val" style={{ color: 'var(--pat-green)' }}>{(totalPaye / 1000).toFixed(1)}<span>K</span></div>
          <div className="pat-stat-lbl">Montant payé</div>
        </div>
        <div className="pat-stat-card">
          <div className="pat-stat-val" style={{ color: impaye > 0 ? 'var(--pat-red)' : 'var(--pat-green)' }}>
            {(impaye / 1000).toFixed(1)}<span>K</span>
          </div>
          <div className="pat-stat-lbl">Reste à payer (MAD)</div>
        </div>
      </div>

      {impaye > 0 && (
        <div className="pat-alert pat-alert-warn" style={{ marginBottom: 16 }}>
          ⚠️ Vous avez un solde impayé de <strong>{impaye.toLocaleString('fr-MA')} MAD</strong>.
          Contactez le cabinet pour régulariser votre situation.
        </div>
      )}

      <div className="pat-card">
        <div className="pat-card-title">Toutes mes factures</div>
        <div className="pat-facture-list">
          {liste.map(f => {
            const reste = f.montant - (f.paye || 0);
            return (
              <div key={f.id} className="pat-facture-row">
                <div className="pat-facture-num">{f.numero}</div>
                <div className="pat-facture-info">
                  <div className="pat-facture-name">{f.acte}</div>
                  <div className="pat-facture-date">{f.date}</div>
                </div>
                <div style={{ textAlign: 'right', marginRight: 8 }}>
                  <div className="pat-facture-amt">{f.montant.toLocaleString('fr-MA')} MAD</div>
                  {f.statut === 'partial' && (
                    <div style={{ fontSize: 11, color: 'var(--pat-amber)' }}>
                      Reste : {reste.toLocaleString('fr-MA')} MAD
                    </div>
                  )}
                </div>
                <span className={`pat-badge pat-badge-${f.statut}`}>
                  {STATUT_LABELS[f.statut]}
                </span>
                <button
                  className="pat-btn-icon"
                  style={{ marginLeft: 6 }}
                  onClick={() => genererPDFFacture(f, user)}
                  title="Télécharger en PDF"
                >
                  📄
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Solde récapitulatif */}
      <div className="pat-card">
        <div className="pat-card-title">Récapitulatif</div>
        <div className="pat-info-row">
          <span className="pat-info-key">Total des soins</span>
          <span className="pat-info-val">{total.toLocaleString('fr-MA')} MAD</span>
        </div>
        <div className="pat-info-row">
          <span className="pat-info-key">Montant payé</span>
          <span className="pat-info-val" style={{ color: 'var(--pat-green)' }}>
            {totalPaye.toLocaleString('fr-MA')} MAD
          </span>
        </div>
        <div className="pat-info-row">
          <span className="pat-info-key">Solde restant</span>
          <span className="pat-info-val" style={{ color: impaye > 0 ? 'var(--pat-red)' : 'var(--pat-green)', fontSize: 15, fontWeight: 600 }}>
            {impaye.toLocaleString('fr-MA')} MAD
          </span>
        </div>
      </div>
    </div>
  );
}

// src/pages/patient/MonDossier.jsx
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

const TABS = [
  { id: 'infos',         label: '👤 Mes infos'       },
  { id: 'antecedents',   label: '📋 Antécédents'     },
  { id: 'consultations', label: '🩺 Consultations'   },
  { id: 'traitements',   label: '🦷 Traitements'     },
];

const CONSULTATIONS = [
  { id: 1, date: '15/01/2025', motif: 'Détartrage + polissage',    diagnostic: 'Tartre modéré',         notes: 'RAS post-traitement. Prochain contrôle dans 6 mois.' },
  { id: 2, date: '03/11/2024', motif: 'Obturation carie dent 36',  diagnostic: 'Carie classe II',        notes: 'Obturation composite posée. Sensibilité possible 48h.' },
  { id: 3, date: '20/08/2024', motif: 'Consultation générale',      diagnostic: 'Bilan satisfaisant',    notes: 'Légère gingivite. Rappel hygiène bucco-dentaire.' },
];

const TRAITEMENTS = [
  { id: 1, intitule: 'Détartrage semestriel',       statut: 'termine',  date_debut: '15/01/2025', seances: null },
  { id: 2, intitule: 'Blanchiment professionnel',    statut: 'en_cours', date_debut: '15/01/2025', seances: 3, seance_actuelle: 1 },
];

export default function MonDossier() {
  const user = useSelector(s => s.auth?.user);
  const [tab, setTab] = useState('infos');

  const initiales = user?.name?.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2) || 'PA';

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'inline-flex', background: 'var(--pat-red)', color: '#fff', fontSize: 10, fontWeight: 500, padding: '3px 12px', borderRadius: 12, letterSpacing: '.6px', textTransform: 'uppercase', marginBottom: 8 }}>
          Dossier médical
        </div>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 26, color: 'var(--pat-dark)', margin: '0 0 4px' }}>
          Mon <em style={{ fontStyle: 'italic', color: 'var(--pat-red)' }}>dossier</em>
        </h1>
        <p style={{ fontSize: 13, color: 'var(--pat-muted)', margin: 0 }}>Consultation en lecture seule — géré par votre dentiste</p>
      </div>

      {/* Card dossier */}
      <div style={{ background: '#fff', border: '0.5px solid var(--pat-border)', borderRadius: 14, overflow: 'hidden' }}>

        {/* En-tête patient */}
        <div style={{ background: 'linear-gradient(135deg, var(--pat-red) 0%, #a93226 100%)', padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(255,255,255,.2)', border: '2px solid rgba(255,255,255,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, color: '#fff' }}>
            {initiales}
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 600, color: '#fff' }}>{user?.name || 'Patient'}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,.7)' }}>Suivi par Dr. Benali — Cabinet Bright Smile</div>
          </div>
          <div style={{ marginLeft: 'auto', fontSize: 11, background: 'rgba(255,255,255,.2)', color: '#fff', padding: '4px 12px', borderRadius: 20, fontWeight: 500 }}>
            Dossier actif
          </div>
        </div>

        {/* Onglets */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--pat-border)', padding: '0 24px' }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{
                padding: '14px 16px', fontSize: 13, fontWeight: tab === t.id ? 600 : 400,
                color: tab === t.id ? 'var(--pat-red)' : 'var(--pat-muted)',
                background: 'none', border: 'none', borderBottom: `2px solid ${tab === t.id ? 'var(--pat-red)' : 'transparent'}`,
                cursor: 'pointer', marginBottom: -1, transition: 'all .2s', whiteSpace: 'nowrap',
                fontFamily: 'DM Sans, sans-serif',
              }}>
              {t.label}
            </button>
          ))}
        </div>

        <div style={{ padding: '24px' }}>

          {/* Tab infos */}
          {tab === 'infos' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { key: 'Nom complet',    val: user?.name || '—' },
                { key: 'Email',          val: user?.email || '—' },
                { key: 'Téléphone',      val: user?.phone || '—' },
                { key: 'Groupe sanguin', val: 'A+' },
                { key: 'Allergie',       val: '⚠ Pénicilline', danger: true },
                { key: 'Médecin',        val: 'Dr. Benali' },
              ].map(({ key, val, danger }) => (
                <div key={key} style={{ background: 'var(--pat-bg)', borderRadius: 10, padding: '12px 16px' }}>
                  <div style={{ fontSize: 11, color: 'var(--pat-muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '.05em' }}>{key}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: danger ? 'var(--pat-red)' : 'var(--pat-dark)' }}>{val}</div>
                </div>
              ))}
            </div>
          )}

          {/* Tab antécédents */}
          {tab === 'antecedents' && (
            <div style={{ background: 'var(--pat-bg)', borderRadius: 10, padding: '16px 18px', fontSize: 14, color: 'var(--pat-dark)', lineHeight: 1.8 }}>
              Aucune pathologie chronique connue. Allergie confirmée à la pénicilline (urticaire). Chirurgie appendiculaire en 2019. Non fumeuse. Pas de traitement médicamenteux en cours.
            </div>
          )}

          {/* Tab consultations */}
          {tab === 'consultations' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {CONSULTATIONS.map((c, i) => (
                <div key={c.id} style={{ display: 'flex', gap: 16, padding: '16px', background: 'var(--pat-bg)', borderRadius: 10 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--pat-green)', border: '2px solid #fff', boxShadow: '0 0 0 2px var(--pat-green)' }} />
                    {i < CONSULTATIONS.length - 1 && <div style={{ width: 2, flex: 1, background: 'var(--pat-border)', borderRadius: 2 }} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--pat-dark)' }}>{c.motif}</div>
                      <span style={{ fontSize: 11, color: 'var(--pat-muted)', flexShrink: 0, marginLeft: 12 }}>{c.date}</span>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--pat-blue)', marginBottom: 4, fontWeight: 500 }}>Diagnostic : {c.diagnostic}</div>
                    <div style={{ fontSize: 12, color: 'var(--pat-muted)', lineHeight: 1.5 }}>{c.notes}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab traitements */}
          {tab === 'traitements' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {TRAITEMENTS.map(t => (
                <div key={t.id} style={{ background: 'var(--pat-bg)', borderRadius: 10, padding: '16px 18px', borderLeft: `4px solid ${t.statut === 'termine' ? 'var(--pat-green)' : 'var(--pat-red)'}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--pat-dark)' }}>{t.intitule}</div>
                    <span style={{
                      fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 500,
                      background: t.statut === 'termine' ? 'var(--pat-green-light)' : 'var(--pat-red-light)',
                      color: t.statut === 'termine' ? 'var(--pat-green)' : 'var(--pat-red)',
                    }}>
                      {t.statut === 'termine' ? 'Terminé' : 'En cours'}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--pat-muted)', marginBottom: t.seances ? 10 : 0 }}>
                    Début : {t.date_debut}
                  </div>
                  {t.seances && (
                    <>
                      <div style={{ fontSize: 12, color: 'var(--pat-muted)', marginBottom: 6 }}>
                        Séance {t.seance_actuelle}/{t.seances}
                      </div>
                      <div style={{ height: 6, background: 'var(--pat-border)', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ width: `${Math.round((t.seance_actuelle / t.seances) * 100)}%`, height: '100%', background: 'var(--pat-red)', borderRadius: 3, transition: 'width .5s' }} />
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
// src/pages/patient/PriseRdv.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createRdvPatient } from '../../redux/patientActions';

const MOTIFS = [
  'Consultation générale',
  'Détartrage',
  'Soins de carie',
  'Couronne',
  'Extraction',
  'Implant',
  'Blanchiment',
  'Orthodontie',
  'Urgence douleur',
  'Autre',
];

const JOURS_SEMAINE = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const STEPS = ['Date', 'Créneau', 'Motif', 'Confirmation'];

function genererCalendrier(annee, mois) {
  const premier = new Date(annee, mois, 1);
  const dernier = new Date(annee, mois + 1, 0);
  const jourDebut = (premier.getDay() + 6) % 7;
  const jours = [];

  for (let i = 0; i < jourDebut; i++) jours.push(null);
  for (let j = 1; j <= dernier.getDate(); j++) jours.push(j);

  return jours;
}

const ChevronLeft = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const ChevronRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const CheckIcon = ({ size = 14, color = '#fff' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" width={size} height={size}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const CalIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="var(--pat-muted)" strokeWidth="1.5" width="24" height="24">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const PinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="var(--pat-muted)" strokeWidth="1.5" width="14" height="14">
    <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

export default function PriseRdv() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const creneaux = useSelector((s) => s.patientRdv?.creneaux || []);

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  const [annee, setAnnee] = useState(today.getFullYear());
  const [mois, setMois] = useState(today.getMonth());
  const [jour, setJour] = useState(null);
  const [heure, setHeure] = useState(null);
  const [motif, setMotif] = useState('');
  const [etape, setEtape] = useState(1);
  const [loading, setLoading] = useState(false);

  const jours = genererCalendrier(annee, mois);
  const nomMois = new Date(annee, mois).toLocaleDateString('fr-FR', {
    month: 'long',
    year: 'numeric',
  });

  const dateStr = jour
    ? `${annee}-${String(mois + 1).padStart(2, '0')}-${String(jour).padStart(2, '0')}`
    : null;

  const selectionnerJour = (j) => {
    if (!j) return;

    const d = `${annee}-${String(mois + 1).padStart(2, '0')}-${String(j).padStart(2, '0')}`;
    if (d < todayStr) return;

    setJour(j);
    setHeure(null);
    setEtape(2);
  };

  const selectionnerCreneau = (h) => {
    setHeure(h);
    setEtape(3);
  };

  const confirmerRdv = async () => {
    if (!dateStr || !heure || !motif) return;

    try {
      setLoading(true);

      await dispatch(
        createRdvPatient({
          date: dateStr,
          heure,
          motif,
          dentiste: 'Dr. Benali',
        })
      );

      setEtape(4);
    } catch (err) {
      console.error('Erreur ajout RDV :', err);
      alert("Le rendez-vous n'a pas pu être ajouté.");
    } finally {
      setLoading(false);
    }
  };

  const recommencer = () => {
    setJour(null);
    setHeure(null);
    setMotif('');
    setEtape(1);
  };

  if (etape === 4) {
    return (
      <div>
        <div style={{ marginBottom: 28 }}>
          <div className="pat-page-label">Réservation</div>
          <h1 className="pat-page-title">
            Rendez-vous <em>confirmé</em>
          </h1>
        </div>

        <div
          style={{
            background: '#fff',
            border: '0.5px solid var(--pat-border)',
            borderRadius: 14,
            padding: 40,
            maxWidth: 500,
            margin: '0 auto',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: 'var(--pat-green-light)',
              border: '2px solid var(--pat-green)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
            }}
          >
            <CheckIcon size={28} color="var(--pat-green)" />
          </div>

          <h2
            style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 22,
              color: 'var(--pat-dark)',
              marginBottom: 8,
              fontWeight: 400,
            }}
          >
            Votre rendez-vous est enregistré
          </h2>

          <p style={{ fontSize: 13, color: 'var(--pat-muted)', marginBottom: 24 }}>
            Un email de confirmation vous sera envoyé. Merci d&apos;arriver 5 minutes avant.
          </p>

          <div
            style={{
              background: 'var(--pat-bg)',
              borderRadius: 10,
              padding: '14px 18px',
              textAlign: 'left',
              marginBottom: 24,
            }}
          >
            {[
              { k: 'Date', v: `${String(jour).padStart(2, '0')}/${String(mois + 1).padStart(2, '0')}/${annee}` },
              { k: 'Heure', v: heure },
              { k: 'Motif', v: motif },
              { k: 'Praticien', v: 'Dr. Benali' },
              { k: 'Cabinet', v: '45 Boulevard Anfa, Casablanca' },
            ].map(({ k, v }) => (
              <div
                key={k}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '6px 0',
                  borderBottom: '0.5px solid var(--pat-border)',
                  fontSize: 13,
                }}
              >
                <span style={{ color: 'var(--pat-muted)' }}>{k}</span>
                <span style={{ fontWeight: 500, color: 'var(--pat-dark)' }}>{v}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            <button className="pat-btn-primary" onClick={recommencer}>
              Prendre un autre RDV
            </button>
            <button className="pat-btn-secondary" onClick={() => navigate('/patient/rdv')}>
              Voir mes RDV
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div className="pat-page-label">Réservation</div>
        <h1 className="pat-page-title">
          Prendre un <em>rendez-vous</em>
        </h1>
        <p className="pat-page-sub">Réservez en ligne, disponible 24h/24</p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 28 }}>
        {STEPS.map((s, i) => (
          <React.Fragment key={s}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  fontWeight: 700,
                  background:
                    etape > i + 1
                      ? 'var(--pat-green)'
                      : etape === i + 1
                      ? 'var(--pat-red)'
                      : '#fff',
                  color: etape >= i + 1 ? '#fff' : 'var(--pat-border)',
                  border: etape < i + 1 ? '2px solid var(--pat-border)' : 'none',
                  transition: 'all .3s',
                }}
              >
                {etape > i + 1 ? <CheckIcon /> : i + 1}
              </div>

              <span
                style={{
                  fontSize: 13,
                  fontWeight: etape === i + 1 ? 600 : 400,
                  color:
                    etape === i + 1
                      ? 'var(--pat-red)'
                      : etape > i + 1
                      ? 'var(--pat-green)'
                      : 'var(--pat-muted)',
                }}
              >
                {s}
              </span>
            </div>

            {i < STEPS.length - 1 && (
              <div
                style={{
                  flex: 1,
                  height: 2,
                  margin: '0 10px',
                  background: etape > i + 1 ? 'var(--pat-green)' : 'var(--pat-border)',
                  borderRadius: 2,
                  transition: 'background .3s',
                }}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div
          style={{
            background: '#fff',
            border: '0.5px solid var(--pat-border)',
            borderRadius: 14,
            padding: '22px 24px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 16,
            }}
          >
            <button
              onClick={() => {
                if (mois === 0) {
                  setMois(11);
                  setAnnee((a) => a - 1);
                } else {
                  setMois((m) => m - 1);
                }
              }}
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                border: '0.5px solid var(--pat-border)',
                background: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--pat-muted)',
              }}
            >
              <ChevronLeft />
            </button>

            <span
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: 'var(--pat-dark)',
                textTransform: 'capitalize',
              }}
            >
              {nomMois}
            </span>

            <button
              onClick={() => {
                if (mois === 11) {
                  setMois(0);
                  setAnnee((a) => a + 1);
                } else {
                  setMois((m) => m + 1);
                }
              }}
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                border: '0.5px solid var(--pat-border)',
                background: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--pat-muted)',
              }}
            >
              <ChevronRight />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 2, marginBottom: 6 }}>
            {JOURS_SEMAINE.map((j) => (
              <div
                key={j}
                style={{
                  textAlign: 'center',
                  fontSize: 11,
                  fontWeight: 600,
                  color: 'var(--pat-muted)',
                  padding: '4px 0',
                  letterSpacing: '.03em',
                }}
              >
                {j}
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 3 }}>
            {jours.map((j, i) => {
              const d = j
                ? `${annee}-${String(mois + 1).padStart(2, '0')}-${String(j).padStart(2, '0')}`
                : null;
              const isPasse = d && d < todayStr;
              const isToday = d === todayStr;
              const isSelect = j === jour;

              return (
                <div
                  key={i}
                  onClick={() => !isPasse && selectionnerJour(j)}
                  style={{
                    height: 36,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: isToday || isSelect ? 600 : 400,
                    cursor: !j || isPasse ? 'default' : 'pointer',
                    background: isSelect ? 'var(--pat-red)' : isToday ? 'var(--pat-red-light)' : 'transparent',
                    color: isSelect
                      ? '#fff'
                      : isToday
                      ? 'var(--pat-red)'
                      : !j || isPasse
                      ? 'var(--pat-border)'
                      : 'var(--pat-dark)',
                    border: isToday && !isSelect ? '1px solid var(--pat-red-mid)' : '1px solid transparent',
                    transition: 'all .15s',
                  }}
                >
                  {j || ''}
                </div>
              );
            })}
          </div>

          <div
            style={{
              display: 'flex',
              gap: 16,
              marginTop: 14,
              paddingTop: 12,
              borderTop: '0.5px solid var(--pat-border)',
              fontSize: 11,
              color: 'var(--pat-muted)',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 3,
                  background: 'var(--pat-red)',
                  display: 'inline-block',
                }}
              />
              Sélectionné
            </span>

            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 3,
                  background: 'var(--pat-red-light)',
                  border: '1px solid var(--pat-red-mid)',
                  display: 'inline-block',
                }}
              />
              Aujourd&apos;hui
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {etape === 1 && (
            <div
              style={{
                background: '#fff',
                border: '0.5px solid var(--pat-border)',
                borderRadius: 14,
                padding: 32,
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                minHeight: 180,
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: 'var(--pat-bg)',
                  border: '0.5px solid var(--pat-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 14,
                }}
              >
                <CalIcon />
              </div>

              <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--pat-dark)', marginBottom: 6 }}>
                Sélectionnez une date
              </p>

              <p style={{ fontSize: 12, color: 'var(--pat-muted)', maxWidth: 220, lineHeight: 1.6 }}>
                Cliquez sur un jour dans le calendrier pour voir les créneaux disponibles
              </p>
            </div>
          )}

          {etape >= 2 && jour && (
            <div
              style={{
                background: '#fff',
                border: '0.5px solid var(--pat-border)',
                borderRadius: 14,
                padding: '20px 22px',
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--pat-dark)', marginBottom: 4 }}>
                Créneaux disponibles
              </div>

              <div style={{ fontSize: 12, color: 'var(--pat-muted)', marginBottom: 14 }}>
                {String(jour).padStart(2, '0')}/{String(mois + 1).padStart(2, '0')}/{annee} — Dr. Benali
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
                {(creneaux.length > 0
                  ? creneaux
                  : [
                      { heure: '09:00', disponible: true },
                      { heure: '09:30', disponible: true },
                      { heure: '10:00', disponible: false },
                      { heure: '10:30', disponible: true },
                      { heure: '11:00', disponible: true },
                      { heure: '14:00', disponible: false },
                      { heure: '14:30', disponible: true },
                      { heure: '15:00', disponible: true },
                      { heure: '15:30', disponible: true },
                      { heure: '16:00', disponible: true },
                      { heure: '16:30', disponible: true },
                      { heure: '17:00', disponible: false },
                    ]
                ).map((c, i) => (
                  <button
                    key={i}
                    onClick={() => c.disponible && selectionnerCreneau(c.heure)}
                    disabled={!c.disponible}
                    style={{
                      padding: '10px 6px',
                      borderRadius: 8,
                      textAlign: 'center',
                      fontSize: 13,
                      fontWeight: 500,
                      fontFamily: 'DM Sans, sans-serif',
                      border: `1.5px solid ${
                        heure === c.heure
                          ? 'var(--pat-red)'
                          : c.disponible
                          ? 'var(--pat-border)'
                          : 'transparent'
                      }`,
                      background:
                        heure === c.heure ? 'var(--pat-red)' : c.disponible ? '#fff' : 'var(--pat-bg)',
                      color:
                        heure === c.heure ? '#fff' : c.disponible ? 'var(--pat-dark)' : 'var(--pat-border)',
                      cursor: c.disponible ? 'pointer' : 'not-allowed',
                      transition: 'all .18s',
                    }}
                  >
                    {c.heure}
                    {!c.disponible && (
                      <div style={{ fontSize: 9, marginTop: 2, color: 'var(--pat-border)' }}>
                        Indisponible
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {etape >= 3 && heure && (
            <div
              style={{
                background: '#fff',
                border: '0.5px solid var(--pat-border)',
                borderRadius: 14,
                padding: '20px 22px',
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--pat-dark)', marginBottom: 14 }}>
                Motif de la consultation
              </div>

              <div style={{ marginBottom: 14 }}>
                <label
                  style={{
                    fontSize: 12,
                    color: 'var(--pat-muted)',
                    display: 'block',
                    marginBottom: 6,
                  }}
                >
                  Motif *
                </label>

                <select
                  value={motif}
                  onChange={(e) => setMotif(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '0.5px solid var(--pat-border)',
                    borderRadius: 8,
                    fontSize: 13,
                    fontFamily: 'DM Sans, sans-serif',
                    background: '#fff',
                    color: 'var(--pat-dark)',
                    outline: 'none',
                  }}
                >
                  <option value="">-- Sélectionner un motif --</option>
                  {MOTIFS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div
                style={{
                  background: 'var(--pat-bg)',
                  borderRadius: 8,
                  padding: '10px 14px',
                  marginBottom: 14,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 12,
                  color: 'var(--pat-muted)',
                }}
              >
                <PinIcon />
                Cabinet Bright Smile — 45 Boulevard Anfa, 20100 Casablanca
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  className="pat-btn-primary"
                  onClick={confirmerRdv}
                  disabled={!motif || loading}
                  style={{ flex: 1, opacity: motif && !loading ? 1 : 0.5 }}
                >
                  {loading ? 'Enregistrement...' : 'Confirmer le rendez-vous'}
                </button>

                <button
                  className="pat-btn-secondary"
                  onClick={() => {
                    setHeure(null);
                    setEtape(2);
                  }}
                  disabled={loading}
                >
                  Retour
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
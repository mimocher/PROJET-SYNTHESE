import React from 'react';
import { useNavigate } from 'react-router-dom';

/* ═══════════════════════════════════════════════════
   INJECT FONTS + KEYFRAMES
═══════════════════════════════════════════════════ */
function injectGlobal() {
  if (document.getElementById('dent-global')) return;
  const s = document.createElement('style');
  s.id = 'dent-global';
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');
    *,*::before,*::after{box-sizing:border-box}
    @keyframes fadeUp  {from{opacity:0;transform:translateY(26px)}to{opacity:1;transform:translateY(0)}}
    @keyframes fadeIn  {from{opacity:0}to{opacity:1}}
    @keyframes scaleIn {from{opacity:0;transform:scale(.96)}to{opacity:1;transform:scale(1)}}
  `;
  document.head.appendChild(s);
}

/* ═══════════════════════════════════════════════════
   DESIGN TOKENS
═══════════════════════════════════════════════════ */
const IVORY = '#FCFAF7';
const IVORY_MID = '#E9E2D8';
const IVORY_DK = '#D9D0C3';
const GOLD = '#C6A46A';
const GOLD_LT = '#DCC39A';
const GOLD_PALE = 'rgba(198,164,106,.10)';
const CHARCOAL = '#2F2A24';
const INK = '#5B544B';
const MUTED = '#8E857A';
const MUTED_LT = '#AFA69A';
const WHITE = '#FFFFFF';

const FD = '"Playfair Display", Georgia, serif';
const FB = '"DM Sans", system-ui, sans-serif';

/* ═══════════════════════════════════════════════════
   SVG ICON COMPONENTS
═══════════════════════════════════════════════════ */
function IcoStar() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}
function IcoArrow() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}
function IcoPlus() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}
function IcoMinus() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}
function IcoStarFill() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill={GOLD}>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}
function IcoQuote() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={GOLD_LT} strokeWidth="1.3">
      <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
      <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
    </svg>
  );
}
function IcoCheck() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke={GOLD}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
function IcoZap() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke={GOLD}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}
function IcoAward() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke={GOLD}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="8" r="6" />
      <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
    </svg>
  );
}
function IcoMicroscope() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke={GOLD}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 18h8" />
      <path d="M3 21h18" />
      <path d="M14 21v-4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v4" />
      <path d="M14 7V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v4" />
      <path d="M10 7h4" />
      <path d="M8 7H4" />
      <circle cx="12" cy="11" r="3" />
    </svg>
  );
}
function IcoGem() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke={GOLD}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="6 3 18 3 22 9 12 22 2 9" />
      <line x1="2" y1="9" x2="22" y2="9" />
      <line x1="6" y1="3" x2="12" y2="22" />
      <line x1="18" y1="3" x2="12" y2="22" />
    </svg>
  );
}
function IcoCalendar() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke={GOLD}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <polyline points="9 16 11 18 15 14" />
    </svg>
  );
}
function IcoSparkle() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke={GOLD}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M16.9 16.9l1.4 1.4M5.6 18.4l1.4-1.4M16.9 7.1l1.4-1.4" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  );
}
function IcoSmile() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke={GOLD}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
      <line x1="9" y1="9" x2="9.01" y2="9" />
      <line x1="15" y1="9" x2="15.01" y2="9" />
    </svg>
  );
}
function IcoShield() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke={GOLD}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}
function IcoTooth() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke={GOLD}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2C8 2 5 5 5 8c0 2 .5 3.5 1 5l1 7c.2 1 1 2 2 2s1.8-1 2-2l1-4 1 4c.2 1 1 2 2 2s1.8-1 2-2l1-7c.5-1.5 1-3 1-5 0-3-3-6-7-6z" />
    </svg>
  );
}
function IcoHeart() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke={GOLD}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}
function IcoBridge() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke={GOLD}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="8" width="5" height="10" rx="1" />
      <rect x="17" y="8" width="5" height="10" rx="1" />
      <path d="M7 11h10M7 15h10" />
      <path d="M7 8V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════
   REUSABLE: SECTION HEADER
═══════════════════════════════════════════════════ */
function SectionHeader({ eyebrow, title, subtitle }) {
  return (
    <header style={{ textAlign: 'center', maxWidth: '620px', margin: '0 auto 4.5rem' }}>
      <span
        style={{
          display: 'inline-block',
          fontSize: '.7rem',
          fontWeight: 500,
          letterSpacing: '.15em',
          textTransform: 'uppercase',
          color: GOLD,
          marginBottom: '.85rem',
        }}
      >
        {eyebrow}
      </span>
      <h2
        style={{
          fontFamily: FD,
          fontWeight: 300,
          fontSize: 'clamp(2rem,3.2vw,2.9rem)',
          color: CHARCOAL,
          lineHeight: 1.2,
          letterSpacing: '-.01em',
          margin: '0 0 .9rem',
        }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          style={{
            fontSize: '.94rem',
            fontWeight: 300,
            color: INK,
            lineHeight: 1.78,
            margin: 0,
          }}
        >
          {subtitle}
        </p>
      )}
    </header>
  );
}

/* ═══════════════════════════════════════════════════
   REUSABLE: TAG BADGE
═══════════════════════════════════════════════════ */
function TagBadge({ label }) {
  return (
    <span
      style={{
        display: 'inline-block',
        fontSize: '.63rem',
        fontWeight: 500,
        letterSpacing: '.1em',
        textTransform: 'uppercase',
        color: GOLD,
        background: GOLD_PALE,
        border: `1px solid ${GOLD_LT}`,
        borderRadius: '100px',
        padding: '.28rem .85rem',
        marginBottom: '.8rem',
      }}
    >
      {label}
    </span>
  );
}

/* ═══════════════════════════════════════════════════
   REUSABLE: ICON WRAPPER
═══════════════════════════════════════════════════ */
function IconBox({ children }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '50px',
        height: '50px',
        background: GOLD_PALE,
        borderRadius: '13px',
        marginBottom: '1.3rem',
        color: GOLD,
      }}
    >
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════ */
function Home() {
  const navigate = useNavigate();
  injectGlobal();

  const [hBtn, setHBtn] = React.useState(null);
  const [hCard, setHCard] = React.useState(null);
  const [hTreat, setHTreat] = React.useState(null);
  const [imgHov, setImgHov] = React.useState(false);
  const [openFaq, setOpenFaq] = React.useState(null);
  const [reviewPage, setReviewPage] = React.useState(0);

  const features = [
    {
      icon: <IcoAward />,
      title: 'Expertise reconnue',
      text: "Praticiens hautement qualifiés, plus de 20 ans d'expérience.",
    },
    {
      icon: <IcoMicroscope />,
      title: 'Technologies avancées',
      text: 'Équipements dernière génération pour diagnostics précis.',
    },
    {
      icon: <IcoGem />,
      title: 'Service premium',
      text: 'Accompagnement personnalisé dans un cadre luxueux.',
    },
    {
      icon: <IcoCalendar />,
      title: 'Horaires flexibles',
      text: 'Ouvert 6 jours sur 7, plages horaires étendues.',
    },
  ];

  const treatments = [
    {
      icon: <IcoSparkle />,
      title: 'Blanchiment dentaire',
      desc: "Éclaircissement professionnel jusqu'à 8 teintes. Résultats visibles dès la première séance.",
      tag: 'Esthétique',
    },
    {
      icon: <IcoSmile />,
      title: 'Facettes en céramique',
      desc: 'Facettes ultra-fines sur mesure pour un sourire parfaitement harmonieux et naturel.',
      tag: 'Esthétique',
    },
    {
      icon: <IcoTooth />,
      title: 'Implants dentaires',
      desc: 'Solution permanente pour remplacer les dents manquantes avec une précision chirurgicale.',
      tag: 'Implantologie',
    },
    {
      icon: <IcoShield />,
      title: 'Orthodontie invisible',
      desc: 'Aligneurs transparents sur mesure pour corriger les malocclusions discrètement.',
      tag: 'Orthodontie',
    },
    {
      icon: <IcoHeart />,
      title: 'Soins parodontaux',
      desc: 'Prévention et traitement des maladies des gencives pour une santé durable.',
      tag: 'Parodontologie',
    },
    {
      icon: <IcoBridge />,
      title: 'Couronnes & bridges',
      desc: 'Prothèses sur mesure en zircone ou céramique, alliant esthétique et longévité.',
      tag: 'Prothèse',
    },
  ];

  const reviews = [
    {
      name: 'Samira El Mansouri',
      role: "Cheffe d'entreprise",
      text: 'Une expérience exceptionnelle du début à la fin. Le Dr. Alami a transformé mon sourire avec une précision remarquable. Je recommande vivement.',
      initials: 'SE',
    },
    {
      name: 'Karim Benali',
      role: 'Architecte',
      text: "Cabinet d'un niveau rare. Les équipements sont à la pointe et l'équipe prend soin de chaque détail. Mon blanchiment est parfait.",
      initials: 'KB',
    },
    {
      name: 'Nadia Chraibi',
      role: 'Médecin spécialiste',
      text: "En tant que professionnelle de santé, j'apprécie la rigueur et la stérilisation irréprochable. Résultats bluffants.",
      initials: 'NC',
    },
    {
      name: 'Youssef Tazi',
      role: 'Directeur financier',
      text: 'Implants posés il y a 2 ans, résultat naturel et durable. Suivi post-opératoire exemplaire. Le meilleur investissement.',
      initials: 'YT',
    },
    {
      name: 'Leila Hajji',
      role: 'Professeure',
      text: 'Les facettes céramique ont changé ma confiance en moi. Travail artistique et médical à la fois. Infiniment reconnaissante.',
      initials: 'LH',
    },
  ];

  const faqs = [
    {
      q: 'Combien coûte une consultation initiale ?',
      a: 'La consultation de diagnostic est à 300 DH. Elle comprend un examen complet, un bilan radiologique numérique et un devis personnalisé détaillé sans engagement.',
    },
    {
      q: 'Les traitements sont-ils pris en charge par les mutuelles ?',
      a: 'La majorité des soins conservateurs sont remboursés. Pour les traitements esthétiques et implantaires, nous vous aidons à optimiser votre prise en charge et proposons des facilités de paiement.',
    },
    {
      q: 'Combien de séances pour un blanchiment professionnel ?',
      a: "Notre protocole se réalise en une seule séance d'environ 1h30. Le résultat est immédiat avec des dents éclaircies jusqu'à 8 teintes.",
    },
    {
      q: 'À quel âge peut-on poser des implants dentaires ?',
      a: 'Les implants sont recommandés dès 18 ans. Ils conviennent à tous les âges avec une bonne santé gingivale. Aucune limite supérieure.',
    },
    {
      q: 'Proposez-vous des traitements sous sédation consciente ?',
      a: 'Oui, pour les patients anxieux nous proposons la sédation consciente par inhalation de MEOPA ou par voie orale. Un environnement sécurisé pour tous.',
    },
    {
      q: 'Comment prendre rendez-vous en urgence ?',
      a: "Une ligne d'urgence est disponible 7j/7 au +212 5 37 XX XX XX. Nous réservons des créneaux quotidiens pour les douleurs aiguës, traumatismes et infections.",
    },
  ];

  const visibleReviews = [
    reviews[reviewPage % reviews.length],
    reviews[(reviewPage + 1) % reviews.length],
    reviews[(reviewPage + 2) % reviews.length],
  ];

  return (
    <div
      style={{
        fontFamily: FB,
        color: CHARCOAL,
        background: 'linear-gradient(180deg, #FEFCF9 0%, #F8F4EE 100%)',
        overflowX: 'hidden',
      }}
    >
      {/* HERO */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          alignItems: 'center',
          gap: '4rem',
          padding: '6rem 8vw 4rem',
          minHeight: '90vh',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse 55% 70% at 80% 50%, rgba(198,164,106,.10) 0%, transparent 72%)',
            pointerEvents: 'none',
          }}
        />

        {/* Left */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem',
            animation: 'fadeUp .85s ease both',
          }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '.7rem',
              fontWeight: 500,
              letterSpacing: '.14em',
              textTransform: 'uppercase',
              color: GOLD,
              border: `1px solid ${GOLD_LT}`,
              borderRadius: '100px',
              padding: '.38rem 1.1rem',
              width: 'fit-content',
              background: 'rgba(255,255,255,.6)',
            }}
          >
            <IcoStar /> Excellence Certifiée
          </span>

          <h1
            style={{
              fontFamily: FD,
              fontWeight: 300,
              fontSize: 'clamp(2.6rem,4.8vw,4.4rem)',
              lineHeight: 1.1,
              color: CHARCOAL,
              margin: 0,
            }}
          >
            Votre <em style={{ fontStyle: 'italic', color: GOLD }}>sourire</em>,
            <br />
            notre passion
          </h1>

          <p
            style={{
              fontSize: '.96rem',
              fontWeight: 300,
              color: INK,
              lineHeight: 1.82,
              maxWidth: '44ch',
              margin: 0,
            }}
          >
            Des soins dentaires d&apos;exception dans un environnement apaisant.
            Notre équipe vous garantit des résultats parfaits grâce aux technologies les plus avancées.
          </p>

          {/* Stats row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '1.5rem 1.25rem',
              borderTop: `1px solid ${IVORY_MID}`,
              borderBottom: `1px solid ${IVORY_MID}`,
              background: 'rgba(255,255,255,.45)',
              borderRadius: '18px',
              backdropFilter: 'blur(6px)',
            }}
          >
            {[['20+', "Années d'expérience"], ['15 k+', 'Patients satisfaits'], ['98 %', 'Satisfaction']].map(
              ([n, l], i) => (
                <React.Fragment key={l}>
                  {i > 0 && <div style={{ width: '1px', height: '2.4rem', background: IVORY_MID }} />}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '.25rem',
                      padding: i === 0 ? '0 1.8rem 0 0' : '0 1.8rem',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: FD,
                        fontWeight: 300,
                        fontSize: '1.9rem',
                        color: CHARCOAL,
                        lineHeight: 1,
                      }}
                    >
                      {n}
                    </span>
                    <span style={{ fontSize: '.73rem', color: MUTED, letterSpacing: '.03em' }}>{l}</span>
                  </div>
                </React.Fragment>
              )
            )}
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '.9rem', flexWrap: 'wrap' }}>
            <button
              onMouseEnter={() => setHBtn('rdv')}
              onMouseLeave={() => setHBtn(null)}
              onClick={() => navigate('/panier')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontFamily: FB,
                fontSize: '.85rem',
                fontWeight: 500,
                background: hBtn === 'rdv' ? GOLD : WHITE,
                color: hBtn === 'rdv' ? WHITE : CHARCOAL,
                border: `1px solid ${hBtn === 'rdv' ? GOLD : IVORY_MID}`,
                borderRadius: '100px',
                padding: '.85rem 2rem',
                cursor: 'pointer',
                transform: hBtn === 'rdv' ? 'translateY(-2px)' : 'none',
                boxShadow: '0 10px 26px rgba(47,42,36,.06)',
                transition: 'all .22s ease',
              }}
            >
              Prendre rendez-vous <IcoArrow />
            </button>

            <button
              onMouseEnter={() => setHBtn('svc')}
              onMouseLeave={() => setHBtn(null)}
              onClick={() => navigate('/services')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontFamily: FB,
                fontSize: '.85rem',
                fontWeight: 500,
                background: hBtn === 'svc' ? GOLD_PALE : WHITE,
                color: CHARCOAL,
                border: `1px solid ${IVORY_MID}`,
                borderRadius: '100px',
                padding: '.85rem 2rem',
                cursor: 'pointer',
                transform: hBtn === 'svc' ? 'translateY(-2px)' : 'none',
                boxShadow: '0 8px 22px rgba(47,42,36,.04)',
                transition: 'all .22s ease',
              }}
            >
              Nos traitements
            </button>
          </div>
        </div>

        {/* Right: image */}
        <div style={{ position: 'relative', animation: 'fadeUp .85s .2s ease both', opacity: 0 }}>
          <div
            onMouseEnter={() => setImgHov(true)}
            onMouseLeave={() => setImgHov(false)}
            style={{
              borderRadius: '24px',
              overflow: 'hidden',
              aspectRatio: '4/5',
              background: WHITE,
              boxShadow: `0 0 0 1px ${WHITE}, 0 0 0 1px ${IVORY_MID}, 0 24px 60px rgba(47,42,36,.10)`,
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=900&h=700&fit=crop&q=90"
              alt="Cabinet dentaire"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                transform: imgHov ? 'scale(1.05)' : 'scale(1)',
                transition: 'transform 7s ease',
              }}
            />
          </div>

          {[
            {
              style: { bottom: '9%', left: '-1.5rem' },
              delay: '.5s',
              icon: <IcoCheck />,
              title: 'Équipe certifiée',
              sub: 'Dentistes diplômés',
            },
            {
              style: { top: '10%', right: '-1.5rem' },
              delay: '.7s',
              icon: <IcoZap />,
              title: 'Technologies avancées',
              sub: 'Équipements de pointe',
            },
          ].map(({ style, delay, icon, title, sub }) => (
            <div
              key={title}
              style={{
                position: 'absolute',
                ...style,
                display: 'flex',
                alignItems: 'center',
                gap: '.65rem',
                background: 'rgba(255,255,255,.94)',
                border: `1px solid ${IVORY_MID}`,
                borderRadius: '14px',
                padding: '.75rem 1.1rem',
                boxShadow: '0 14px 34px rgba(47,42,36,.08)',
                backdropFilter: 'blur(10px)',
                animation: `fadeUp .8s ${delay} ease both`,
                opacity: 0,
              }}
            >
              {icon}
              <div>
                <p
                  style={{
                    fontSize: '.82rem',
                    fontWeight: 500,
                    color: CHARCOAL,
                    margin: 0,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {title}
                </p>
                <p style={{ fontSize: '.72rem', color: MUTED, margin: '.1rem 0 0' }}>{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WHY US */}
      <section style={{ padding: '7rem 8vw', background: WHITE }}>
        <SectionHeader
          eyebrow="Pourquoi nous choisir"
          title="L'excellence à votre service"
          subtitle="Une approche complète alliant expertise médicale, technologies de pointe et accompagnement personnalisé."
        />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1.4rem' }}>
          {features.map(({ icon, title, text }, i) => (
            <div
              key={title}
              onMouseEnter={() => setHCard(i)}
              onMouseLeave={() => setHCard(null)}
              style={{
                background: WHITE,
                border: `1px solid ${hCard === i ? GOLD_LT : IVORY_MID}`,
                borderRadius: '16px',
                padding: '2rem 1.6rem',
                transform: hCard === i ? 'translateY(-6px)' : 'none',
                boxShadow:
                  hCard === i
                    ? '0 18px 40px rgba(47,42,36,.08)'
                    : '0 6px 18px rgba(47,42,36,.03)',
                transition: 'all .28s ease',
                cursor: 'default',
                animation: `fadeUp .7s ${0.1 + i * 0.1}s ease both`,
                opacity: 0,
              }}
            >
              <IconBox>{icon}</IconBox>
              <h3
                style={{
                  fontFamily: FD,
                  fontWeight: 400,
                  fontSize: '1.2rem',
                  color: CHARCOAL,
                  margin: '0 0 .55rem',
                }}
              >
                {title}
              </h3>
              <p
                style={{
                  fontSize: '.87rem',
                  fontWeight: 300,
                  color: INK,
                  lineHeight: 1.72,
                  margin: 0,
                }}
              >
                {text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* TREATMENTS */}
      <section
        style={{
          padding: '7rem 8vw',
          background: '#F7F3EC',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '8vw',
            width: '1px',
            height: '100%',
            background: 'rgba(198,164,106,.10)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: '8vw',
            width: '1px',
            height: '100%',
            background: 'rgba(198,164,106,.10)',
            pointerEvents: 'none',
          }}
        />

        <SectionHeader
          eyebrow="Nos soins"
          title="Traitements d'exception"
          subtitle="Du soin préventif à la transformation esthétique, des protocoles rigoureux adaptés à chaque patient."
        />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.5rem' }}>
          {treatments.map(({ icon, title, desc, tag }, i) => (
            <div
              key={title}
              onMouseEnter={() => setHTreat(i)}
              onMouseLeave={() => setHTreat(null)}
              style={{
                background: hTreat === i ? 'rgba(198,164,106,.10)' : WHITE,
                border: `1px solid ${
                  hTreat === i ? 'rgba(198,164,106,.35)' : IVORY_MID
                }`,
                borderRadius: '18px',
                padding: '2.2rem 2rem',
                transform: hTreat === i ? 'translateY(-4px)' : 'none',
                transition: 'all .28s ease',
                cursor: 'default',
                animation: `scaleIn .6s ${0.05 * i}s ease both`,
                opacity: 0,
                boxShadow:
                  hTreat === i
                    ? '0 16px 38px rgba(47,42,36,.07)'
                    : '0 6px 18px rgba(47,42,36,.03)',
              }}
            >
              <TagBadge label={tag} />
              <div style={{ marginBottom: '1rem', color: GOLD }}>{icon}</div>
              <h3
                style={{
                  fontFamily: FD,
                  fontWeight: 300,
                  fontSize: '1.25rem',
                  color: CHARCOAL,
                  margin: '0 0 .6rem',
                }}
              >
                {title}
              </h3>
              <p
                style={{
                  fontSize: '.87rem',
                  fontWeight: 300,
                  color: INK,
                  lineHeight: 1.75,
                  margin: 0,
                }}
              >
                {desc}
              </p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
          <button
            onMouseEnter={() => setHBtn('all')}
            onMouseLeave={() => setHBtn(null)}
            onClick={() => navigate('/services')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontFamily: FB,
              fontSize: '.82rem',
              fontWeight: 500,
              letterSpacing: '.06em',
              textTransform: 'uppercase',
              background: WHITE,
              color: hBtn === 'all' ? GOLD : CHARCOAL,
              border: `1px solid ${hBtn === 'all' ? GOLD : IVORY_MID}`,
              borderRadius: '100px',
              padding: '.85rem 2.2rem',
              cursor: 'pointer',
              transition: 'all .22s ease',
              boxShadow: '0 8px 22px rgba(47,42,36,.04)',
            }}
          >
            Voir tous les traitements <IcoArrow />
          </button>
        </div>
      </section>

      {/* REVIEWS */}
      <section style={{ padding: '7rem 8vw', background: WHITE }}>
        <SectionHeader
          eyebrow="Témoignages"
          title="Ce que disent nos patients"
          subtitle="Plus de 15 000 patients nous font confiance. Leurs mots reflètent notre engagement quotidien."
        />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.4rem', alignItems: 'start' }}>
          {visibleReviews.map(({ name, role, text, initials }, i) => (
            <div
              key={name}
              style={{
                background: i === 1 ? '#FFF9F0' : WHITE,
                border: `1px solid ${i === 1 ? GOLD_LT : IVORY_MID}`,
                borderRadius: '20px',
                padding: '2.2rem',
                transform: i === 1 ? 'scale(1.04)' : 'scale(1)',
                boxShadow:
                  i === 1
                    ? '0 20px 50px rgba(198,164,106,.16)'
                    : '0 6px 18px rgba(47,42,36,.03)',
                animation: `fadeUp .6s ${i * 0.12}s ease both`,
                opacity: 0,
                transition: 'transform .3s ease',
              }}
            >
              <div style={{ marginBottom: '1.4rem' }}>
                <IcoQuote />
              </div>

              <p
                style={{
                  fontFamily: FD,
                  fontStyle: 'italic',
                  fontSize: '.93rem',
                  fontWeight: 300,
                  color: INK,
                  lineHeight: 1.8,
                  margin: '0 0 1.8rem',
                }}
              >
                &quot;{text}&quot;
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '.9rem' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    flexShrink: 0,
                    background: 'rgba(198,164,106,.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '.8rem',
                    fontWeight: 500,
                    color: GOLD,
                  }}
                >
                  {initials}
                </div>

                <div>
                  <p style={{ fontSize: '.87rem', fontWeight: 500, color: CHARCOAL, margin: 0 }}>
                    {name}
                  </p>
                  <p style={{ fontSize: '.75rem', color: MUTED, margin: '.15rem 0 .4rem' }}>{role}</p>
                  <div style={{ display: 'flex', gap: '2px' }}>
                    {[0, 1, 2, 3, 4].map((j) => (
                      <IcoStarFill key={j} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '2.5rem' }}>
          {reviews.map((_, d) => (
            <button
              key={d}
              onClick={() => setReviewPage(d)}
              style={{
                width: d === reviewPage ? '28px' : '8px',
                height: '8px',
                borderRadius: '100px',
                border: 'none',
                cursor: 'pointer',
                background: d === reviewPage ? GOLD : IVORY_DK,
                transition: 'all .3s ease',
                padding: 0,
              }}
            />
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '7rem 8vw', background: '#FCFAF7' }}>
        <SectionHeader
          eyebrow="Questions fréquentes"
          title="Tout ce que vous souhaitez savoir"
          subtitle="Nos réponses aux questions les plus posées par nos patients."
        />

        <div
          style={{
            maxWidth: '760px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '.75rem',
          }}
        >
          {faqs.map(({ q, a }, i) => {
            const open = openFaq === i;
            return (
              <div
                key={i}
                style={{
                  background: WHITE,
                  border: `1px solid ${open ? GOLD_LT : IVORY_MID}`,
                  borderRadius: '14px',
                  overflow: 'hidden',
                  boxShadow: open
                    ? '0 14px 34px rgba(198,164,106,.10)'
                    : '0 4px 12px rgba(47,42,36,.03)',
                  transition: 'all .25s ease',
                  animation: `fadeUp .6s ${0.06 * i}s ease both`,
                  opacity: 0,
                }}
              >
                <button
                  onClick={() => setOpenFaq(open ? null : i)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '1.4rem 1.6rem',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    gap: '1rem',
                  }}
                >
                  <span
                    style={{
                      fontFamily: FD,
                      fontWeight: 400,
                      fontSize: '1.05rem',
                      color: open ? GOLD : CHARCOAL,
                      lineHeight: 1.4,
                      flex: 1,
                      textAlign: 'left',
                      transition: 'color .2s',
                    }}
                  >
                    {q}
                  </span>
                  <span style={{ color: open ? GOLD : MUTED, flexShrink: 0, transition: 'color .2s' }}>
                    {open ? <IcoMinus /> : <IcoPlus />}
                  </span>
                </button>

                {open && (
                  <div style={{ padding: '0 1.6rem 1.5rem', animation: 'fadeIn .3s ease' }}>
                    <div
                      style={{
                        width: '32px',
                        height: '1px',
                        background: GOLD_LT,
                        marginBottom: '1rem',
                      }}
                    />
                    <p
                      style={{
                        fontSize: '.9rem',
                        fontWeight: 300,
                        color: INK,
                        lineHeight: 1.8,
                        margin: 0,
                      }}
                    >
                      {a}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA BANNER */}
      <section style={{ margin: '0 8vw 7rem' }}>
        <div
          style={{
            background: 'linear-gradient(135deg, #FFFDF9 0%, #F7F1E8 100%)',
            border: `1px solid ${IVORY_MID}`,
            borderRadius: '28px',
            padding: '5rem 6rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '3rem',
            flexWrap: 'wrap',
            boxShadow: '0 24px 60px rgba(47,42,36,.08)',
            animation: 'fadeUp .8s ease both',
          }}
        >
          <div style={{ flex: 1, minWidth: '280px' }}>
            <span
              style={{
                display: 'block',
                fontSize: '.7rem',
                fontWeight: 500,
                letterSpacing: '.15em',
                textTransform: 'uppercase',
                color: GOLD,
                marginBottom: '1rem',
              }}
            >
              Votre premier pas
            </span>

            <h2
              style={{
                fontFamily: FD,
                fontWeight: 300,
                fontSize: 'clamp(1.8rem,2.8vw,2.5rem)',
                color: CHARCOAL,
                margin: '0 0 .8rem',
                lineHeight: 1.2,
              }}
            >
              Prenez rendez-vous
              <br />
              <em style={{ fontStyle: 'italic', color: GOLD_LT }}>dès aujourd&apos;hui</em>
            </h2>

            <p
              style={{
                fontSize: '.9rem',
                fontWeight: 300,
                color: INK,
                lineHeight: 1.75,
                margin: 0,
                maxWidth: '42ch',
              }}
            >
              Consultation de diagnostic offerte pour tout nouveau patient. Notre équipe vous accueille 6 jours sur 7.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '.8rem', alignItems: 'flex-start' }}>
            <button
  onMouseEnter={() => setHBtn('cta')}
  onMouseLeave={() => setHBtn(null)}
  onClick={() => navigate('/services')}
  style={{
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    fontFamily: FB,
    fontSize: '.88rem',
    fontWeight: 500,
    background: hBtn === 'cta' ? GOLD : WHITE,
    color: hBtn === 'cta' ? WHITE : CHARCOAL,
    border: `1px solid ${IVORY_MID}`,
    borderRadius: '100px',
    padding: '.95rem 2.4rem',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transform: hBtn === 'cta' ? 'translateY(-2px)' : 'none',
    boxShadow: '0 10px 24px rgba(47,42,36,.06)',
    transition: 'all .22s ease',
  }}
>
  Réserver ma consultation <IcoArrow />
</button>

            <p style={{ fontSize: '.78rem', color: INK, margin: 0, paddingLeft: '.5rem' }}>
              📞 +212 5 37 XX XX XX — Réponse sous 2h
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
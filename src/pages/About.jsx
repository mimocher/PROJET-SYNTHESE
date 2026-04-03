import React from 'react';
import '../styles/About.css';

/* ── Icons ── */
const IconMapPin = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

const IconPhone = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.9 11.5a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.81 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.69a16 16 0 0 0 6.29 6.29l1.06-1.06a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z"/>
  </svg>
);

const IconMail = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);

const IconClock = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

const IconCar = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 17H5v-5l2-6h10l2 6v5Z"/>
    <circle cx="7.5" cy="17.5" r="1.5"/>
    <circle cx="16.5" cy="17.5" r="1.5"/>
    <path d="M5 12h14"/>
  </svg>
);

const IconAward = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="6"/>
    <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
  </svg>
);

/* ── Data ── */
const timelineItems = [
  {
    year: '2005',
    title: 'Diplôme de Chirurgie Dentaire',
    desc: "Faculté de Médecine Dentaire, Université Hassan II, Casablanca — Mention Très Honorable.",
  },
  {
    year: '2007',
    title: 'Ouverture du cabinet Bright Smile',
    desc: "Premier cabinet au Boulevard Anfa, avec une vision : des soins accessibles et d'excellence.",
  },
  {
    year: '2013',
    title: 'Spécialisation en implantologie',
    desc: "Formation avancée en implants dentaires à Paris, intégration des protocoles modernes.",
  },
  {
    year: '2019',
    title: 'Modernisation complète du cabinet',
    desc: "Acquisition d'un scanner 3D CBCT et d'équipements de dernière génération.",
  },
  {
    year: '2024',
    title: '+ de 5 000 patients accompagnés',
    desc: "Un cabinet de confiance ancré dans la vie du quartier Anfa à Casablanca.",
  },
];

const equipements = [
  {
    title: 'Scanner 3D CBCT',
    desc: "Imagerie volumétrique haute définition pour un diagnostic précis, indispensable en implantologie et chirurgie complexe.",
  },
  {
    title: 'Radiographie numérique',
    desc: "Images instantanées avec une irradiation minimale, visualisées et commentées avec vous en temps réel.",
  },
  {
    title: 'Laser dentaire',
    desc: "Traitement des gencives et décontamination sans douleur, pour une cicatrisation rapide et confortable.",
  },
  {
    title: 'Stérilisation classe B',
    desc: "Protocoles stricts, matériel stérilisé à l'autoclave certifié, traçabilité complète à chaque séance.",
  },
];

const formations = [
  {
    year: '2005',
    title: 'Doctorat en Médecine Dentaire',
    lieu: 'Université Hassan II, Casablanca — Mention Très Honorable',
  },
  {
    year: '2013',
    title: "Diplôme Universitaire d'Implantologie",
    lieu: 'Université Paris Diderot — Implants et chirurgie osseuse',
  },
  {
    year: '2018',
    title: 'Certification en dentisterie esthétique',
    lieu: 'Académie du Sourire, Barcelone — Facettes, blanchiment, composite',
  },
  {
    year: '2023',
    title: 'Membre actif — Association Marocaine de Dentisterie',
    lieu: 'Congrès annuels nationaux et internationaux',
  },
];

/* ══════════════════════════════════════
   COMPOSANT PRINCIPAL
══════════════════════════════════════ */
const About = () => {
  return (
    <div className="about-page">
      <section className="about-section">

        {/* ════════════════════════
            HEADER
        ════════════════════════ */}
        <div className="section-header">
          <div className="section-badge">À propos</div>
          <h1 className="section-title">
            Dr. Jalal Alami<br />
            <em>Bright Smile</em>
          </h1>
          <p className="section-subtitle">
            Chirurgien-dentiste à Casablanca, engagé depuis plus de 15 ans
            à offrir des soins dentaires d'excellence dans un cadre humain et moderne.
          </p>
        </div>

        {/* ════════════════════════
            PORTRAIT + BIO
        ════════════════════════ */}
        <div className="about-grid">
          <div className="about-image">
            <img
              src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800&q=80"
              alt="Dr. Jalal Alami — Cabinet Bright Smile Casablanca"
            />
          </div>
          <div className="about-text">
            <h2>Votre dentiste de confiance</h2>
            <p>
              Diplômé de la Faculté de Médecine Dentaire de Casablanca, le Dr. Jalal Alami
              a consacré sa carrière à une médecine dentaire rigoureuse et bienveillante.
              Son cabinet, Bright Smile, est le reflet de ses convictions : un espace où
              la technique la plus avancée se met au service du confort du patient.
            </p>

            <h2>Une philosophie du soin</h2>
            <p>
              Convaincu que la santé bucco-dentaire est un pilier du bien-être général,
              le Dr. Alami aborde chaque consultation avec écoute, transparence et précision.
              Aucune décision n'est prise sans votre accord éclairé.
            </p>

            <ul className="values-list">
              <li>Écoute sincère et temps dédié à chaque patient</li>
              <li>Gestes maîtrisés et protocoles rigoureux</li>
              <li>Devis détaillés, sans surprise ni pression</li>
              <li>Formation continue et veille internationale</li>
              <li>Éthique professionnelle irréprochable</li>
            </ul>
          </div>
        </div>

        {/* ════════════════════════
            PARCOURS / TIMELINE
        ════════════════════════ */}
        <div className="section-header">
          <div className="section-badge">Parcours</div>
          <h2 className="section-title">
            Son <em>histoire</em>
          </h2>
          <p className="section-subtitle">
            Un engagement constant envers l'excellence dentaire, depuis 2005.
          </p>
        </div>

        <div className="timeline-section">
          {timelineItems.map((item, i) => (
            <div className="timeline-item" key={i}>
              <div className="timeline-year">{item.year}</div>
              <div className="timeline-dot" />
              <div className="timeline-content">
                <h4 className="timeline-title">{item.title}</h4>
                <p className="timeline-desc">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ════════════════════════
            ÉQUIPEMENTS
        ════════════════════════ */}
        <div className="section-header" style={{ marginTop: '100px' }}>
          <div className="section-badge">Équipements</div>
          <h2 className="section-title">
            Un cabinet <em>de pointe</em>
          </h2>
          <p className="section-subtitle">
            Des technologies modernes au service de votre confort et de la précision des soins.
          </p>
        </div>

        <div className="equip-grid">
          {equipements.map((eq, i) => (
            <div className="equip-card" key={i}>
              <div className="equip-number">0{i + 1}</div>
              <h4 className="equip-title">{eq.title}</h4>
              <p className="equip-desc">{eq.desc}</p>
            </div>
          ))}
        </div>

        {/* ════════════════════════
            FORMATIONS
        ════════════════════════ */}
        <div className="section-header" style={{ marginTop: '100px' }}>
          <div className="section-badge">Certifications</div>
          <h2 className="section-title">
            Formations & <em>distinctions</em>
          </h2>
          <p className="section-subtitle">
            Un parcours académique et professionnel en constante évolution.
          </p>
        </div>

        <div className="formations-list">
          {formations.map((f, i) => (
            <div className="formation-item" key={i}>
              <div className="formation-year">{f.year}</div>
              <div className="formation-body">
                <div className="formation-icon"><IconAward /></div>
                <div>
                  <h4 className="formation-title">{f.title}</h4>
                  <p className="formation-lieu">{f.lieu}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ════════════════════════
            LOCALISATION
        ════════════════════════ */}
        <div className="location-section" style={{ marginTop: '100px' }}>
          <div className="section-header">
            <div className="section-badge">Nous Trouver</div>
            <h2 className="section-title">
              Notre <em>emplacement</em>
            </h2>
            <p className="section-subtitle">
              Un cabinet moderne au cœur de Casablanca, facilement accessible
            </p>
          </div>

          <div className="location-container">
            <div className="location-info">
              <h3>Informations pratiques</h3>

              <div className="info-item">
                <div className="info-icon"><IconMapPin /></div>
                <div className="info-content">
                  <h4>Adresse</h4>
                  <p>45 Boulevard Anfa<br />20100 Casablanca, Maroc</p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon"><IconPhone /></div>
                <div className="info-content">
                  <h4>Téléphone</h4>
                  <p>+212 5 22 00 11 22<br />+212 6 61 00 11 22</p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon"><IconMail /></div>
                <div className="info-content">
                  <h4>Email</h4>
                  <p>contact@bright-smile.ma</p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon"><IconClock /></div>
                <div className="info-content">
                  <h4>Horaires d'ouverture</h4>
                  <p>
                    Lundi – Vendredi :<br />9h00 – 13h00 / 15h00 – 19h00<br />
                    Samedi : 9h00 – 13h00<br />
                    Dimanche : Fermé
                  </p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon"><IconCar /></div>
                <div className="info-content">
                  <h4>Accès</h4>
                  <p>
                    Tram : Ligne T1 – Station Anfa<br />
                    Bus : Lignes 2, 15, 22<br />
                    Parking gratuit à 50m
                  </p>
                </div>
              </div>
            </div>

            <div className="map-embed">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3323.8!2d-7.633!3d33.589!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda7cd4786b417af%3A0xb0b6af6d81d7e16f!2sBoulevard+Anfa%2C+Casablanca!5e0!3m2!1sfr!2sma!4v1234567890"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Cabinet Bright Smile — Boulevard Anfa, Casablanca"
              />
            </div>
          </div>
        </div>

      </section>
    </div>
  );
};

export default About;
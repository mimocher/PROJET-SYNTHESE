// src/redux/patientReducer.js
import {
  PATIENT_UPDATE_PROFIL,
  RDV_PATIENT_CREATE,
  RDV_PATIENT_CANCEL,
  DOSSIER_PATIENT_LOAD,
  FACTURES_PATIENT_LOAD,
  ORDONNANCES_PATIENT_LOAD,
} from './patientTypes';

// ── Mock rendez-vous patient ──────────────────────────────────────────────────
const demain = new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0];
const passe1 = '2025-03-15';
const passe2 = '2025-01-20';

const MOCK_RDV = [
  { id: 1, date: demain, heure: '10:00', motif: 'Détartrage + bilan', statut: 'confirmed', dentiste: 'Dr. Benali' },
  { id: 2, date: demain, heure: '15:30', motif: 'Blanchiment séance 2', statut: 'pending', dentiste: 'Dr. Benali' },
  { id: 3, date: passe1, heure: '09:00', motif: 'Couronne provisoire', statut: 'done', dentiste: 'Dr. Benali' },
  { id: 4, date: passe2, heure: '14:00', motif: 'Radiographie panoramique', statut: 'done', dentiste: 'Dr. Benali' },
];

// ── Mock dossier médical ───────────────────────────────────────────────────────
const MOCK_DOSSIER = {
  groupe_sanguin: 'A+',
  allergies: 'Pénicilline',
  antecedents:
    'Chirurgie appendiculaire 2019. Non fumeuse. Pas de pathologie chronique connue.',
  consultations: [
    {
      id: 1,
      date: '15/03/2025',
      motif: 'Couronne provisoire',
      diagnostic: 'Fracture coronaire dent 16',
      notes: 'Empreinte prise, pose couronne définitive prévue.',
    },
    {
      id: 2,
      date: '20/01/2025',
      motif: 'Radiographie panoramique',
      diagnostic: 'Léger tartre, pas de carie',
      notes: 'Détartrage recommandé dans 6 mois.',
    },
  ],
  traitements: [
    {
      id: 1,
      intitule: 'Couronne céramique dent 16',
      statut: 'en_cours',
      seances: 3,
      seance_actuelle: 2,
      date_debut: '15/03/2025',
    },
    {
      id: 2,
      intitule: 'Détartrage semestriel',
      statut: 'planifie',
      seances: 1,
      seance_actuelle: 0,
      date_debut: null,
    },
  ],
};

// ── Mock factures ──────────────────────────────────────────────────────────────
const MOCK_FACTURES = [
  { id: 1, numero: 'FAC-0089', date: '15/03/2025', acte: 'Couronne céramique', montant: 3200, paye: 1600, statut: 'partial' },
  { id: 2, numero: 'FAC-0072', date: '20/01/2025', acte: 'Radiographie panoramique', montant: 150, paye: 150, statut: 'paid' },
  { id: 3, numero: 'FAC-0061', date: '10/09/2024', acte: 'Détartrage + polissage', montant: 450, paye: 450, statut: 'paid' },
];

// ── Mock ordonnances ───────────────────────────────────────────────────────────
const MOCK_ORDONNANCES = [
  {
    id: 1,
    numero: 'ORD-044',
    date: '15/03/2025',
    dentiste: 'Dr. Benali',
    medicaments:
      'Paracétamol 1g — 3x/jour pendant 5 jours\nIbuprofène 400mg — après repas si douleur\nChlorrhexidine 0.12% bain de bouche — 2x/jour',
  },
  {
    id: 2,
    numero: 'ORD-031',
    date: '20/01/2025',
    dentiste: 'Dr. Benali',
    medicaments:
      'Gel fluoré — application quotidienne le soir\nBain de bouche Eludril — 2x/jour 5 jours',
  },
];

const initialState = {
  profil: {
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    adresse: '',
  },
  rdvs: MOCK_RDV,
  creneaux: [],
  dossier: MOCK_DOSSIER,
  factures: MOCK_FACTURES,
  ordonnances: MOCK_ORDONNANCES,
};

const patientReducer = (state = initialState, action) => {
  switch (action.type) {
    case RDV_PATIENT_CREATE:
      return {
        ...state,
        rdvs: [action.payload, ...state.rdvs],
      };

    case RDV_PATIENT_CANCEL:
      return {
        ...state,
        rdvs: state.rdvs.map((r) =>
          r.id === action.payload ? { ...r, statut: 'cancelled' } : r
        ),
      };

    case PATIENT_UPDATE_PROFIL:
      return {
        ...state,
        profil: {
          ...state.profil,
          ...action.payload,
        },
      };

    case DOSSIER_PATIENT_LOAD:
      return {
        ...state,
        dossier: action.payload,
      };

    case FACTURES_PATIENT_LOAD:
      return {
        ...state,
        factures: action.payload,
      };

    case ORDONNANCES_PATIENT_LOAD:
      return {
        ...state,
        ordonnances: action.payload,
      };

    default:
      return state;
  }
};

export default patientReducer;
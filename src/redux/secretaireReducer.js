// src/redux/secretaireReducer.js
import {
  PATIENTS_LOAD_SUCCESS, PATIENT_ADD_SUCCESS,
  PATIENT_UPDATE_SUCCESS, PATIENT_DELETE_SUCCESS, PATIENT_SET_SEARCH,
  RDV_CREATE_SUCCESS, RDV_STATUS_SUCCESS, RDV_CANCEL_SUCCESS,
  FACTURE_CREATE_SUCCESS, FACTURE_SET_FILTRE,
} from './secretaireTypes';

const TODAY = new Date().toISOString().split('T')[0];

// ── Mock patients ─────────────────────────────────────────────────────────────
const MOCK_PATIENTS = [
  { id: 1, nom: 'Amina Tazi',       age: 28, ville: 'Casablanca', telephone: '+212 6 12 34 56 78', email: 'amina.tazi@gmail.com',   allergie: 'Pénicilline' },
  { id: 2, nom: 'Youssef El Fassi', age: 45, ville: 'Casablanca', telephone: '+212 6 98 76 54 32', email: 'y.elfassi@hotmail.com',   allergie: null },
  { id: 3, nom: 'Sara Chkouri',     age: 33, ville: 'Mohammedia', telephone: '+212 6 55 44 33 22', email: 'sara.chkouri@gmail.com',  allergie: null },
  { id: 4, nom: 'Karim Mansouri',   age: 52, ville: 'Casablanca', telephone: '+212 6 11 22 33 44', email: 'k.mansouri@yahoo.fr',     allergie: 'Aspirine' },
  { id: 5, nom: 'Nadia Berrada',    age: 38, ville: 'Casablanca', telephone: '+212 6 77 88 99 00', email: 'nadia.berrada@gmail.com', allergie: null },
];

// ── Mock RDV ──────────────────────────────────────────────────────────────────
const MOCK_RDV = [
  { id: 1, patient: 'Amina Tazi',       heure: '09:00', motif: 'Détartrage',          statut: 'done',      date: TODAY },
  { id: 2, patient: 'Youssef El Fassi', heure: '10:00', motif: 'Couronne provisoire', statut: 'confirmed', date: TODAY },
  { id: 3, patient: 'Sara Chkouri',     heure: '11:30', motif: 'Urgence douleur',     statut: 'urgent',    date: TODAY },
  { id: 4, patient: 'Karim Mansouri',   heure: '14:00', motif: 'Implant — suivi',     statut: 'pending',   date: TODAY },
  { id: 5, patient: 'Nadia Berrada',    heure: '15:30', motif: 'Blanchiment',         statut: 'pending',   date: TODAY },
];

// ── Mock factures ─────────────────────────────────────────────────────────────
const MOCK_FACTURES = [
  { id: 92, numero: 'FAC-0092', patient: 'Amina Tazi',       date: '01/04/2025', acte: 'Détartrage',  montant: 450,  statut: 'paid' },
  { id: 91, numero: 'FAC-0091', patient: 'Youssef El Fassi', date: '28/03/2025', acte: 'Couronne',    montant: 3200, statut: 'partial', paye: 1600 },
  { id: 90, numero: 'FAC-0090', patient: 'Karim Mansouri',   date: '25/03/2025', acte: 'Implant',     montant: 8500, statut: 'unpaid' },
  { id: 89, numero: 'FAC-0089', patient: 'Sara Chkouri',     date: '20/03/2025', acte: 'Obturation',  montant: 350,  statut: 'paid' },
  { id: 88, numero: 'FAC-0088', patient: 'Nadia Berrada',    date: '18/03/2025', acte: 'Blanchiment', montant: 2100, statut: 'partial', paye: 700 },
];

// ── Patients reducer ──────────────────────────────────────────────────────────
export const patientsReducer = (state = { liste: MOCK_PATIENTS, recherche: '' }, action) => {
  switch (action.type) {
    case PATIENTS_LOAD_SUCCESS:   return { ...state, liste: action.payload };
    case PATIENT_ADD_SUCCESS:     return { ...state, liste: [action.payload, ...state.liste] };
    case PATIENT_UPDATE_SUCCESS:  return { ...state, liste: state.liste.map(p => p.id === action.payload.id ? action.payload : p) };
    case PATIENT_DELETE_SUCCESS:  return { ...state, liste: state.liste.filter(p => p.id !== action.payload) };
    case PATIENT_SET_SEARCH:      return { ...state, recherche: action.payload };
    default: return state;
  }
};

// ── RDV reducer ───────────────────────────────────────────────────────────────
export const rdvReducer = (state = { liste: MOCK_RDV }, action) => {
  switch (action.type) {
    case RDV_CREATE_SUCCESS: return { ...state, liste: [...state.liste, action.payload] };
    case RDV_STATUS_SUCCESS: return { ...state, liste: state.liste.map(r => r.id === action.payload.id ? { ...r, statut: action.payload.statut } : r) };
    case RDV_CANCEL_SUCCESS: return { ...state, liste: state.liste.filter(r => r.id !== action.payload) };
    default: return state;
  }
};

// ── Factures reducer ──────────────────────────────────────────────────────────
export const facturesReducer = (state = { liste: MOCK_FACTURES, filtreStatut: 'all' }, action) => {
  switch (action.type) {
    case FACTURE_CREATE_SUCCESS: return { ...state, liste: [action.payload, ...state.liste] };
    case FACTURE_SET_FILTRE:     return { ...state, filtreStatut: action.payload };
    default: return state;
  }
};
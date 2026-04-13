import { createStore, combineReducers } from 'redux';

// ── Existants ─────────────────────────────────────────────────────────────────
import authReducer from './authReducer';
import cartReducer from './cartReducer';
import invoiceReducer from './invoiceReducer';

// ── Secrétaire ────────────────────────────────────────────────────────────────
import { patientsReducer, rdvReducer, facturesReducer } from './secretaireReducer';

// ── Dentiste ──────────────────────────────────────────────────────────────────
import {
  planningReducer,
  dossiersReducer,
  traitementsReducer,
  ordonnancesReducer,
  statsReducer,
} from './dentisteReducer';

// ── Patient ───────────────────────────────────────────────────────────────────
import patientReducer from './patientReducer';

const rootReducer = combineReducers({
  // existants
  auth: authReducer,
  cart: cartReducer,
  invoices: invoiceReducer,

  // secrétaire
  patients: patientsReducer,
  rdv: rdvReducer,
  factures: facturesReducer,

  // dentiste
  planning: planningReducer,
  dossiers: dossiersReducer,
  traitements: traitementsReducer,
  ordonnances: ordonnancesReducer,
  stats: statsReducer,

  // patient
  patient: patientReducer,
});

const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
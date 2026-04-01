// // src/redux/store.js
// import { createStore, combineReducers } from 'redux';
// import authReducer from './authReducer';
// import cartReducer from './cartReducer';
// import invoiceReducer from './invoiceReducer';

// const rootReducer = combineReducers({
//   auth: authReducer,
//   cart: cartReducer,
//   invoices: invoiceReducer
// });

// const store = createStore(
//   rootReducer,
//   window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
// );

// export default store;
// src/redux/store.js
import { createStore, combineReducers } from 'redux';

// ── Tes reducers existants (inchangés) ───────────────────────────────────────
import authReducer    from './authReducer';
import cartReducer    from './cartReducer';
import invoiceReducer from './invoiceReducer';

// ── Nouveaux reducers secrétaire ──────────────────────────────────────────────
import {
  patientsReducer,
  rdvReducer,
  facturesReducer,
} from './secretaireReducer';

const rootReducer = combineReducers({
  auth:     authReducer,
  cart:     cartReducer,
  invoices: invoiceReducer,
  patients: patientsReducer,
  rdv:      rdvReducer,
  factures: facturesReducer,
});

const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
// // src/redux/patientActions.js
// import {
//   PATIENT_UPDATE_PROFIL,
//   RDV_PATIENT_CREATE,
//   RDV_PATIENT_CANCEL,
// } from './patientTypes';
// import { UPDATE_USER } from './authTypes'; // action existante dans ton projet

// // ── Profil ────────────────────────────────────────────────────────────────────
// export const updateProfil = (userData) => (dispatch) => {
//   // Met à jour dans Redux auth + patient
//   dispatch({ type: UPDATE_USER,         payload: userData });
//   dispatch({ type: PATIENT_UPDATE_PROFIL, payload: userData });
//   // En prod : await axios.put('/api/auth/profile', userData)
// };

// export const resetPassword = (email) => () => {
//   // En prod : await axios.post('/api/auth/forgot-password', { email })
//   console.log('Reset password pour :', email);
//   return { success: true };
// };

// // ── Rendez-vous ───────────────────────────────────────────────────────────────
// export const createRdvPatient = (rdvData) => (dispatch) => {
//   dispatch({
//     type: RDV_PATIENT_CREATE,
//     payload: {
//       ...rdvData,
//       id:     Date.now(),
//       statut: 'pending',
//       date_creation: new Date().toISOString(),
//     },
//   });
// };

// // Règle métier : annulation possible seulement 24h avant le RDV
// export const cancelRdvPatient = (rdv) => (dispatch) => {
//   const heureRdv   = new Date(`${rdv.date}T${rdv.heure}:00`);
//   const maintenant = new Date();
//   const diffHeures = (heureRdv - maintenant) / (1000 * 60 * 60);

//   if (diffHeures < 24) {
//     return {
//       success: false,
//       message: "Impossible d'annuler moins de 24h avant le rendez-vous.",
//     };
//   }

//   dispatch({ type: RDV_PATIENT_CANCEL, payload: rdv.id });
//   return { success: true };
// };
// src/redux/patientActions.js
import {
  PATIENT_UPDATE_PROFIL,
  PATIENT_RESET_PASSWORD,
  RDV_PATIENT_CREATE,
  RDV_PATIENT_CANCEL,
} from './patientTypes';

// ── Profil ────────────────────────────────────────────────────────────────────
export const updateProfil = (userData) => ({
  type: PATIENT_UPDATE_PROFIL,
  payload: userData,
});

export const resetPassword = (email) => ({
  type: PATIENT_RESET_PASSWORD,
  payload: email,
});

// ── Rendez-vous ───────────────────────────────────────────────────────────────
export const createRdvPatient = (rdvData) => ({
  type: RDV_PATIENT_CREATE,
  payload: {
    ...rdvData,
    id: Date.now(),
    statut: 'pending',
    date_creation: new Date().toISOString(),
  },
});

export const cancelRdvPatient = (rdvId) => ({
  type: RDV_PATIENT_CANCEL,
  payload: rdvId,
});

// ── Helper métier simple (pas Redux) ─────────────────────────────────────────
export const verifierAnnulationRdv = (rdv) => {
  const heureRdv = new Date(`${rdv.date}T${rdv.heure}:00`);
  const maintenant = new Date();
  const diffHeures = (heureRdv - maintenant) / (1000 * 60 * 60);

  if (diffHeures < 24) {
    return {
      success: false,
      message: "Impossible d'annuler moins de 24h avant le rendez-vous.",
    };
  }

  return { success: true };
};
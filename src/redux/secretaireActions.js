// src/redux/secretaireActions.js
import {
  PATIENT_ADD_SUCCESS, PATIENT_UPDATE_SUCCESS,
  PATIENT_DELETE_SUCCESS, PATIENT_SET_SEARCH,
  RDV_CREATE_SUCCESS, RDV_STATUS_SUCCESS, RDV_CANCEL_SUCCESS,
  FACTURE_CREATE_SUCCESS, FACTURE_SET_FILTRE,
} from './secretaireTypes';

// ── Patients ──────────────────────────────────────────────────────────────────
export const addPatient    = (p)      => ({ type: PATIENT_ADD_SUCCESS,    payload: { ...p, id: Date.now() } });
export const updatePatient = (id, p)  => ({ type: PATIENT_UPDATE_SUCCESS, payload: { ...p, id } });
export const deletePatient = (id)     => ({ type: PATIENT_DELETE_SUCCESS, payload: id });
export const setSearch     = (q)      => ({ type: PATIENT_SET_SEARCH,     payload: q });

// ── Rendez-vous ───────────────────────────────────────────────────────────────
export const createRdv       = (rdv)        => ({ type: RDV_CREATE_SUCCESS, payload: { ...rdv, id: Date.now() } });
export const changeRdvStatus = (id, statut) => ({ type: RDV_STATUS_SUCCESS, payload: { id, statut } });
export const cancelRdv       = (id)         => ({ type: RDV_CANCEL_SUCCESS, payload: id });

// ── Factures ──────────────────────────────────────────────────────────────────
export const createFacture    = (f) => ({ type: FACTURE_CREATE_SUCCESS, payload: { ...f, id: Date.now() } });
export const setFactureFiltre = (s) => ({ type: FACTURE_SET_FILTRE,     payload: s });
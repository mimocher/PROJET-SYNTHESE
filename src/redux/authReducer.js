// // src/redux/authReducer.js
// import { LOGIN, LOGOUT, REGISTER, UPDATE_USER } from './authTypes';

// const initialState = {
//   user: null,
//   isAuthenticated: false,
//   error: null
// };

// const authReducer = (state = initialState, action) => {
//   switch (action.type) {
//     case LOGIN:
//     case REGISTER:
//       return {
//         ...state,
//         user: action.payload,
//         isAuthenticated: true,
//         error: null
//       };

//     case LOGOUT:
//       return {
//         ...state,
//         user: null,
//         isAuthenticated: false,
//         error: null
//       };

//     case UPDATE_USER:
//       return {
//         ...state,
//         user: { ...state.user, ...action.payload }
//       };

//     case 'LOGIN_FAILED':
//     case 'REGISTER_FAILED':
//       return {
//         ...state,
//         error: action.payload.error,
//         isAuthenticated: false
//       };

//     case 'NO_SESSION':
//       return state;

//     default:
//       return state;
//   }
// };

// export default authReducer;
// src/redux/authReducer.js
// ✅ Version mise à jour — ajoute la gestion de la mise à jour de profil
import { LOGIN, LOGOUT, REGISTER, UPDATE_USER } from './authTypes';
import { PATIENT_UPDATE_PROFIL  } from './patientTypes';

const userFromStorage = localStorage.getItem('user')
  ? JSON.parse(localStorage.getItem('user'))
  : null;

const initialState = {
  user:            userFromStorage,
  isAuthenticated: !!userFromStorage,
  error:           null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {

    case LOGIN:
    case REGISTER:
      return {
        ...state,
        user:            action.payload,
        isAuthenticated: true,
        error:           null,
      };

    case LOGOUT:
      return {
        ...state,
        user:            null,
        isAuthenticated: false,
        error:           null,
      };

    case UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };

    // ✅ Nouveau : mise à jour profil depuis l'espace patient
    case PATIENT_UPDATE_PROFIL :
      return {
        ...state,
        user: action.payload,
      };

    case 'LOGIN_FAILED':
    case 'REGISTER_FAILED':
      return {
        ...state,
        error: action.payload?.error || 'Erreur inconnue',
      };

    case 'NO_SESSION':
      return state;

    default:
      return state;
  }
};

export default authReducer;

// // // src/redux/authActions.js
// // import { LOGIN, LOGOUT, REGISTER, UPDATE_USER } from './authTypes';
// // import { authenticateUser, createUser } from '../utils/database';

// // export const login = (email, password) => {
// //   const user = authenticateUser(email, password);
  
// //   if (user) {
// //     // Sauvegarder dans localStorage
// //     localStorage.setItem('user', JSON.stringify(user));
    
// //     return {
// //       type: LOGIN,
// //       payload: user
// //     };
// //   }
  
// //   return {
// //     type: 'LOGIN_FAILED',
// //     payload: { error: 'Email ou mot de passe incorrect' }
// //   };
// // };

// // export const logout = () => {
// //   localStorage.removeItem('user');
  
// //   return {
// //     type: LOGOUT
// //   };
// // };

// // export const register = (userData) => {
// //   const result = createUser(userData);
  
// //   if (result.error) {
// //     return {
// //       type: 'REGISTER_FAILED',
// //       payload: result
// //     };
// //   }
  
// //   // Sauvegarder dans localStorage
// //   localStorage.setItem('user', JSON.stringify(result));
  
// //   return {
// //     type: REGISTER,
// //     payload: result
// //   };
// // };

// // export const updateUser = (userData) => {
// //   return {
// //     type: UPDATE_USER,
// //     payload: userData
// //   };
// // };

// // // Action pour restaurer la session depuis localStorage
// // export const restoreSession = () => {
// //   const user = localStorage.getItem('user');
  
// //   if (user) {
// //     return {
// //       type: LOGIN,
// //       payload: JSON.parse(user)
// //     };
// //   }
  
// //   return {
// //     type: 'NO_SESSION'
// //   };
// // };
// // src/redux/authActions.js
// import { LOGIN, LOGOUT, REGISTER, UPDATE_USER } from './authTypes';
// import { authenticateUser, createUser } from '../utils/database';

// // Redirection automatique selon le rôle après login
// const redirectByRole = (role) => {
//   switch (role) {
//     case 'dentiste':   window.location.href = '/dentiste';   break;
//     case 'secretaire': window.location.href = '/secretaire'; break;
//     case 'admin':      window.location.href = '/secretaire'; break;
//     case 'patient':    window.location.href = '/patient';    break;
//     default:           window.location.href = '/';
//   }
// };

// export const login = (email, password) => (dispatch) => {
//   const user = authenticateUser(email, password);

//   if (user) {
//     localStorage.setItem('user', JSON.stringify(user));
//     dispatch({ type: LOGIN, payload: user });
//     redirectByRole(user.role);
//   } else {
//     dispatch({
//       type: 'LOGIN_FAILED',
//       payload: { error: 'Email ou mot de passe incorrect' },
//     });
//   }
// };

// export const logout = () => (dispatch) => {
//   localStorage.removeItem('user');
//   dispatch({ type: LOGOUT });
//   window.location.href = '/login';
// };

// export const register = (userData) => (dispatch) => {
//   const result = createUser(userData);

//   if (result.error) {
//     return dispatch({ type: 'REGISTER_FAILED', payload: result });
//   }

//   localStorage.setItem('user', JSON.stringify(result));
//   dispatch({ type: REGISTER, payload: result });
//   window.location.href = '/patient';
// };

// export const updateUser = (userData) => ({
//   type: UPDATE_USER,
//   payload: userData,
// });

// export const restoreSession = () => {
//   const user = localStorage.getItem('user');
//   if (user) {
//     return { type: LOGIN, payload: JSON.parse(user) };
//   }
//   return { type: 'NO_SESSION' };
// };
// src/redux/authActions.js
import { LOGIN, LOGOUT, REGISTER, UPDATE_USER } from './authTypes';
import { authenticateUser, createUser } from '../utils/database';

export const login = (email, password) => {
  const user = authenticateUser(email, password);

  if (user) {
    localStorage.setItem('user', JSON.stringify(user));

    return {
      type: LOGIN,
      payload: user,
    };
  }

  return {
    type: 'LOGIN_FAILED',
    payload: { error: 'Email ou mot de passe incorrect' },
  };
};

export const logout = () => {
  localStorage.removeItem('user');

  return {
    type: LOGOUT,
  };
};

export const register = (userData) => {
  const result = createUser(userData);

  if (result.error) {
    return {
      type: 'REGISTER_FAILED',
      payload: result,
    };
  }

  localStorage.setItem('user', JSON.stringify(result));

  return {
    type: REGISTER,
    payload: result,
  };
};

export const updateUser = (userData) => ({
  type: UPDATE_USER,
  payload: userData,
});

export const restoreSession = () => {
  const user = localStorage.getItem('user');

  if (user) {
    return {
      type: LOGIN,
      payload: JSON.parse(user),
    };
  }

  return {
    type: 'NO_SESSION',
  };
};
// src/redux/authActions.js
import { LOGIN, LOGOUT, REGISTER, UPDATE_USER } from './authTypes';
import { authenticateUser, createUser } from '../utils/database';

export const login = (email, password) => {
  const user = authenticateUser(email, password);
  
  if (user) {
    // Sauvegarder dans localStorage
    localStorage.setItem('user', JSON.stringify(user));
    
    return {
      type: LOGIN,
      payload: user
    };
  }
  
  return {
    type: 'LOGIN_FAILED',
    payload: { error: 'Email ou mot de passe incorrect' }
  };
};

export const logout = () => {
  localStorage.removeItem('user');
  
  return {
    type: LOGOUT
  };
};

export const register = (userData) => {
  const result = createUser(userData);
  
  if (result.error) {
    return {
      type: 'REGISTER_FAILED',
      payload: result
    };
  }
  
  // Sauvegarder dans localStorage
  localStorage.setItem('user', JSON.stringify(result));
  
  return {
    type: REGISTER,
    payload: result
  };
};

export const updateUser = (userData) => {
  return {
    type: UPDATE_USER,
    payload: userData
  };
};

// Action pour restaurer la session depuis localStorage
export const restoreSession = () => {
  const user = localStorage.getItem('user');
  
  if (user) {
    return {
      type: LOGIN,
      payload: JSON.parse(user)
    };
  }
  
  return {
    type: 'NO_SESSION'
  };
};

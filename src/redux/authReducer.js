// src/redux/authReducer.js
import { LOGIN, LOGOUT, REGISTER, UPDATE_USER } from './authTypes';

const initialState = {
  user: null,
  isAuthenticated: false,
  error: null
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN:
    case REGISTER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        error: null
      };

    case LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        error: null
      };

    case UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      };

    case 'LOGIN_FAILED':
    case 'REGISTER_FAILED':
      return {
        ...state,
        error: action.payload.error,
        isAuthenticated: false
      };

    case 'NO_SESSION':
      return state;

    default:
      return state;
  }
};

export default authReducer;

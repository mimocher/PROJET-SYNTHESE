// import React from 'react';
// import { useSelector } from 'react-redux';
// import { Navigate } from 'react-router-dom';

// const PrivateRoute = ({ children, allowedRoles }) => {
//   const { isAuthenticated, user } = useSelector(state => state.auth);

//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace />;
//   }

//   if (allowedRoles && !allowedRoles.includes(user.role)) {
//     // Redirige vers le bon espace selon le rôle
//     if (user.role === 'dentiste')   return <Navigate to="/dentiste" replace />;
//     if (user.role === 'secretaire') return <Navigate to="/secretaire" replace />;
//     if (user.role === 'patient')    return <Navigate to="/" replace />;
//     return <Navigate to="/" replace />;
//   }

//   return children;
// };

// export default PrivateRoute;
// src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// allowedRoles : ['patient'] | ['dentiste'] | ['secretaire'] | non fourni = tout rôle connecté
export default function PrivateRoute({ children, allowedRoles }) {
  const user = useSelector(s => s.auth?.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirige vers son propre espace selon son rôle
    const redirect = user.role === 'dentiste' ? '/dentiste'
                   : user.role === 'secretaire' ? '/secretaire'
                   : '/patient';
    return <Navigate to={redirect} replace />;
  }

  return children;
}

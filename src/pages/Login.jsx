import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../redux/authActions';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error } = useSelector(state => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    const action = dispatch(login(email, password));
    if (action.type === 'LOGIN') {
      navigate('/');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <div className="section-badge">Espace Patient</div>
          <h2>Connexion</h2>
          <p>Accédez à votre espace personnel</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-full">
            Se connecter
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Pas encore de compte ?{' '}
            <Link to="/register">S'inscrire</Link>
          </p>
        </div>

        <div className="demo-accounts">
          <p className="demo-title">Comptes de test :</p>
          <div className="demo-account">
            <strong>Patient :</strong> jean@test.com / password123
          </div>
          <div className="demo-account">
            <strong>Admin :</strong> admin@cabinet.com / admin123
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

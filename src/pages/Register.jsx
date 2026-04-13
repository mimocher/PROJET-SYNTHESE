import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { register } from '../redux/authActions';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const action = dispatch(register(formData));
    
    if (action.type === 'REGISTER') {
      alert('Compte créé avec succès !');
      navigate('/');
    } else if (action.payload?.error) {
      alert(action.payload.error);
    }
  };

  return (
    /*
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h2>Inscription</h2>
          <p>Créez votre compte patient</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Nom complet</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Jean Dupont"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="jean@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label>Téléphone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+33 6 12 34 56 78"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Mot de passe</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-full">
            Créer mon compte
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Déjà inscrit ?{' '}
            <Link to="/login">Se connecter</Link>
          </p>
        </div>
      </div>
    </div>*/
    <div className="auth-page">
  <div className="auth-container single">

    <div className="auth-content">

      <div className="auth-header">
        <h2>Inscription</h2>
        <p>Créez votre compte patient</p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">

        <div className="form-group">
          <label>Nom complet</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Jean Dupont"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="jean@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Téléphone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+33 6 12 34 56 78"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Mot de passe</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
          />
        </div>

        <button type="submit" className="btn btn-primary btn-full">
          Créer mon compte
        </button>

      </form>

      <div className="auth-footer">
        <p>
          Déjà inscrit ?{' '}
          <Link to="/login">Se connecter</Link>
        </p>
      </div>

    </div>
  </div>
</div>
  );
};

export default Register;
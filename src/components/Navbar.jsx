import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/authActions';
import '../styles/Navbar.css';

const Navbar = () => {
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const cartItems = useSelector(state => state.cart.items);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  const toggleCart = () => {
    const cartSidebar = document.getElementById('cartSidebar');
    if (cartSidebar) {
      cartSidebar.classList.toggle('active');
    }
  };

  return (
    <nav className="navbar" id="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          Sourire Excellence
        </Link>
        
        <div className="nav-menu">
          <Link to="/" className="nav-link">Accueil</Link>
          <Link to="/about" className="nav-link">À propos</Link>
          <Link to="/services" className="nav-link">Services</Link>
          <Link to="/reservations" className="nav-link">Mes Réservations</Link>
          
          <div className="cart-icon" onClick={toggleCart}>
            🛒
            {cartItems.length > 0 && (
              <span className="cart-badge">{cartItems.length}</span>
            )}
          </div>

          {isAuthenticated ? (
            <div className="nav-auth">
              <span className="user-name">Bonjour, {user?.name}</span>
              <button onClick={handleLogout} className="btn-nav">
                Déconnexion
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn-nav">
              Connexion
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

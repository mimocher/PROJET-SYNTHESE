import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity, clearCart } from '../redux/cartActions';
import { createInvoiceAction } from '../redux/invoiceActions';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from '../utils/billing';
import '../styles/CartSidebar.css';

const CartSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { items, subtotal, tax, total } = useSelector(state => state.cart);
  const { isAuthenticated, user } = useSelector(state => state.auth);

  const toggleCart = () => {
    const cartSidebar = document.getElementById('cartSidebar');
    if (cartSidebar) {
      cartSidebar.classList.toggle('active');
    }
  };

  const handleRemove = (serviceId) => {
    dispatch(removeFromCart(serviceId));
  };

  const handleQuantityChange = (serviceId, newQuantity) => {
    if (newQuantity >= 1) {
      dispatch(updateQuantity(serviceId, newQuantity));
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      alert('Veuillez vous connecter pour valider la réservation');
      navigate('/login');
      return;
    }

    if (items.length === 0) {
      alert('Votre panier est vide');
      return;
    }

    // Créer la facture
    dispatch(createInvoiceAction(user, items, 0));
    
    // Vider le panier
    dispatch(clearCart());
    
    // Fermer le panier
    toggleCart();
    
    // Message de confirmation
    alert('Réservation confirmée ! Consultez vos réservations.');
    
    // Rediriger vers les réservations
    navigate('/reservations');
  };

  return (
    <div className="cart-sidebar" id="cartSidebar">
      <div className="cart-header">
        <h2>Panier</h2>
        <button className="cart-close" onClick={toggleCart}>×</button>
      </div>

      <div className="cart-items">
        {items.length === 0 ? (
          <div className="cart-empty">
            <div className="cart-empty-icon">🛒</div>
            <p>Votre panier est vide</p>
          </div>
        ) : (
          items.map(item => (
            <div key={item.id} className="cart-item">
              <div className="cart-item-info">
                <h4>{item.name}</h4>
                <p className="cart-item-description">{item.description}</p>
                <div className="cart-item-meta">
                  <span>⏱️ {item.duration}</span>
                  <span className="cart-item-price">{formatPrice(item.price)}</span>
                </div>
                
                <div className="cart-item-quantity">
                  <button 
                    className="qty-btn"
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                  >
                    -
                  </button>
                  <span className="qty-value">{item.quantity}</span>
                  <button 
                    className="qty-btn"
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
              
              <button 
                className="cart-item-remove" 
                onClick={() => handleRemove(item.id)}
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>

      {items.length > 0 && (
        <div className="cart-footer">
          <div className="cart-totals">
            <div className="cart-subtotal">
              <span>Sous-total HT:</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="cart-tax">
              <span>TVA (20%):</span>
              <span>{formatPrice(tax)}</span>
            </div>
            <div className="cart-total">
              <span className="cart-total-label">Total TTC:</span>
              <span className="cart-total-amount">{formatPrice(total)}</span>
            </div>
          </div>
          
          <button 
            className="btn btn-primary btn-checkout" 
            onClick={handleCheckout}
          >
            Valider la réservation
          </button>
        </div>
      )}
    </div>
  );
};

export default CartSidebar;
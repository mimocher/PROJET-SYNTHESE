import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/cartActions';
import { useNavigate } from 'react-router-dom';
import { SERVICES_DB } from '../utils/database';
import '../styles/Services.css';

const Services = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector(state => state.auth);
  const [selectedService, setSelectedService] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleViewDetails = (service) => {
    setSelectedService(service);
    setQuantity(1);
    setShowModal(true);
  };

  const handleAddToCart = (service, qty = 1) => {
    if (!isAuthenticated) {
      alert('Veuillez vous connecter pour ajouter au panier');
      navigate('/login');
      return;
    }

    dispatch(addToCart({ ...service, quantity: qty }));
    alert(`${service.name} ajouté au panier !`);
    setShowModal(false);
  };

  return (
    <div className="services-page">
      <section className="services-section">
        <div className="section-header">
          <div className="section-badge">Nos Services</div>
          <h2 className="section-title">Soins dentaires complets</h2>
          <p className="section-subtitle">
            Des solutions sur mesure adaptées à tous vos besoins dentaires
          </p>
        </div>

        <div className="services-grid-new">
          {SERVICES_DB.map(service => (
            <div key={service.id} className="service-card-new">
              <div className="service-category-badge">{service.category}</div>
              
              <h3 className="service-title-new">{service.name}</h3>
              <p className="service-description-new">{service.description}</p>

              <div className="service-info-row">
                <div className="service-info-item">
                  <span className="info-icon">⏱️</span>
                  <span className="info-text">{service.duration}</span>
                </div>
                {service.details?.included && (
                  <div className="service-info-item">
                    <span className="info-icon">📋</span>
                    <span className="info-text">{service.details.included.length} inclus</span>
                  </div>
                )}
              </div>

              <div className="service-footer-new">
                <div className="service-price-box">
                  <span className="price-label">À PARTIR DE</span>
                  <span className="price-value">{service.price} DH</span>
                </div>
                <div className="service-actions">
                  <button 
                    className="btn-outline"
                    onClick={() => handleViewDetails(service)}
                  >
                    Voir détails
                  </button>
                  <button 
                    className="btn-primary-green"
                    onClick={() => handleAddToCart(service)}
                  >
                    + Ajouter
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modal Détails */}
      {showModal && selectedService && (
        <div className="modal-overlay active" onClick={() => setShowModal(false)}>
          <div className="modal-detail-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            
            <div className="modal-detail-layout">
              <div className="modal-detail-left">
                <div className="treatment-image">
                  <div className="treatment-badge">{selectedService.category}</div>
                  <div className="treatment-icon-large">{selectedService.icon}</div>
                </div>

                {selectedService.details?.included && (
                  <div className="treatment-advantages">
                    <h3>Avantages du traitement</h3>
                    <ul>
                      {selectedService.details.included.map((item, index) => (
                        <li key={index}>
                          <span className="check-icon">✓</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="modal-detail-right">
                <div className="treatment-header-price">
                  <div className="category-badge-small">{selectedService.category}</div>
                  <div className="price-large">
                    <span className="price-label-small">À partir de</span>
                    <span className="price-amount">{selectedService.price} DH</span>
                  </div>
                </div>

                <h2 className="treatment-title">{selectedService.name}</h2>

                <div className="treatment-stats">
                  <div className="stat-card">
                    <div className="stat-icon">⏱️</div>
                    <div className="stat-info">
                      <span className="stat-label">Durée</span>
                      <span className="stat-value">{selectedService.duration}</span>
                    </div>
                  </div>
                  {selectedService.details?.included && (
                    <div className="stat-card">
                      <div className="stat-icon">📊</div>
                      <div className="stat-info">
                        <span className="stat-label">Séances</span>
                        <span className="stat-value">{selectedService.details.included.length}</span>
                      </div>
                    </div>
                  )}
                  <div className="stat-card">
                    <div className="stat-icon">⭐</div>
                    <div className="stat-info">
                      <span className="stat-label">Satisfaction</span>
                      <span className="stat-value">98%</span>
                    </div>
                  </div>
                </div>

                <div className="treatment-description-box">
                  <h3>Description du traitement</h3>
                  <p>{selectedService.description}</p>
                </div>

                <div className="treatment-details-grid-compact">
                  <div className="detail-row">
                    <span className="detail-label">Type de traitement</span>
                    <span className="detail-value">{selectedService.category}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Durée par séance</span>
                    <span className="detail-value">{selectedService.duration}</span>
                  </div>
                  {selectedService.details?.procedure && (
                    <>
                      <div className="detail-row">
                        <span className="detail-label">Nombre de séances</span>
                        <span className="detail-value">{selectedService.details.included?.length || 1} recommandées</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Prix total</span>
                        <span className="detail-value highlight">{selectedService.price} DH</span>
                      </div>
                    </>
                  )}
                </div>

                <div className="quantity-selector">
                  <span className="quantity-label">Quantité</span>
                  <div className="quantity-controls">
                    <button 
                      className="qty-btn"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      −
                    </button>
                    <span className="qty-value">{quantity}</span>
                    <button 
                      className="qty-btn"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  <div className="total-price">
                    <span>Total:</span>
                    <span className="total-amount">{(selectedService.price * quantity).toFixed(2)} DH</span>
                  </div>
                </div>

                <div className="modal-actions">
                  <button 
                    className="btn-reserve"
                    onClick={() => handleAddToCart(selectedService, quantity)}
                  >
                    Réserver maintenant
                  </button>
                  <button 
                    className="btn-add-cart"
                    onClick={() => handleAddToCart(selectedService, quantity)}
                  >
                    Ajouter au panier
                  </button>
                </div>

                <div className="contact-box">
                  <p>Des questions sur ce traitement ?</p>
                  <button className="btn-contact">Contactez-nous</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;
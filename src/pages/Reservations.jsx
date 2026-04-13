import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from '../utils/billing';
import '../styles/Reservations.css';

const Reservations = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector(state => state.auth);
  const { invoices } = useSelector(state => state.invoices);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showModal, setShowModal] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="reservations-page">
        <div className="auth-required">
          <h2>Connexion requise</h2>
          <p>Veuillez vous connecter pour voir vos réservations</p>
          <button className="btn btn-primary" onClick={() => navigate('/login')}>
            Se connecter
          </button>
        </div>
      </div>
    );
  }

  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setShowModal(true);
  };

  const getStatusLabel = (status) => {
    const labels = {
      'pending': 'En attente',
      'paid': 'Payé',
      'cancelled': 'Annulé'
    };
    return labels[status] || status;
  };

  return (
    <div className="reservations-page">
      <div className="section-header">
        <div className="section-badge">Mes Rendez-vous</div>
        <h2 className="section-title">Mes réservations</h2>
        <p className="section-subtitle">
          Consultez et gérez vos rendez-vous à venir
        </p>
      </div>

      <div className="reservations-container">
        {invoices.length === 0 ? (
          <div className="no-reservations">
            <div className="no-reservations-icon">📅</div>
            <h3>Aucune réservation</h3>
            <p>Vous n'avez pas encore de réservation</p>
            <button className="btn btn-primary" onClick={() => navigate('/services')}>
              Réserver un service
            </button>
          </div>
        ) : (
          <div className="reservations-grid">
            {invoices.map(invoice => (
              <div key={invoice.invoiceNumber} className="reservation-card">
                <div className="reservation-header">
                  <h3>Facture {invoice.invoiceNumber}</h3>
                  <span className={`status status-${invoice.status}`}>
                    {getStatusLabel(invoice.status)}
                  </span>
                </div>

                <div className="reservation-body">
                  <div className="reservation-info">
                    <div className="info-row">
                      <span className="info-label">📅 Date:</span>
                      <span>{new Date(invoice.date).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">👤 Patient:</span>
                      <span>{invoice.user.name}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">📋 Services:</span>
                      <span>{invoice.items.length} service(s)</span>
                    </div>
                  </div>

                  <div className="reservation-services">
                    <h4>Services réservés:</h4>
                    <ul>
                      {invoice.items.map((item, index) => (
                        <li key={index}>
                          {item.name} × {item.quantity} - {formatPrice(item.subtotal)}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="reservation-total">
                    <div className="total-row">
                      <span>Sous-total HT:</span>
                      <span>{formatPrice(invoice.subtotal)}</span>
                    </div>
                    <div className="total-row">
                      <span>TVA (20%):</span>
                      <span>{formatPrice(invoice.tax)}</span>
                    </div>
                    {invoice.discount > 0 && (
                      <div className="total-row discount">
                        <span>Remise ({invoice.discountPercent}%):</span>
                        <span>-{formatPrice(invoice.discount)}</span>
                      </div>
                    )}
                    <div className="total-row total-final">
                      <strong>Total TTC:</strong>
                      <strong>{formatPrice(invoice.total)}</strong>
                    </div>
                  </div>
                </div>

                <div className="reservation-actions">
                  <button 
                    className="btn btn-secondary btn-small"
                    onClick={() => handleViewInvoice(invoice)}
                  >
                    Voir la facture
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Facture */}
      {showModal && selectedInvoice && (
        <div className="modal active" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            <h2>Facture Détaillée</h2>
            
            <div className="invoice-details">
              <div className="invoice-item">
                <span className="invoice-label">N° de facture</span>
                <span className="invoice-value">{selectedInvoice.invoiceNumber}</span>
              </div>
              <div className="invoice-item">
                <span className="invoice-label">Date</span>
                <span className="invoice-value">
                  {new Date(selectedInvoice.date).toLocaleDateString('fr-FR')}
                </span>
              </div>
              <div className="invoice-item">
                <span className="invoice-label">Patient</span>
                <span className="invoice-value">{selectedInvoice.user.name}</span>
              </div>
              <div className="invoice-item">
                <span className="invoice-label">Email</span>
                <span className="invoice-value">{selectedInvoice.user.email}</span>
              </div>
              <div className="invoice-item">
                <span className="invoice-label">Téléphone</span>
                <span className="invoice-value">{selectedInvoice.user.phone}</span>
              </div>
              
              <div className="invoice-separator"></div>
              
              <div className="invoice-item">
                <span className="invoice-label">Sous-total HT</span>
                <span className="invoice-value">{formatPrice(selectedInvoice.subtotal)}</span>
              </div>
              <div className="invoice-item">
                <span className="invoice-label">TVA (20%)</span>
                <span className="invoice-value">{formatPrice(selectedInvoice.tax)}</span>
              </div>
              {selectedInvoice.discount > 0 && (
                <div className="invoice-item">
                  <span className="invoice-label">Remise</span>
                  <span className="invoice-value">-{formatPrice(selectedInvoice.discount)}</span>
                </div>
              )}
              <div className="invoice-item invoice-total">
                <span className="invoice-label">Total TTC</span>
                <span className="invoice-value">{formatPrice(selectedInvoice.total)}</span>
              </div>
            </div>

            <button 
              className="btn btn-primary" 
              style={{ width: '100%' }}
              onClick={() => setShowModal(false)}
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reservations;

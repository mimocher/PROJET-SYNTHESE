// src/utils/billing.js
// Utilitaires pour les calculs de facturation

export const TAX_RATE = 0.20; // TVA 20%

// Calculer le sous-total (avant taxes)
export const calculateSubtotal = (items) => {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
};

// Calculer la TVA
export const calculateTax = (subtotal) => {
  return subtotal * TAX_RATE;
};

// Calculer le total TTC
export const calculateTotal = (items) => {
  const subtotal = calculateSubtotal(items);
  const tax = calculateTax(subtotal);
  return subtotal + tax;
};

// Générer un numéro de facture unique
export const generateInvoiceNumber = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `INV-${year}${month}${day}-${random}`;
};

// Formater un montant en euros
export const formatPrice = (amount) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount);
};

// Calculer une remise
export const calculateDiscount = (subtotal, discountPercent) => {
  return subtotal * (discountPercent / 100);
};

// Appliquer une remise au total
export const applyDiscount = (items, discountPercent) => {
  const subtotal = calculateSubtotal(items);
  const discount = calculateDiscount(subtotal, discountPercent);
  const subtotalAfterDiscount = subtotal - discount;
  const tax = calculateTax(subtotalAfterDiscount);
  return {
    subtotal,
    discount,
    subtotalAfterDiscount,
    tax,
    total: subtotalAfterDiscount + tax
  };
};

// Créer un objet facture complet
export const createInvoice = (user, items, discountPercent = 0) => {
  const invoiceNumber = generateInvoiceNumber();
  const date = new Date().toISOString();
  
  let breakdown;
  if (discountPercent > 0) {
    breakdown = applyDiscount(items, discountPercent);
  } else {
    const subtotal = calculateSubtotal(items);
    const tax = calculateTax(subtotal);
    breakdown = {
      subtotal,
      discount: 0,
      subtotalAfterDiscount: subtotal,
      tax,
      total: subtotal + tax
    };
  }
  
  return {
    invoiceNumber,
    date,
    user: {
      name: user.name,
      email: user.email,
      phone: user.phone
    },
    items: items.map(item => ({
      ...item,
      subtotal: item.price * item.quantity
    })),
    ...breakdown,
    discountPercent,
    status: 'pending' // pending, paid, cancelled
  };
};

// Valider les traitements/services à faire
export const validateTreatments = (items) => {
  const errors = [];
  
  if (!items || items.length === 0) {
    errors.push('Aucun traitement sélectionné');
    return { valid: false, errors };
  }
  
  items.forEach((item, index) => {
    if (!item.quantity || item.quantity <= 0) {
      errors.push(`Quantité invalide pour ${item.name}`);
    }
    if (!item.price || item.price <= 0) {
      errors.push(`Prix invalide pour ${item.name}`);
    }
  });
  
  return {
    valid: errors.length === 0,
    errors
  };
};

// Calculer le total des traitements restants
export const calculateRemainingTreatments = (allTreatments, completedTreatments) => {
  return allTreatments.filter(t => 
    !completedTreatments.some(ct => ct.id === t.id)
  );
};

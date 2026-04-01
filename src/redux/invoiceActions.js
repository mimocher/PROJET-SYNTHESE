// src/redux/invoiceActions.js
import { CREATE_INVOICE, UPDATE_INVOICE_STATUS, CANCEL_INVOICE, MARK_AS_PAID, ADD_TREATMENT_NOTE } from './invoiceTypes';
import { createInvoice } from '../utils/billing';

export const createInvoiceAction = (user, cartItems, discountPercent = 0) => {
  const invoice = createInvoice(user, cartItems, discountPercent);
  
  return {
    type: CREATE_INVOICE,
    payload: invoice
  };
};

export const updateInvoiceStatus = (invoiceNumber, status) => {
  return {
    type: UPDATE_INVOICE_STATUS,
    payload: { invoiceNumber, status }
  };
};

export const cancelInvoice = (invoiceNumber) => {
  return {
    type: CANCEL_INVOICE,
    payload: invoiceNumber
  };
};

export const markAsPaid = (invoiceNumber, paymentMethod) => {
  return {
    type: MARK_AS_PAID,
    payload: { 
      invoiceNumber, 
      paymentMethod,
      paidAt: new Date().toISOString()
    }
  };
};

export const addTreatmentNote = (invoiceNumber, itemId, note) => {
  return {
    type: ADD_TREATMENT_NOTE,
    payload: { invoiceNumber, itemId, note }
  };
};

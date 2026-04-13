// src/redux/invoiceReducer.js
import { CREATE_INVOICE, UPDATE_INVOICE_STATUS, CANCEL_INVOICE, MARK_AS_PAID, ADD_TREATMENT_NOTE } from './invoiceTypes';

const initialState = {
  invoices: []
};

const invoiceReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_INVOICE:
      return {
        ...state,
        invoices: [...state.invoices, action.payload]
      };

    case UPDATE_INVOICE_STATUS:
      return {
        ...state,
        invoices: state.invoices.map(invoice =>
          invoice.invoiceNumber === action.payload.invoiceNumber
            ? { ...invoice, status: action.payload.status }
            : invoice
        )
      };

    case CANCEL_INVOICE:
      return {
        ...state,
        invoices: state.invoices.map(invoice =>
          invoice.invoiceNumber === action.payload
            ? { ...invoice, status: 'cancelled', cancelledAt: new Date().toISOString() }
            : invoice
        )
      };

    case MARK_AS_PAID:
      return {
        ...state,
        invoices: state.invoices.map(invoice =>
          invoice.invoiceNumber === action.payload.invoiceNumber
            ? { 
                ...invoice, 
                status: 'paid',
                paymentMethod: action.payload.paymentMethod,
                paidAt: action.payload.paidAt
              }
            : invoice
        )
      };

    case ADD_TREATMENT_NOTE:
      return {
        ...state,
        invoices: state.invoices.map(invoice =>
          invoice.invoiceNumber === action.payload.invoiceNumber
            ? {
                ...invoice,
                items: invoice.items.map(item =>
                  item.id === action.payload.itemId
                    ? { ...item, note: action.payload.note }
                    : item
                )
              }
            : invoice
        )
      };

    default:
      return state;
  }
};

export default invoiceReducer;

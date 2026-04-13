// src/redux/cartReducer.js
import { ADD_TO_CART, REMOVE_FROM_CART, UPDATE_QUANTITY, CLEAR_CART, APPLY_DISCOUNT } from './cartTypes';
import { calculateSubtotal, calculateTax, calculateTotal, calculateDiscount } from '../utils/billing';

const initialState = {
  items: [],
  subtotal: 0,
  tax: 0,
  discount: 0,
  discountPercent: 0,
  total: 0
  
};

const recalculateTotals = (items, discountPercent = 0) => {
  const subtotal = calculateSubtotal(items);
  const discount = calculateDiscount(subtotal, discountPercent);
  const subtotalAfterDiscount = subtotal - discount;
  const tax = calculateTax(subtotalAfterDiscount);
  const total = subtotalAfterDiscount + tax;
  
  return {
    subtotal,
    discount,
    tax,
    total,
    discountPercent
  };
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART: {
      // Vérifier si l'item existe déjà
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      let newItems;
      if (existingItem) {
        // Augmenter la quantité
        newItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Ajouter le nouvel item
        newItems = [...state.items, action.payload];
      }
      
      return {
        ...state,
        items: newItems,
        ...recalculateTotals(newItems, state.discountPercent)
      };
    }

    case REMOVE_FROM_CART: {
      const newItems = state.items.filter(item => item.id !== action.payload);
      
      return {
        ...state,
        items: newItems,
        ...recalculateTotals(newItems, state.discountPercent)
      };
    }

    case UPDATE_QUANTITY: {
      const newItems = state.items.map(item =>
        item.id === action.payload.serviceId
          ? { ...item, quantity: Math.max(1, action.payload.quantity) }
          : item
      );
      
      return {
        ...state,
        items: newItems,
        ...recalculateTotals(newItems, state.discountPercent)
      };
    }

    case APPLY_DISCOUNT: {
      return {
        ...state,
        ...recalculateTotals(state.items, action.payload)
      };
    }

    case CLEAR_CART:
      return initialState;

    default:
      return state;
  }
};

export default cartReducer;

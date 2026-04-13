// src/redux/cartActions.js
import { ADD_TO_CART, REMOVE_FROM_CART, UPDATE_QUANTITY, CLEAR_CART, APPLY_DISCOUNT } from './cartTypes';

export const addToCart = (service) => {
  return {
    type: ADD_TO_CART,
    payload: {
      id: service.id,
      name: service.name,
      price: service.price,
      description: service.description,
      duration: service.duration,
      quantity: 1
    }
  };
};

export const removeFromCart = (serviceId) => {
  return {
    type: REMOVE_FROM_CART,
    payload: serviceId
  };
};

export const updateQuantity = (serviceId, quantity) => {
  return {
    type: UPDATE_QUANTITY,
    payload: { serviceId, quantity }
  };
};

export const clearCart = () => {
  return {
    type: CLEAR_CART
  };
};

export const applyDiscount = (discountPercent) => {
  return {
    type: APPLY_DISCOUNT,
    payload: discountPercent
  };
};

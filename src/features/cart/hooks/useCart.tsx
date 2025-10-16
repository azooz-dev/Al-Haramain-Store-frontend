import { useCallback, useMemo } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
  selectCartItems,
  selectCartTotalItems,
  selectCartTotalPrice,
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart
} from "@/store/slices/cartSlice";
import { CartItem } from "../types";

export const useCart = () => {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(selectCartItems);
  const totalItems = useAppSelector(selectCartTotalItems);
  const totalPrice = useAppSelector(selectCartTotalPrice);


  const handleAddToCart = useCallback((item: CartItem): boolean => {
    try {
      dispatch(addToCart(item));
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }, [dispatch]);

  const handleUpdateQuantity = useCallback((identifier: number, quantity: number): boolean => {
    try {
      dispatch(updateQuantity({ identifier, quantity }));
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }, [dispatch]);

  const handleRemoveItem = useCallback((identifier: number): boolean => {
    try {
      dispatch(removeFromCart(identifier));
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }, [dispatch]);

  const handleClearCart = useCallback((): boolean => {
    try {
      dispatch(clearCart());
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }, [dispatch]);


  const getCartItem = useCallback((identifier: number) => {
    return cartItems.find((item) => item.identifier === identifier);
  }, [cartItems]);

  const isInCart = useCallback((identifier: number) => {
    return cartItems.some((item) => item.identifier === identifier);
  }, [cartItems]);

  const getProductCartItemQuantity = useCallback((identifier: number) => {
    const itemInCart = isInCart(identifier);

    if (!itemInCart) return 0;

    return cartItems.find((item) => item.identifier === identifier)?.quantity || 0;
  }, [cartItems, isInCart]);

  const isEmpty = useMemo(() => {
    return cartItems.length === 0;
  }, [cartItems.length]);

  const hasItems = useMemo(() => {
    return cartItems.length > 0;
  }, [cartItems.length]);

  const cartSummary = useMemo(() => {
    return {
      totalItems,
      totalPrice,
      itemsCount: cartItems.length,
      isEmpty,
      hasItems,
    }
  }, [totalItems, totalPrice, cartItems.length, isEmpty, hasItems]);

  const cartCalculations = useMemo(() => {
    const subtotal: number = cartItems.reduce((acc: number, item: CartItem) => acc + (item.amount_discount_price || item.price) * item.quantity, 0);
    const shipping: number = 0; // Temporary value
    const tax: number = 0;
    const total: number = subtotal + shipping + tax;
    return {
      subtotal,
      shipping,
      tax,
      total,
    }
  }, [cartItems]);

  return {
    cartItems,
    getCartItem,
    getProductCartItemQuantity,
    isInCart,
    isEmpty,
    hasItems,
    cartSummary,
    cartCalculations,
    handleAddToCart,
    handleUpdateQuantity,
    handleRemoveItem,
    handleClearCart,
  }
}
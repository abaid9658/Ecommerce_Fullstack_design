import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';
import * as cartAPI from '../api/cart';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [savedForLater, setSavedForLater] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load cart initially
  useEffect(() => {
    const fetchCartData = async () => {
      setLoading(true);
      if (user) {
        try {
          const data = await cartAPI.getCart();
          setCartItems(data.items || []);
          setSavedForLater(data.savedForLater || []);
        } catch (error) {
          console.error('Error fetching cart from backend:', error);
        }
      } else {
        // Unauthenticated - get from LocalStorage
        const localCart = localStorage.getItem('cartItems');
        const localSaved = localStorage.getItem('savedForLater');
        if (localCart) setCartItems(JSON.parse(localCart));
        if (localSaved) setSavedForLater(JSON.parse(localSaved));
      }
      setLoading(false);
    };

    fetchCartData();
  }, [user]);

  // Sync cartItems to localStorage if guest user
  useEffect(() => {
    if (!user) {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }
  }, [cartItems, user]);

  // Sync savedForLater to localStorage if guest user
  useEffect(() => {
    if (!user) {
      localStorage.setItem('savedForLater', JSON.stringify(savedForLater));
    }
  }, [savedForLater, user]);

  // Add Item to Cart
  const addItemToCart = async (product, quantity = 1, selectedColor = '', selectedSize = '', material = '') => {
    if (user) {
      try {
        const data = await cartAPI.addToCart(product._id, quantity, selectedColor, selectedSize, material);
        setCartItems(data.items || []);
      } catch (error) {
        console.error('Error adding to database cart:', error);
      }
    } else {
      // Local State logic
      setCartItems((prevItems) => {
        const existingItemIndex = prevItems.findIndex(
          (item) =>
            item.product._id === product._id &&
            item.selectedColor === selectedColor &&
            item.selectedSize === selectedSize
        );

        if (existingItemIndex > -1) {
          const newItems = [...prevItems];
          newItems[existingItemIndex].quantity += quantity;
          return newItems;
        } else {
          return [...prevItems, { product, quantity, selectedColor, selectedSize, material }];
        }
      });
    }
  };

  // Remove Item from Cart
  const removeItemFromCart = async (productId, selectedColor = '', selectedSize = '') => {
    if (user) {
      try {
        const data = await cartAPI.removeFromCart(productId, selectedColor, selectedSize);
        setCartItems(data.items || []);
      } catch (error) {
        console.error('Error removing from database cart:', error);
      }
    } else {
      setCartItems((prevItems) =>
        prevItems.filter(
          (item) =>
            !(
              item.product._id === productId &&
              item.selectedColor === selectedColor &&
              item.selectedSize === selectedSize
            )
        )
      );
    }
  };

  // Update Cart Item Quantity
  const updateItemQuantity = async (productId, quantity, selectedColor = '', selectedSize = '') => {
    if (quantity <= 0) {
      return removeItemFromCart(productId, selectedColor, selectedSize);
    }

    if (user) {
      try {
        const data = await cartAPI.updateCartItem(productId, quantity, selectedColor, selectedSize);
        setCartItems(data.items || []);
      } catch (error) {
        console.error('Error updating quantity in database:', error);
      }
    } else {
      setCartItems((prevItems) => {
        const itemIndex = prevItems.findIndex(
          (item) =>
            item.product._id === productId &&
            item.selectedColor === selectedColor &&
            item.selectedSize === selectedSize
        );
        if (itemIndex > -1) {
          const newItems = [...prevItems];
          newItems[itemIndex].quantity = quantity;
          return newItems;
        }
        return prevItems;
      });
    }
  };

  // Move item to saved for later
  const saveItemForLater = async (productId, selectedColor = '', selectedSize = '') => {
    if (user) {
      try {
        const data = await cartAPI.saveForLater(productId, selectedColor, selectedSize);
        setCartItems(data.items || []);
        setSavedForLater(data.savedForLater || []);
      } catch (error) {
        console.error('Error saving item for later:', error);
      }
    } else {
      const itemToSave = cartItems.find(
        (item) =>
          item.product._id === productId &&
          item.selectedColor === selectedColor &&
          item.selectedSize === selectedSize
      );

      if (itemToSave) {
        // Remove from active
        removeItemFromCart(productId, selectedColor, selectedSize);
        // Add to saved
        setSavedForLater((prev) => {
          if (prev.some((p) => p._id === productId)) return prev;
          return [...prev, itemToSave.product];
        });
      }
    }
  };

  // Move item back to cart
  const moveItemToCart = async (productId) => {
    if (user) {
      try {
        const data = await cartAPI.moveToCart(productId);
        setCartItems(data.items || []);
        setSavedForLater(data.savedForLater || []);
      } catch (error) {
        console.error('Error moving item to cart:', error);
      }
    } else {
      const productToMove = savedForLater.find((p) => p._id === productId);
      if (productToMove) {
        // Remove from saved
        setSavedForLater((prev) => prev.filter((p) => p._id !== productId));
        // Add to active
        addItemToCart(productToMove, 1);
      }
    }
  };

  // Clear entire cart
  const clearEntireCart = async () => {
    if (user) {
      try {
        await cartAPI.clearCart();
        setCartItems([]);
      } catch (error) {
        console.error('Error clearing database cart:', error);
      }
    } else {
      setCartItems([]);
    }
  };

  // Compute subtotal, tax, discounts, totals
  const getCartTotals = () => {
    const subtotal = cartItems.reduce((acc, item) => {
      const p = item.product;
      // Handle tiered pricing if available
      let price = p.price;
      if (p.tieredPricing && p.tieredPricing.length > 0) {
        const tier = p.tieredPricing.find(t => item.quantity >= t.minQty && item.quantity <= t.maxQty)
          || p.tieredPricing[p.tieredPricing.length - 1];
        if (tier) price = tier.price;
      }
      return acc + price * item.quantity;
    }, 0);

    const discount = cartItems.reduce((acc, item) => {
      const p = item.product;
      if (p.originalPrice && p.originalPrice > p.price) {
        return acc + (p.originalPrice - p.price) * item.quantity;
      }
      return acc;
    }, 0);

    const tax = subtotal * 0.05; // 5% tax
    const total = subtotal + tax;

    return {
      subtotal,
      discount,
      tax,
      total,
      itemCount: cartItems.reduce((acc, item) => acc + item.quantity, 0)
    };
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        savedForLater,
        loading,
        addItemToCart,
        removeItemFromCart,
        updateItemQuantity,
        saveItemForLater,
        moveItemToCart,
        clearEntireCart,
        totals: getCartTotals()
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
export default CartContext;

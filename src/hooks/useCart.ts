import { useStore } from "@/store/useStore";

/**
 * Кастомный хук для работы с корзиной
 */
export const useCart = () => {
  const cart = useStore((state) => state.cart);
  const addToCart = useStore((state) => state.addToCart);
  const removeFromCart = useStore((state) => state.removeFromCart);
  const updateQuantity = useStore((state) => state.updateQuantity);
  const clearCart = useStore((state) => state.clearCart);

  const getCartItemQuantity = (productId: string) => {
    const item = cart.items.find((item) => item.product.id === productId);
    return item?.quantity || 0;
  };

  const getTotalItems = () => {
    return cart.items.reduce((sum, item) => sum + item.quantity, 0);
  };

  const isInCart = (productId: string) => {
    return cart.items.some((item) => item.product.id === productId);
  };

  const incrementQuantity = (productId: string) => {
    const currentQuantity = getCartItemQuantity(productId);
    updateQuantity(productId, currentQuantity + 1);
  };

  const decrementQuantity = (productId: string) => {
    const currentQuantity = getCartItemQuantity(productId);
    if (currentQuantity > 1) {
      updateQuantity(productId, currentQuantity - 1);
    } else {
      removeFromCart(productId);
    }
  };

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartItemQuantity,
    getTotalItems,
    isInCart,
    incrementQuantity,
    decrementQuantity,
  };
};

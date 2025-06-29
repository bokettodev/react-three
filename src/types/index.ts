export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  shape: "3d-shape";
  geometry: GeometryType;
  color: string;
  size: [number, number, number]; // width, height, depth
}

export type GeometryType =
  | "box"
  | "sphere"
  | "cylinder"
  | "cone"
  | "torus"
  | "octahedron";

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

export interface AppState {
  products: Product[];
  cart: Cart;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

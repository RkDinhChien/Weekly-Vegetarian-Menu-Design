/**
 * Shared TypeScript types and interfaces for the application
 */

// ============= MENU TYPES =============
export interface SizeOption {
  name: string;
  servings: number;
  price: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  day: string;
  weekId: string;
  isSpecial: boolean;
  available: boolean;
  sizeOptions?: SizeOption[];
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  displayOrder?: number;
}

// ============= CART TYPES =============
export interface CartItem {
  id: string;
  menuItemId: string;
  name: string;
  description: string;
  category: string;
  imageUrl: string;
  quantity: number;
  selectedSize: SizeOption;
}

// ============= ORDER TYPES =============
export interface OrderInfo {
  customerName: string;
  phone: string;
  province: string;
  district: string;
  ward: string;
  address: string;
  deliveryDate: string;
  deliveryTime: string;
  notes: string;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  deliveryDate: string;
  deliveryTime: string;
  status: OrderStatus;
  totalAmount: number;
  notes?: string;
  items: OrderItem[];
  createdAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  menuItemId: string;
  menuItemName: string;
  quantity: number;
  price: number;
  selectedSize?: string;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "delivering"
  | "completed"
  | "cancelled";

// ============= DISH LIBRARY TYPES =============
export interface Dish {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  categoryName?: string;
  imageUrl?: string;
  sizeOptions?: SizeOption[];
  createdAt: string;
  updatedAt: string;
}

// ============= API RESPONSE TYPES =============
export interface ApiResponse<T> {
  data: T;
  error?: string;
  message?: string;
}

export interface ApiError {
  error: string;
  message: string;
  statusCode: number;
}

// ============= CONSTANTS =============
export const DAYS_OF_WEEK = [
  "Thứ Hai",
  "Thứ Ba",
  "Thứ Tư",
  "Thứ Năm",
  "Thứ Sáu",
  "Thứ Bảy",
  "Chủ Nhật",
] as const;

export type DayOfWeek = (typeof DAYS_OF_WEEK)[number];

export const CATEGORY_COLORS: Record<string, string> = {
  "Món Cuốn": "bg-amber-100 text-amber-800 border-amber-300",
  "Món dùng kèm Bánh Mì": "bg-orange-100 text-orange-800 border-orange-300",
  "Mì/ Bún/ Bánh canh": "bg-blue-100 text-blue-800 border-blue-300",
  "Mì/ Bún Xào": "bg-purple-100 text-purple-800 border-purple-300",
  "Nước uống": "bg-teal-100 text-teal-800 border-teal-300",
} as const;

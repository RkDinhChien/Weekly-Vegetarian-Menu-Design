/**
 * API Service Layer
 * Centralized API calls to Supabase Edge Functions
 */
import { supabaseConfig } from '../supabase/client';
import type { MenuItem, Order, Dish, Category } from '@/types';

const { projectId, anonKey } = supabaseConfig;

// Base URL for all API calls
const getApiUrl = (endpoint: string) => 
  `https://${projectId}.supabase.co/functions/v1/make-server-49570ec2/${endpoint}`;

// Standard headers for all requests
const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${anonKey}`,
});

/**
 * Generic API request handler with error handling
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    const response = await fetch(getApiUrl(endpoint), {
      ...options,
      headers: {
        ...getHeaders(),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Request failed [${endpoint}]:`, error);
    throw error;
  }
}

// ============= MENU API =============
export const menuApi = {
  /**
   * Fetch all menu items
   */
  getAll: () => apiRequest<MenuItem[]>('menu'),

  /**
   * Fetch menu items by week
   */
  getByWeek: (weekId: string) => 
    apiRequest<MenuItem[]>(`menu?weekId=${weekId}`),

  /**
   * Fetch menu items by day
   */
  getByDay: (day: string, weekId?: string) => {
    const query = weekId ? `?day=${day}&weekId=${weekId}` : `?day=${day}`;
    return apiRequest<MenuItem[]>(`menu${query}`);
  },

  /**
   * Add dish to menu
   */
  addDish: (data: { dishId: string; day: string; weekId: string }) =>
    apiRequest<MenuItem>('menu', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /**
   * Remove item from menu
   */
  remove: (id: string) =>
    apiRequest<void>(`menu/${id}`, {
      method: 'DELETE',
    }),
};

// ============= ORDERS API =============
export const ordersApi = {
  /**
   * Create new order
   */
  create: (orderData: Partial<Order>) =>
    apiRequest<Order>('orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    }),

  /**
   * Get all orders
   */
  getAll: () => apiRequest<Order[]>('orders'),

  /**
   * Get order by ID
   */
  getById: (id: string) => apiRequest<Order>(`orders/${id}`),

  /**
   * Update order status
   */
  updateStatus: (id: string, status: string) =>
    apiRequest<Order>(`orders/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  /**
   * Delete order
   */
  delete: (id: string) =>
    apiRequest<void>(`orders/${id}`, {
      method: 'DELETE',
    }),
};

// ============= DISHES API =============
export const dishesApi = {
  /**
   * Get all dishes
   */
  getAll: () => apiRequest<Dish[]>('dishes'),

  /**
   * Get dish by ID
   */
  getById: (id: string) => apiRequest<Dish>(`dishes/${id}`),

  /**
   * Create new dish
   */
  create: (dishData: Partial<Dish>) =>
    apiRequest<Dish>('dishes', {
      method: 'POST',
      body: JSON.stringify(dishData),
    }),

  /**
   * Update dish
   */
  update: (id: string, dishData: Partial<Dish>) =>
    apiRequest<Dish>(`dishes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dishData),
    }),

  /**
   * Delete dish
   */
  delete: (id: string) =>
    apiRequest<void>(`dishes/${id}`, {
      method: 'DELETE',
    }),
};

// ============= CATEGORIES API =============
export const categoriesApi = {
  /**
   * Get all categories
   */
  getAll: () => apiRequest<Category[]>('categories'),

  /**
   * Create new category
   */
  create: (categoryData: Partial<Category>) =>
    apiRequest<Category>('categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    }),

  /**
   * Update category
   */
  update: (id: string, categoryData: Partial<Category>) =>
    apiRequest<Category>(`categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData),
    }),

  /**
   * Delete category
   */
  delete: (id: string) =>
    apiRequest<void>(`categories/${id}`, {
      method: 'DELETE',
    }),
};

// ============= IMAGE UPLOAD API =============
export const imagesApi = {
  /**
   * Upload image
   */
  upload: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(getApiUrl('upload-image'), {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${anonKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Image upload failed');
    }

    return await response.json();
  },
};

// Export all APIs
export const api = {
  menu: menuApi,
  orders: ordersApi,
  dishes: dishesApi,
  categories: categoriesApi,
  images: imagesApi,
};

export default api;

/**
 * Simple logging utility for analytics and debugging
 */

export const log = {
  order: (message: string, data?: any) => {
    console.log(`[ORDER] ${message}`, data ? JSON.stringify(data) : '');
  },

  payment: (message: string, data?: any) => {
    console.log(`[PAYMENT] ${message}`, data ? JSON.stringify(data) : '');
  },

  api: (message: string, data?: any) => {
    console.log(`[API] ${message}`, data ? JSON.stringify(data) : '');
  },

  error: (message: string, data?: any) => {
    console.error(`[ERROR] ${message}`, data ? JSON.stringify(data) : '');
  },

  webhook: (message: string, data?: any) => {
    console.log(`[WEBHOOK] ${message}`, data ? JSON.stringify(data) : '');
  },

  stock: (message: string, data?: any) => {
    console.log(`[STOCK] ${message}`, data ? JSON.stringify(data) : '');
  },
};

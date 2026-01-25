import { z } from 'zod';

// Customer Schema
export const customerSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  phone: z.string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number is too long')
    .regex(/^[6-9]\d{9}$/, 'Please enter a valid Indian phone number'),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(1, 'Last name is required'),
});

// Shipping Address Schema
export const shippingAddressSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(1, 'Last name is required'),
  address: z.string().min(10, 'Please enter a complete address'),
  apartment: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pincode: z.string()
    .length(6, 'Pincode must be 6 digits')
    .regex(/^\d{6}$/, 'Please enter a valid pincode'),
  phone: z.string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number is too long')
    .regex(/^[6-9]\d{9}$/, 'Please enter a valid Indian phone number'),
});

// Cart Item Schema
export const cartItemSchema = z.object({
  id: z.string(),
  productId: z.string(),
  name: z.string(),
  price: z.number().positive(),
  image: z.string(),
  size: z.string(),
  quantity: z.number().int().positive(),
});

// Order Item Schema
export const orderItemSchema = z.object({
  productId: z.string(),
  name: z.string(),
  price: z.number().positive(),
  image: z.string(),
  size: z.string(),
  quantity: z.number().int().positive(),
});

// Create Order Request Schema
export const createOrderRequestSchema = z.object({
  customer: customerSchema,
  shippingAddress: shippingAddressSchema,
  items: z.array(orderItemSchema).min(1, 'Cart cannot be empty'),
});

// Checkout Form Schema (combined customer + shipping)
export const checkoutFormSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  phone: z.string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number is too long')
    .regex(/^[6-9]\d{9}$/, 'Please enter a valid Indian phone number'),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(1, 'Last name is required'),
  address: z.string().min(10, 'Please enter a complete address'),
  apartment: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pincode: z.string()
    .length(6, 'Pincode must be 6 digits')
    .regex(/^\d{6}$/, 'Please enter a valid pincode'),
});

// Type exports from schemas
export type CustomerInput = z.infer<typeof customerSchema>;
export type ShippingAddressInput = z.infer<typeof shippingAddressSchema>;
export type CartItemInput = z.infer<typeof cartItemSchema>;
export type OrderItemInput = z.infer<typeof orderItemSchema>;
export type CreateOrderRequest = z.infer<typeof createOrderRequestSchema>;
export type CheckoutFormData = z.infer<typeof checkoutFormSchema>;

// Indian States for dropdown
export const indianStates = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry',
] as const;

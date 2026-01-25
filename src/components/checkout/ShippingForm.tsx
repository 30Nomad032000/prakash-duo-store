'use client';

import { motion } from 'framer-motion';
import { indianStates } from '@/lib/schemas';

interface ShippingFormProps {
  formData: {
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
    address: string;
    apartment?: string;
    city: string;
    state: string;
    pincode: string;
  };
  errors: Record<string, string>;
  onChange: (field: string, value: string) => void;
}

export default function ShippingForm({ formData, errors, onChange }: ShippingFormProps) {
  const inputClass = (field: string) =>
    `w-full px-4 py-3 border rounded-lg bg-white focus:outline-none focus:ring-2 transition-colors ${
      errors[field]
        ? 'border-red-300 focus:ring-red-200 focus:border-red-400'
        : 'border-stone-200 focus:ring-gold/20 focus:border-gold'
    }`;

  const labelClass = 'block text-sm font-medium text-charcoal mb-1.5';
  const errorClass = 'text-xs text-red-500 mt-1';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Contact Information */}
      <div>
        <h3 className="text-lg font-medium text-charcoal mb-4">Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Email Address</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => onChange('email', e.target.value)}
              placeholder="your@email.com"
              className={inputClass('email')}
            />
            {errors.email && <p className={errorClass}>{errors.email}</p>}
          </div>
          <div>
            <label className={labelClass}>Phone Number</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => onChange('phone', e.target.value)}
              placeholder="10-digit mobile number"
              className={inputClass('phone')}
            />
            {errors.phone && <p className={errorClass}>{errors.phone}</p>}
          </div>
        </div>
      </div>

      {/* Shipping Address */}
      <div>
        <h3 className="text-lg font-medium text-charcoal mb-4">Shipping Address</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>First Name</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => onChange('firstName', e.target.value)}
                placeholder="Enter first name"
                className={inputClass('firstName')}
              />
              {errors.firstName && <p className={errorClass}>{errors.firstName}</p>}
            </div>
            <div>
              <label className={labelClass}>Last Name</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => onChange('lastName', e.target.value)}
                placeholder="Enter last name"
                className={inputClass('lastName')}
              />
              {errors.lastName && <p className={errorClass}>{errors.lastName}</p>}
            </div>
          </div>

          <div>
            <label className={labelClass}>Street Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => onChange('address', e.target.value)}
              placeholder="House no., Building name, Street"
              className={inputClass('address')}
            />
            {errors.address && <p className={errorClass}>{errors.address}</p>}
          </div>

          <div>
            <label className={labelClass}>
              Apartment, Suite, etc. <span className="text-charcoal/40">(Optional)</span>
            </label>
            <input
              type="text"
              value={formData.apartment || ''}
              onChange={(e) => onChange('apartment', e.target.value)}
              placeholder="Apartment, suite, unit, floor, etc."
              className={inputClass('apartment')}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>City</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => onChange('city', e.target.value)}
                placeholder="City"
                className={inputClass('city')}
              />
              {errors.city && <p className={errorClass}>{errors.city}</p>}
            </div>
            <div>
              <label className={labelClass}>State</label>
              <select
                value={formData.state}
                onChange={(e) => onChange('state', e.target.value)}
                className={inputClass('state')}
              >
                <option value="">Select State</option>
                {indianStates.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
              {errors.state && <p className={errorClass}>{errors.state}</p>}
            </div>
            <div>
              <label className={labelClass}>Pincode</label>
              <input
                type="text"
                value={formData.pincode}
                onChange={(e) => onChange('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="6-digit pincode"
                maxLength={6}
                className={inputClass('pincode')}
              />
              {errors.pincode && <p className={errorClass}>{errors.pincode}</p>}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

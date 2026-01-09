'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ProductDetailsProps {
  name: string;
  price: number;
  category: string;
}

export default function ProductDetails({ name, price, category }: ProductDetailsProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 lg:sticky lg:top-8"
    >
      <motion.div variants={itemVariants}>
        <Badge className="mb-4 bg-amber-100 text-amber-700 hover:bg-amber-200">
          {category}
        </Badge>
      </motion.div>
      
      <motion.h1 
        variants={itemVariants}
        className="text-3xl md:text-4xl font-serif font-bold text-gray-900 leading-tight"
      >
        {name}
      </motion.h1>
        
      <motion.div variants={itemVariants} className="flex items-baseline gap-3">
        <span className="text-2xl md:text-3xl font-bold text-amber-700">
          ₹{price.toLocaleString()}
        </span>
      </motion.div>
        
      <motion.p variants={itemVariants} className="text-gray-600 leading-relaxed">
        Handcrafted with love and precision by skilled artisans. Each piece is unique 
        and tells a story of tradition and elegance.
      </motion.p>
        
      <motion.div variants={itemVariants} className="border-t border-b border-stone-200 py-4">
        <label className="block text-sm font-medium text-gray-900 mb-3">
          Quantity
        </label>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="icon"
            className="w-10 h-10 hover:bg-stone-100"
          >
            -
          </Button>
          <span className="w-14 h-10 flex items-center justify-center border border-stone-300 rounded bg-white text-lg font-medium">
            1
          </span>
          <Button 
            variant="outline" 
            size="icon"
            className="w-10 h-10 hover:bg-stone-100"
          >
            +
          </Button>
        </div>
      </motion.div>
        
      <motion.div variants={itemVariants} className="space-y-3">
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white py-4 font-medium rounded transition-colors">
            Add to Cart
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white py-4 font-medium rounded transition-colors">
            Buy Now
          </Button>
        </motion.div>
      </motion.div>
        
      <motion.div 
        variants={itemVariants}
        className="pt-6 space-y-4 border-t border-stone-200"
      >
        {[
          { title: 'Free Shipping', subtitle: 'On orders above ₹999' },
          { title: 'Secure Payment', subtitle: '100% secure transactions' },
          { title: 'Easy Returns', subtitle: '7 days return policy' }
        ].map((item, i) => (
          <motion.div 
            key={i}
            variants={itemVariants}
            className="flex items-start gap-3"
          >
            <span className="text-amber-600 text-lg">✓</span>
            <div>
              <p className="text-sm font-medium text-gray-900">{item.title}</p>
              <p className="text-xs text-gray-500">{item.subtitle}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}

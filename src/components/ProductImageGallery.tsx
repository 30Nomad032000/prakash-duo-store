'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductImageGalleryProps {
  images: string[];
  name: string;
}

export default function ProductImageGallery({ images, name }: ProductImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="space-y-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="relative aspect-square bg-white rounded-lg overflow-hidden shadow-lg"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedImage}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full"
          >
            <Image
              src={images[selectedImage]}
              alt={name}
              fill
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>
      </motion.div>
      
      {images.length > 1 && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="grid grid-cols-4 gap-2"
        >
          {images.map((img, i) => (
            <motion.button
              key={i}
              onClick={() => setSelectedImage(i)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + (i * 0.05), duration: 0.3 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`relative aspect-square bg-stone-100 rounded border-2 overflow-hidden ${
                i === selectedImage ? 'border-amber-600 shadow-md' : 'border-transparent hover:border-amber-300'
              }`}
            >
              <Image
                src={img}
                alt={`${name} ${i + 1}`}
                fill
                className="object-cover"
              />
              {i === selectedImage && (
                <motion.div 
                  layoutId="selectedImage"
                  className="absolute inset-0 bg-amber-600/10"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </motion.div>
      )}
    </div>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  images: string[];
  category: string;
}

export default function ProductCard({ id, name, price, images, category }: ProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleMouseEnter = () => {
    if (images.length > 1) {
      setCurrentImageIndex(1);
    }
  };

  const handleMouseLeave = () => {
    setCurrentImageIndex(0);
  };

  return (
    <Link href={`/product/${id}`} className="group block">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ y: -4 }}
      >
        <Card className="overflow-hidden border-0 shadow-sm hover:shadow-xl transition-shadow">
          <CardContent className="p-0">
            <motion.div
              className="relative overflow-hidden bg-gray-100 aspect-square"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                key={currentImageIndex}
                transition={{ duration: 0.2 }}
                className="w-full h-full"
              >
                <Image
                  src={images[currentImageIndex] || images[0]}
                  alt={name}
                  fill
                  className="object-cover"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileHover={{ opacity: 1, y: 0 }}
                className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
              >
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  Quick View
                </Button>
              </motion.div>
            </motion.div>
          </CardContent>
          <CardFooter className="flex flex-col items-start p-4 mt-0">
            <motion.p 
              className="text-sm text-gray-600 mb-1"
              whileHover={{ x: 3 }}
            >
              {category}
            </motion.p>
            <motion.h3 
              className="text-sm font-medium text-gray-900"
              whileHover={{ x: 3 }}
            >
              {name}
            </motion.h3>
            <motion.p 
              className="mt-1 text-lg font-semibold text-gray-900"
              whileHover={{ x: 3 }}
            >
              ₹{price.toLocaleString()}
            </motion.p>
          </CardFooter>
        </Card>
      </motion.div>
    </Link>
  );
}

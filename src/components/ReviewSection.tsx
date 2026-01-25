"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

interface Review {
  id: string;
  name: string;
  rating: number;
  text: string;
  date: string;
  verified?: boolean;
}

interface ReviewSectionProps {
  reviews?: Review[];
  averageRating?: number;
  totalReviews?: number;
}

const defaultReviews: Review[] = [
  {
    id: '1',
    name: "Priya Sharma",
    rating: 5,
    text: "Absolutely stunning bangles! The quality exceeded my expectations. The craftsmanship is impeccable and they look even more beautiful in person. Will definitely order again!",
    date: "3 days ago",
    verified: true
  },
  {
    id: '2',
    name: "Anjali Patel",
    rating: 5,
    text: "Beautiful craftsmanship. The packaging was perfect and delivery was super fast. I ordered these for my sister's wedding and everyone loved them!",
    date: "1 week ago",
    verified: true
  },
  {
    id: '3',
    name: "Meera Krishnan",
    rating: 5,
    text: "My sister loved the gift. The bangles look exactly like the pictures. Highly recommend this shop for anyone looking for quality bangles!",
    date: "2 weeks ago",
    verified: false
  },
  {
    id: '4',
    name: "Sneha Reddy",
    rating: 4,
    text: "Very nice bangles with beautiful designs. The only reason I'm giving 4 stars is that shipping took a bit longer than expected, but the quality made up for it.",
    date: "3 weeks ago",
    verified: true
  }
];

export default function ReviewSection({
  reviews = defaultReviews,
  averageRating = 4.9,
  totalReviews = 247
}: ReviewSectionProps) {
  const [selectedReview, setSelectedReview] = useState<string | null>(null);

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

  const renderStars = (rating: number, size: number = 16) => {
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={size}
            className={i < rating ? 'fill-gold text-gold' : 'text-gray-300'}
          />
        ))}
      </div>
    );
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants} className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-charcoal mb-2">
            Customer Reviews
          </h2>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-0.5">
              {renderStars(Math.round(averageRating), 20)}
            </div>
            <span className="text-lg font-semibold text-gold">
              {averageRating}
            </span>
            <span className="text-gray-500">
              ({totalReviews} reviews)
            </span>
          </div>
        </div>

        <button className="text-gold hover:text-rose-gold font-medium transition-colors underline decoration-gold/50 hover:decoration-rose-gold">
          Write a Review
        </button>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="space-y-4"
      >
        {reviews.map((review) => (
          <motion.div
            key={review.id}
            variants={itemVariants}
            whileHover={{ scale: 1.01 }}
            onClick={() => setSelectedReview(review.id)}
            className="bg-white rounded-lg border border-gray-200 p-6 cursor-pointer hover:shadow-lg hover:border-gold/50 transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-champagne flex items-center justify-center text-gold font-semibold">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <div className="font-medium text-charcoal flex items-center gap-2">
                    {review.name}
                    {review.verified && (
                      <span className="text-xs bg-gold/10 text-gold px-2 py-0.5 rounded-full">
                        Verified
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    {renderStars(review.rating)}
                    <span className="text-xs text-gray-500">{review.date}</span>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-gray-700 leading-relaxed">
              {selectedReview === review.id ? review.text : `${review.text.substring(0, 200)}${review.text.length > 200 ? '...' : ''}`}
            </p>

            {review.text.length > 200 && selectedReview !== review.id && (
              <button
                className="text-gold text-sm font-medium mt-2 hover:text-rose-gold transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedReview(review.id);
                }}
              >
                Read more
              </button>
            )}

            {selectedReview === review.id && review.text.length > 200 && (
              <button
                className="text-gold text-sm font-medium mt-2 hover:text-rose-gold transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedReview(null);
                }}
              >
                Show less
              </button>
            )}
          </motion.div>
        ))}
      </motion.div>

      {reviews.length > 0 && (
        <motion.div variants={itemVariants} className="text-center pt-4">
          <button className="inline-flex items-center gap-2 text-gold hover:text-rose-gold font-medium transition-colors">
            View all {totalReviews} reviews
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}

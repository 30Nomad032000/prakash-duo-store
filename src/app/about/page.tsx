"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-stone-50">
      <Header />
      
      <main>
        <motion.section 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="py-16 md:py-24 bg-white"
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div variants={itemVariants} className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
                About Bangles by Prakash Duo
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Celebrating tradition through timeless elegance
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="mb-16">
              <div className="bg-amber-50 border-l-4 border-amber-600 p-6 rounded-r-lg">
                <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">
                  Our Story
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Bangles by Prakash Duo was born from a passion for preserving the rich heritage of traditional bangle craftsmanship. For generations, bangles have been more than just jewelry they are a symbol of tradition, celebration, and femininity in Indian culture.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  We work closely with skilled artisans across India to bring you a curated collection of bangles that blend traditional artistry with contemporary design. Each piece in our collection tells a story of dedication, skill, and the timeless beauty of Indian craftsmanship.
                </p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="mb-16">
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6 text-center">
                Our Values
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    icon: "✨",
                    title: "Quality Craftsmanship",
                    description: "Every bangle is carefully handcrafted by skilled artisans using traditional techniques passed down through generations."
                  },
                  {
                    icon: "🤝",
                    title: "Fair Trade",
                    description: "We believe in fair compensation and sustainable practices that support artisan communities."
                  },
                  {
                    icon: "🌟",
                    title: "Customer First",
                    description: "Your satisfaction is our priority. We are committed to providing exceptional service and beautiful products."
                  }
                ].map((value, i) => (
                  <motion.div 
                    key={i}
                    variants={itemVariants}
                    className="bg-white border border-stone-200 rounded-lg p-6 text-center hover:shadow-lg transition-shadow"
                  >
                    <div className="text-4xl mb-4">{value.icon}</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {value.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="mb-16">
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6 text-center">
                Our Commitment
              </h2>
              <div className="bg-gradient-to-br from-stone-100 to-amber-50 rounded-lg p-8">
                <p className="text-gray-700 leading-relaxed mb-4 text-center">
                  At Bangles by Prakash Duo, we are committed to:
                </p>
                <ul className="space-y-3 max-w-2xl mx-auto">
                  {[
                    "Preserving traditional craftsmanship techniques",
                    "Supporting artisan communities across India",
                    "Using high-quality, sustainable materials",
                    "Providing exceptional customer service",
                    "Creating designs that celebrate Indian heritage"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-700">
                      <span className="text-amber-600 flex-shrink-0">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="text-center">
              <p className="text-gray-600 mb-4">
                Thank you for being part of our journey.
              </p>
              <p className="text-lg font-medium text-gray-900">
                With love and gratitude,<br />
                <span className="text-amber-600">Team Prakash Duo</span>
              </p>
            </motion.div>
          </div>
        </motion.section>
      </main>

      <Footer />
    </div>
  );
}

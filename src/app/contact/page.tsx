"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

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

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

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
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div variants={itemVariants} className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
                Get in Touch
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                We would love to hear from you. Whether you have a question about our bangles, need assistance with an order, or just want to say hello, we are here to help.
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-12">
              <motion.div variants={itemVariants}>
                <div className="bg-amber-50 rounded-lg p-8">
                  <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">
                    Contact Information
                  </h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-xl">📍</span>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 mb-1">Address</h3>
                        <p className="text-gray-600">
                          123 Jewelry Lane<br />
                          Traditional Market<br />
                          Mumbai, Maharashtra 400001<br />
                          India
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-xl">📧</span>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 mb-1">Email</h3>
                        <p className="text-gray-600">
                          hello@prakashduo.com<br />
                          support@prakashduo.com
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-xl">📞</span>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 mb-1">Phone</h3>
                        <p className="text-gray-600">
                          +91 22 1234 5678<br />
                          Mon-Sat, 9am-7pm IST
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-xl">⏰</span>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 mb-1">Business Hours</h3>
                        <p className="text-gray-600">
                          Monday - Saturday: 9:00 AM - 7:00 PM<br />
                          Sunday: Closed
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <div className="bg-white border border-stone-200 rounded-lg p-8">
                  <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">
                    Send us a Message
                  </h2>
                  
                  {submitted ? (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-green-50 border border-green-200 rounded-lg p-6 text-center"
                    >
                      <div className="text-4xl mb-3">✅</div>
                      <h3 className="text-lg font-medium text-green-800 mb-2">
                        Message Sent!
                      </h3>
                      <p className="text-green-700">
                        Thank you for reaching out. We will get back to you within 24 hours.
                      </p>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-2">
                          Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                          placeholder="Your name"
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                          placeholder="your.email@example.com"
                        />
                      </div>

                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-900 mb-2">
                          Subject
                        </label>
                        <input
                          type="text"
                          id="subject"
                          required
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                          placeholder="How can we help?"
                        />
                      </div>

                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-900 mb-2">
                          Message
                        </label>
                        <textarea
                          id="message"
                          required
                          rows={5}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all resize-none"
                          placeholder="Your message..."
                        />
                      </div>

                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button 
                          type="submit" 
                          className="w-full bg-amber-600 hover:bg-amber-700 text-white py-4 font-medium rounded-lg transition-colors"
                        >
                          Send Message
                        </Button>
                      </motion.div>
                    </form>
                  )}
                </div>
              </motion.div>
            </div>

            <motion.div variants={itemVariants} className="mt-16">
              <div className="bg-gradient-to-br from-stone-100 to-amber-50 rounded-lg p-8 text-center">
                <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">
                  Follow Us
                </h2>
                <p className="text-gray-600 mb-6">
                  Stay updated with our latest collections and offers by following us on social media.
                </p>
                <div className="flex justify-center gap-4">
                  {[
                    { name: "Instagram", icon: "📸" },
                    { name: "Facebook", icon: "👍" },
                    { name: "Pinterest", icon: "📌" },
                    { name: "Twitter", icon: "🐦" }
                  ].map((social, i) => (
                    <motion.button
                      key={i}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-12 h-12 bg-white border border-stone-300 rounded-full flex items-center justify-center hover:border-amber-400 hover:shadow-md transition-all"
                      aria-label={social.name}
                    >
                      <span className="text-xl">{social.icon}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>
      </main>

      <Footer />
    </div>
  );
}

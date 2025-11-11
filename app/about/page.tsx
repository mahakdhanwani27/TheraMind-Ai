"use client";

import { motion } from "framer-motion";
import { Heart, Brain, Users } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6 flex flex-col items-center">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-bold text-gray-800 mb-8"
      >
        About TheraMind AI
      </motion.h1>

      <div className="max-w-3xl text-center space-y-6 text-gray-700 leading-relaxed">
        <p>
          <strong>TheraMind AI</strong> is an intelligent mental wellness platform that blends
          psychology with artificial intelligence. It provides a safe, private, and interactive
          space for self-reflection, mood tracking, and emotional growth.
        </p>

        <p>
          Using advanced <strong>Natural Language Processing</strong> and <strong>Cognitive
          Behavioral Therapy (CBT)</strong> techniques, TheraMind AI assists users in understanding
          their emotions, building healthy habits, and staying mindful.
        </p>

        <div className="flex justify-center gap-10 mt-10">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="flex flex-col items-center"
          >
            <Heart className="w-10 h-10 text-pink-500 mb-2" />
            <span className="text-gray-600 text-sm">Empathy-driven AI</span>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="flex flex-col items-center"
          >
            <Brain className="w-10 h-10 text-blue-600 mb-2" />
            <span className="text-gray-600 text-sm">Therapeutic Intelligence</span>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="flex flex-col items-center"
          >
            <Users className="w-10 h-10 text-green-600 mb-2" />
            <span className="text-gray-600 text-sm">User Wellbeing Focus</span>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

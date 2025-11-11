"use client";

import { motion } from "framer-motion";
import { Brain, Sparkles, Activity, BarChart3 } from "lucide-react";

export default function FeaturesPage() {
  const features = [
    {
      icon: <Brain className="w-8 h-8 text-blue-600" />,
      title: "AI-Powered Therapy",
      desc: "Engage in intelligent conversations powered by advanced AI trained on therapeutic techniques.",
    },
    {
      icon: <Activity className="w-8 h-8 text-blue-600" />,
      title: "Mood Tracking",
      desc: "Monitor emotional trends and track your progress through visual analytics and insights.",
    },
    {
      icon: <Sparkles className="w-8 h-8 text-blue-600" />,
      title: "Personalized Guidance",
      desc: "Receive customized coping strategies and mindful exercises tailored to your goals.",
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-blue-600" />,
      title: "Progress Dashboard",
      desc: "Visualize your emotional growth over time with interactive charts and progress indicators.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6 flex flex-col items-center">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-bold text-gray-800 mb-10"
      >
        Key Features
      </motion.h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center"
          >
            <div className="mb-4">{feature.icon}</div>
            <h3 className="font-semibold text-lg text-gray-800 mb-2">
              {feature.title}
            </h3>
            <p className="text-gray-600 text-sm">{feature.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

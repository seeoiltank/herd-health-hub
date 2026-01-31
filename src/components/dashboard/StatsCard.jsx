import React from 'react';
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function StatsCard({ title, value, icon: Icon, gradient, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card className={`relative overflow-hidden p-6 border-0 shadow-lg ${gradient}`}>
        <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-8 -translate-y-8 rounded-full bg-white/10" />
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm font-medium">{title}</p>
              <p className="text-4xl font-bold text-white mt-2">{value}</p>
            </div>
            <div className="p-3 rounded-2xl bg-white/20">
              <Icon className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
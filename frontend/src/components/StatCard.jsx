import React from 'react';
import { motion } from 'framer-motion';

export default function StatCard({ icon: Icon, label, value }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="card p-5 flex items-center gap-4"
    >
      <div className="h-12 w-12 rounded-2xl grid place-items-center bg-badgebg">
        <Icon size={20} className="text-primary" />
      </div>
      <div>
        <p className="text-xs uppercase tracking-wide text-muted font-semibold">{label}</p>
        <p className="text-2xl font-extrabold text-heading">{value}</p>
      </div>
    </motion.div>
  );
}
import React from 'react';
import { motion } from 'framer-motion';

export default function StatCard({ icon: Icon, label, value, accent = 'primary' }) {
  const bg = {
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-secondary/10 text-secondary',
    accent: 'bg-accent/20 text-accent',
    success: 'bg-success/10 text-success'
  }[accent];

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="card p-5 flex items-center gap-4">
      <div className={`h-12 w-12 rounded-2xl grid place-items-center ${bg}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-sm text-body">{label}</p>
        <p className="text-2xl font-extrabold text-heading">{value}</p>
      </div>
    </motion.div>
  );
}

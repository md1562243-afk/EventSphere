import React from 'react';
import { motion } from 'framer-motion';

const GOLD = '#D4AF37';
const CARD_BG = '#171717';
const BORDER = 'rgba(212,175,55,0.20)';
const SECONDARY = '#B8B8B8';

export default function StatCard({ icon: Icon, label, value }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 280, damping: 22 }}
      className="relative rounded-xl overflow-hidden group"
      style={{ backgroundColor: CARD_BG, border: `1px solid ${BORDER}` }}
    >
      <div
        className="h-[2px] w-full opacity-60 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }}
      />

      <div className="p-5 flex items-center gap-4">
        <div
          className="h-12 w-12 rounded-full grid place-items-center flex-shrink-0"
          style={{ border: `1px solid ${BORDER}` }}
        >
          <Icon size={19} style={{ color: GOLD }} strokeWidth={1.75} />
        </div>
        <div>
          <p
            className="text-[10px] uppercase tracking-[0.15em] font-semibold mb-1"
            style={{ color: SECONDARY }}
          >
            {label}
          </p>
          <p className="text-2xl font-black text-white">{value}</p>
        </div>
      </div>

      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"
        style={{ boxShadow: `0 0 0 1px ${GOLD}, 0 8px 28px -10px rgba(212,175,55,0.3)` }}
      />
    </motion.div>
  );
}
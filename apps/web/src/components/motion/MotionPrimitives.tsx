'use client';

import { motion } from 'framer-motion';
import React from 'react';

export const FadeIn = ({ children, delay = 0, className = '' }: React.PropsWithChildren<{ className?: string; delay?: number }>) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className={className}
  >
    {children}
  </motion.div>
);

export const AnimatedHeading = ({ children, level = 1, className = '' }: React.PropsWithChildren<{ className?: string; level?: number }>) => {
  const Tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Tag className={className}>{children}</Tag>
    </motion.div>
  );
};

export const AnimatedCard = ({ children, className = '' }: React.PropsWithChildren<{ className?: string }>) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className={className}
  >
    {children}
  </motion.div>
);

export const AnimatedButton = ({ children, className = '', ...props }: React.PropsWithChildren<{ className?: string; [key: string]: unknown }>) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className={className}
    {...props}
  >
    {children}
  </motion.button>
);

export const StaggerGroup = ({ children, className = '' }: React.PropsWithChildren<{ className?: string }>) => (
  <motion.div
    initial="hidden"
    animate="visible"
    variants={{
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 },
      },
    }}
    className={className}
  >
    {children}
  </motion.div>
);

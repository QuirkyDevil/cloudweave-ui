'use client';
import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ChevronDown, ChevronUp } from 'lucide-react';

const transition = {
  type: 'spring',
  mass: 0.5,
  damping: 11.5,
  stiffness: 100,
  restDelta: 0.001,
  restSpeed: 0.001,
};

export const MenuItem = ({ setActive, active, item, children }) => {
  const isActive = active === item;

  return (
    <div
      onMouseEnter={() => setActive(item)}
      className="relative text-white flex items-center"
    >
      <motion.p
        transition={{ duration: 0.3 }}
        className="cursor-pointer hover:opacity-80 flex items-center"
      >
        {item}
        <motion.span
          initial={{ rotate: 0 }}
          animate={{ rotate: isActive ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="ml-2"
        >
          {isActive ? (
            <ChevronUp size={16} className="text-white" />
          ) : (
            <ChevronDown size={16} className="text-white" />
          )}
        </motion.span>
      </motion.p>
      {isActive && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={transition}
          className="absolute top-[calc(100%_+_1.2rem)] left-1/2 transform -translate-x-1/2 pt-4"
        >
          <motion.div
            transition={transition}
            layoutId="active"
            className="bg-neutral-900 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/[0.2] shadow-xl"
          >
            <motion.div layout className="w-max h-full p-4">
              {children}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};


export const Menu = ({ setActive, children }) => {
  return (
    <nav
      onMouseLeave={() => setActive(null)}
      className="relative rounded-full bg-neutral-900 shadow-lg flex justify-center space-x-6 px-4 py-6"
    >
      {children}
    </nav>
  );
};

export const HoveredLink = ({ children, href = '#', ...rest }) => {
  return (
    <Link
      href={href}
      {...rest}
      className="text-neutral-400 hover:text-white transition"
    >
      {children}
    </Link>
  );
};

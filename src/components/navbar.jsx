import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import CustomDatePicker from './CustomDatePicker';
import CustomTimePicker from './CustomTimePicker';
import {
  getModelPublisher,
  getModelYear,
  getModelArchitecture,
  getModelTechnique,
} from '@/lib/data';

export default function Navbar({
  className,
  onItemSelect,
  toggleMapMode,
  isDynamic,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState(null);
  const [expandedItems, setExpandedItems] = useState({});

  const menuItems = [
    {
      item: 'Model',
      options: ['DAIN', 'FILM', 'RIFE', 'RAFT'],
      onSelect: (option) =>
        onItemSelect({
          name: option,
          details: {
            'Published By': getModelPublisher('RAFT'),
            'Year Published': getModelYear('RAFT'),
          },
          specifications: {
            Architecture: getModelArchitecture(option),
            'Primary Technique': getModelTechnique(option),
          },
        }),
    },
    {
      item: 'Date',
      component: CustomDatePicker,
      onSelect: (startDate, endDate) => {
        setSelectedDate({ start: startDate, end: endDate });
        console.log('Selected Date Range:', startDate, endDate);
      },
    },
    {
      item: 'Time',
      component: CustomTimePicker,
      onSelect: (startTime, endTime) => {
        setSelectedTimeRange({ start: startTime, end: endTime });
        console.log('Selected Time Range:', startTime, endTime);
      },
    },
    {
      item: 'Map Mode',
      options: ['Static Map', 'Dynamic Map'],
      onSelect: (option) => {
        if (
          (option === 'Static Map' && isDynamic) ||
          (option === 'Dynamic Map' && !isDynamic)
        ) {
          toggleMapMode(!isDynamic);
        }
      },
    },
  ];

  const menuVariants = {
    hidden: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3,
      },
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        delayChildren: 0.2,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  const toggleItemExpansion = (itemName) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemName]: !prev[itemName],
    }));
  };

  const renderSubmenuContent = (item) => {
    // For items with options (like Model and Map Mode)
    if (item.options && item.options.length > 0) {
      return (
        <motion.div
          className="text-sm flex flex-col space-y-2 px-4 py-2 bg-neutral-800 text-white"
          variants={menuVariants}
        >
          {item.options.map((option) => (
            <motion.div
              key={option}
              variants={itemVariants}
              className="cursor-pointer p-2 hover:bg-neutral-700 rounded transition-colors text-white"
              onClick={() => {
                item.onSelect?.(option);
                setIsMenuOpen(false);
              }}
            >
              <span className="text-white font-medium hover:text-blue-300 transition">
                {option}
              </span>
            </motion.div>
          ))}
        </motion.div>
      );
    }

    // For Date and Time pickers
    if (item.component) {
      const Component = item.component;
      return (
        <div className="p-2 w-full">
          <Component
            onDateRangeSelect={item.onSelect}
            onTimeRangeSelect={item.onSelect}
            className="w-full"
          />
        </div>
      );
    }

    return null;
  };

  return (
    <div
      className={cn(
        'fixed top-2 left-2 z-50 bg-neutral-900 rounded-2xl shadow-lg w-64 max-h-[calc(100vh-2rem)] flex flex-col',
        className
      )}
    >
      <div className="flex items-center justify-between p-4 flex-shrink-0">
        <span className="font-bold text-xl text-white">CloudWeave</span>
        <motion.button
          whileHover={{ rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-white hover:text-gray-300"
        >
          <Settings size={24} />
        </motion.button>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={menuVariants}
            className="bg-neutral-900 rounded-b-2xl overflow-y-auto flex-grow"
          >
            {menuItems.map((menu, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="border-t border-white/10"
              >
                <div
                  className="flex justify-between items-center p-4 text-white cursor-pointer hover:bg-neutral-800 transition-colors"
                  onClick={() => toggleItemExpansion(menu.item)}
                >
                  <span className="font-semibold">{menu.item}</span>
                  {expandedItems[menu.item] ? (
                    <ChevronDown size={16} className="text-white" />
                  ) : (
                    <ChevronRight size={16} className="text-white" />
                  )}
                </div>

                <div
                  className={cn(
                    'relative transition-all duration-300 ease-in-out overflow-hidden',
                    expandedItems[menu.item]
                      ? 'max-h-96 opacity-100 visible z-10'
                      : 'max-h-0 opacity-0 invisible -z-10'
                  )}
                >
                  {renderSubmenuContent(menu)}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

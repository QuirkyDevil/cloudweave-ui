import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings,
  ChevronDown,
  ChevronRight,
  Calendar,
  Clock,
} from 'lucide-react';
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
  const [selectedModel, setSelectedModel] = useState(null);
  const [selectedMapMode, setSelectedMapMode] = useState('Static Map');
  const [expandedItems, setExpandedItems] = useState({});

  const menuItems = [
    {
      item: 'Model',
      options: ['DAIN', 'FILM', 'RIFE', 'RAFT'],
      onSelect: (option) => {
        const modelDetails = {
          name: option,
          details: {
            'Published By': getModelPublisher(option),
            'Year Published': getModelYear(option),
          },
          specifications: {
            Architecture: getModelArchitecture(option),
            'Primary Technique': getModelTechnique(option),
          },
        };
        setSelectedModel(modelDetails);
        onItemSelect(modelDetails);
      },
    },
    {
      item: 'Date',
      component: CustomDatePicker,
      onSelect: (startDate, endDate) => {
        const dateRange = { start: startDate, end: endDate };
        setSelectedDate(dateRange);
        console.log('Selected Date Range:', startDate, endDate);
      },
    },
    {
      item: 'Time',
      component: CustomTimePicker,
      onSelect: (startTime, endTime) => {
        const timeRange = { start: startTime, end: endTime };
        setSelectedTimeRange(timeRange);
        console.log('Selected Time Range:', startTime, endTime);
      },
    },
    {
      item: 'Map Mode',
      options: ['Static Map', 'Dynamic Map'],
      onSelect: (option) => {
        setSelectedMapMode(option);
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
          className="text-sm flex flex-col space-y-2 px-4 py-2 bg-[#1E293B] text-white"
          variants={menuVariants}
        >
          {item.options.map((option) => (
            <motion.div
              key={option}
              variants={itemVariants}
              className="cursor-pointer p-2 hover:bg-[#020617] rounded transition-colors text-white"
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

  // Render selected items summary
  const renderSelectionSummary = () => {
    return (
      <div className="px-4 py-2 bg-[#020617] space-y-1">
        {selectedModel && (
          <div className="flex items-center text-xs text-white">
            <span className="mr-2">Model:</span>
            <span className="font-semibold">{selectedModel.name}</span>
          </div>
        )}
        {selectedDate && (
          <div className="flex items-center text-xs text-white">
            <Calendar size={12} className="mr-2" />
            <span>
              {selectedDate.start
                ? selectedDate.start.toLocaleDateString()
                : 'Start'}{' '}
              -{' '}
              {selectedDate.end ? selectedDate.end.toLocaleDateString() : 'End'}
            </span>
          </div>
        )}
        {selectedTimeRange && (
          <div className="flex items-center text-xs text-white">
            <Clock size={12} className="mr-2" />
            <span>
              {selectedTimeRange.start || 'Start'} -{' '}
              {selectedTimeRange.end || 'End'}
            </span>
          </div>
        )}
        {selectedMapMode && (
          <div className="flex items-center text-xs text-white">
            <span className="mr-2">Map Mode:</span>
            <span>{selectedMapMode}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={cn(
        'fixed top-2 left-2 z-50 bg-[#1E293B] rounded-2xl shadow-lg w-64 max-h-[calc(100vh-2rem)] flex flex-col',
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
            className="bg-[#1E293B] rounded-b-2xl overflow-y-auto flex-grow"
          >
            {menuItems.map((menu, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="border-t border-white/10"
              >
                <div
                  className="flex justify-between items-center p-4 text-white cursor-pointer hover:bg-[#020617] transition-colors"
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

            {/* Selection Summary */}
            {(selectedModel ||
              selectedDate ||
              selectedTimeRange ||
              selectedMapMode) && (
              <div className="border-t border-white/10">
                {renderSelectionSummary()}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

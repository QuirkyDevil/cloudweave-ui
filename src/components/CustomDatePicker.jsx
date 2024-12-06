import React, { useState, useEffect } from 'react';

const CustomDatePicker = ({ onDateRangeSelect }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Get today's date at midnight for accurate comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Generate days for a given month and year
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Generate calendar grid
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = getDaysInMonth(year, month);

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  // Check if a date is valid for selection
  const isValidDate = (date) => {
    if (!date) return false;
    // Disable future dates and today's date
    return date < today;
  };

  // Check if a date is within the selected range
  const isDateInRange = (date) => {
    if (!startDate || !date) return false;
    if (!endDate) return date.toDateString() === startDate.toDateString();
    return date >= startDate && date <= endDate;
  };

  // Determine the style for a specific date
  const getDateStyle = (date) => {
    if (!date) return '';

    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const isToday = date.toDateString() === today.toDateString();
    const isSelected =
      startDate && date.toDateString() === startDate.toDateString();
    const isEndDate = endDate && date.toDateString() === endDate.toDateString();
    const isInRange = isDateInRange(date);
    const isInvalid = !isValidDate(date);

    let className = 'text-center text-sm p-1 rounded-full relative';

    // Invalid date styling
    if (isInvalid) {
      className += ' text-neutral-600 cursor-not-allowed opacity-50';
      return className;
    }

    // Cursor style
    className += ' cursor-pointer';

    // Weekend styling
    if (isWeekend) {
      className += ' text-red-400';
    } else {
      className += ' text-white';
    }

    // Range and selection styling
    if (isInRange) {
      className += ' bg-red-900/30';
    }

    // Selected date styling
    if (isSelected || isEndDate) {
      className += ' bg-red-600 text-white';
    }

    return className;
  };

  // Handle date selection
  const selectDate = (date) => {
    // Prevent selection of invalid dates
    if (!isValidDate(date)) return;

    if (!startDate) {
      setStartDate(date);
    } else if (!endDate) {
      // Ensure end date is after start date and before today
      if (date >= startDate && date < today) {
        setEndDate(date);
        onDateRangeSelect?.(startDate, date);
      } else {
        // If selected date is before start date, reset selection
        setStartDate(date);
        setEndDate(null);
      }
    } else {
      // Reset selection if both dates are already selected
      setStartDate(date);
      setEndDate(null);
    }
  };

  // Change month
  const changeMonth = (delta) => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + delta);
    setCurrentMonth(newDate);
  };

  // Format date for display
  const formatDate = (date) => {
    return date
      ? date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      : 'Select Date';
  };

  // Month and year display
  const monthYearDisplay = currentMonth.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const calendarDays = generateCalendarDays();

  return (
    <div className="w-80">
      <div className="w-full bg-neutral-900 rounded-2xl p-4">
        {/* Date Range Display */}
        <div className="flex justify-between mb-4 text-white">
          <div className="text-sm">
            Start: {startDate ? formatDate(startDate) : 'Start Date'}
          </div>
          <div className="text-sm">
            End: {endDate ? formatDate(endDate) : 'End Date'}
          </div>
        </div>

        {/* Month Navigation */}
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => changeMonth(-1)}
            className="text-white/70 hover:text-white"
          >
            ←
          </button>
          <span className="text-white font-semibold">{monthYearDisplay}</span>
          <button
            onClick={() => changeMonth(1)}
            className="text-white/70 hover:text-white"
          >
            →
          </button>
        </div>

        {/* Weekday Headers */}
        <div className="grid grid-cols-7 text-center text-xs text-white/60 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div
              key={day}
              className={day === 'Sun' || day === 'Sat' ? 'text-red-400' : ''}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((date, index) => (
            <div
              key={index}
              onClick={() => selectDate(date)}
              className={getDateStyle(date)}
            >
              {date ? date.getDate() : ''}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomDatePicker;

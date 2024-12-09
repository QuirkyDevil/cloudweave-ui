import React, { useState, useEffect } from 'react';

const CustomDatePicker = ({ onDateRangeSelect, className }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = getDaysInMonth(year, month);

    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const isValidDate = (date) => {
    if (!date) return false;
    return date < today;
  };

  const isDateInRange = (date) => {
    if (!startDate || !date) return false;
    if (!endDate) return date.toDateString() === startDate.toDateString();
    return date >= startDate && date <= endDate;
  };

  const getDateStyle = (date) => {
    if (!date) return '';

    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const isToday = date.toDateString() === today.toDateString();
    const isSelected =
      startDate && date.toDateString() === startDate.toDateString();
    const isEndDate = endDate && date.toDateString() === endDate.toDateString();
    const isInRange = isDateInRange(date);
    const isInvalid = !isValidDate(date);

    let className = 'text-center text-xs p-0.5 rounded-full relative';

    if (isInvalid) {
      className += ' text-neutral-600 cursor-not-allowed opacity-50';
      return className;
    }
    className += ' cursor-pointer';

    if (isWeekend) {
      className += ' text-red-400';
    } else {
      className += ' text-white';
    }

    if (isInRange) {
      className += ' bg-red-900/30';
    }

    if (isSelected || isEndDate) {
      className += ' bg-red-600 text-white';
    }

    return className;
  };

  // Rest of the implementation remains the same as previous component...
  const selectDate = (date) => {
    if (!isValidDate(date)) return;

    if (!startDate) {
      setStartDate(date);
    } else if (!endDate) {
      if (date >= startDate && date < today) {
        setEndDate(date);
        onDateRangeSelect?.(startDate, date);
      } else {
        setStartDate(date);
        setEndDate(null);
      }
    } else {
      setStartDate(date);
      setEndDate(null);
    }
  };

  const changeMonth = (delta) => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + delta);
    setCurrentMonth(newDate);
  };

  const formatDate = (date) => {
    return date
      ? date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      : 'Select Date';
  };

  const monthYearDisplay = currentMonth.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const calendarDays = generateCalendarDays();

  return (
    <div className={`w-full ${className}`}>
      <div className="w-full bg-neutral-900 rounded-2xl p-2">
        {/* Date Range Display */}
        <div className="flex justify-between mb-2 text-white">
          <div className="text-xs">
            Start: {startDate ? formatDate(startDate) : 'Start Date'}
          </div>
          <div className="text-xs">
            End: {endDate ? formatDate(endDate) : 'End Date'}
          </div>
        </div>

        {/* Month Navigation */}
        <div className="flex justify-between items-center mb-2">
          <button
            onClick={() => changeMonth(-1)}
            className="text-white/70 hover:text-white text-xs"
          >
            ←
          </button>
          <span className="text-white text-sm font-semibold">
            {monthYearDisplay}
          </span>
          <button
            onClick={() => changeMonth(1)}
            className="text-white/70 hover:text-white text-xs"
          >
            →
          </button>
        </div>

        {/* Weekday Headers */}
        <div className="grid grid-cols-7 text-center text-[0.6rem] text-white/60 mb-1">
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
        <div className="grid grid-cols-7 gap-0.5">
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

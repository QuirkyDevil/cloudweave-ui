import React, { useState } from 'react';
import { Clock, ArrowRightLeft, RefreshCcw } from 'lucide-react';

const LinearTimePicker = ({ onTimeRangeSelect, className }) => {
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [activeSelection, setActiveSelection] = useState('start');

  // Generate time slots
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute of [0, 30]) {
        slots.push({
          hour,
          minute,
          display: `${hour % 12 || 12}:${minute === 0 ? '00' : '30'} ${
            hour >= 12 ? 'PM' : 'AM'
          }`,
        });
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const selectTime = (timeObj) => {
    if (activeSelection === 'start') {
      if (endTime && isTimeAfter(endTime, timeObj)) {
        setStartTime(timeObj);
        setActiveSelection('end');
      } else if (!endTime) {
        setStartTime(timeObj);
        setActiveSelection('end');
      } else {
        alert('Start time must be before end time');
      }
    } else if (activeSelection === 'end') {
      if (isTimeAfter(timeObj, startTime)) {
        setEndTime(timeObj);
        onTimeRangeSelect?.(formatTime(startTime), formatTime(timeObj));
        setActiveSelection('complete');
      } else {
        alert('End time must be after start time');
      }
    }
  };

  const isTimeAfter = (time1, time2) => {
    return (
      time1.hour > time2.hour ||
      (time1.hour === time2.hour && time1.minute > time2.minute)
    );
  };

  const formatTime = (timeObj) => {
    return `${timeObj.hour % 12 || 12}:${timeObj.minute === 0 ? '00' : '30'} ${
      timeObj.hour >= 12 ? 'PM' : 'AM'
    }`;
  };

  const resetSelection = () => {
    setStartTime(null);
    setEndTime(null);
    setActiveSelection('start');
  };

  return (
    <div
      className={`w-full max-w-md mx-auto bg-slate-800 rounded-2xl p-6 ${className}`}
    >
      {/* Time Display */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <Clock className="text-blue-400" size={20} />
          <span className="text-white">
            {startTime ? formatTime(startTime) : 'Start Time'}
          </span>
        </div>
        {startTime && endTime && (
          <ArrowRightLeft className="text-white/50" size={16} />
        )}
        <div className="flex items-center space-x-2">
          <Clock className="text-green-400" size={20} />
          <span className="text-white">
            {endTime ? formatTime(endTime) : 'End Time'}
          </span>
        </div>
      </div>

      {/* Instructions */}
      <div className="text-center text-white/70 mb-4">
        {activeSelection === 'start' && 'Select Start Time'}
        {activeSelection === 'end' && 'Select End Time'}
        {activeSelection === 'complete' && 'Time Range Selected!'}
      </div>

      {/* Time Slots List */}
      <div className="max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800">
        {timeSlots.map((slot, index) => (
          <button
            key={index}
            onClick={() => selectTime(slot)}
            className={`
              w-full text-left p-3 rounded-lg mb-2 transition-all duration-200
              ${
                startTime?.hour === slot.hour &&
                startTime?.minute === slot.minute
                  ? 'bg-blue-600 text-white'
                  : endTime?.hour === slot.hour &&
                    endTime?.minute === slot.minute
                  ? 'bg-green-600 text-white'
                  : 'bg-slate-700 text-white/70 hover:bg-slate-600'
              }
            `}
          >
            {slot.display}
          </button>
        ))}
      </div>

      {/* Reset Button */}
      {(startTime || endTime) && (
        <button
          onClick={resetSelection}
          className="
            w-full mt-4 flex items-center justify-center
            bg-slate-700 text-white py-3 rounded-lg
            hover:bg-slate-600 transition-colors
          "
        >
          <RefreshCcw className="mr-2" size={16} />
          Reset Selection
        </button>
      )}
    </div>
  );
};

export default LinearTimePicker;

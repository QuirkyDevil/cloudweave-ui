import React, { useState, useEffect } from 'react';

const CustomTimePicker = ({ onTimeRangeSelect, className }) => {
  const [startTime, setStartTime] = useState({ hour: null, minute: null });
  const [endTime, setEndTime] = useState({ hour: null, minute: null });
  const [selectionStage, setSelectionStage] = useState('start-hour');

  // Generate hours (0-23)
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Generate minutes (0-59)
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  // Format time for display
  const formatTime = (hour, minute) => {
    if (hour === null || minute === null) return null;
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour.toString().padStart(2, '0')}:${minute
      .toString()
      .padStart(2, '0')} ${period}`;
  };

  // Handle hour selection
  const selectStartHour = (hour) => {
    setStartTime((prev) => ({ ...prev, hour }));
    setSelectionStage('start-minute');
  };

  // Handle start minute selection
  const selectStartMinute = (minute) => {
    setStartTime((prev) => ({ ...prev, minute }));
    setSelectionStage('end-hour');
  };

  // Handle end hour selection
  const selectEndHour = (hour) => {
    // Validate end time is after start time
    if (
      hour > startTime.hour ||
      (hour === startTime.hour && endTime.minute > startTime.minute)
    ) {
      setEndTime((prev) => ({ ...prev, hour }));
      setSelectionStage('end-minute');
    } else {
      alert('End time must be after start time');
    }
  };

  // Handle end minute selection
  const selectEndMinute = (minute) => {
    // Final validation
    if (
      endTime.hour > startTime.hour ||
      (endTime.hour === startTime.hour && minute > startTime.minute)
    ) {
      setEndTime((prev) => ({ ...prev, minute }));
      onTimeRangeSelect?.(
        formatTime(startTime.hour, startTime.minute),
        formatTime(endTime.hour, minute)
      );
      setSelectionStage('complete');
    } else {
      alert('End time must be after start time');
    }
  };

  // Reset selection
  const resetSelection = () => {
    setStartTime({ hour: null, minute: null });
    setEndTime({ hour: null, minute: null });
    setSelectionStage('start-hour');
  };

  // Determine button style based on selection stage
  const getButtonStyle = (type, value) => {
    // Base styles
    const baseStyle = 'text-center text-xs text-white py-0.5 cursor-pointer';
    const hoverStyle = 'hover:bg-neutral-600';
    const selectedStyle = 'bg-red-900/30';

    // Check if this value is already selected
    const isSelected =
      (type === 'start-hour' && value === startTime.hour) ||
      (type === 'start-minute' && value === startTime.minute) ||
      (type === 'end-hour' && value === endTime.hour) ||
      (type === 'end-minute' && value === endTime.minute);

    // Combine styles based on selection
    return `${baseStyle} ${hoverStyle} ${isSelected ? selectedStyle : ''}`;
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="w-full bg-neutral-900 rounded-2xl p-2">
        {/* Time Range Display */}
        <div className="flex justify-between mb-2 text-white">
          <div className="text-xs">
            Start:{' '}
            {startTime.hour !== null && startTime.minute !== null
              ? formatTime(startTime.hour, startTime.minute)
              : 'Start Time'}
          </div>
          <div className="text-xs">
            End:{' '}
            {endTime.hour !== null && endTime.minute !== null
              ? formatTime(endTime.hour, endTime.minute)
              : 'End Time'}
          </div>
        </div>

        {/* Selection Instructions */}
        <div className="text-white/60 text-[0.6rem] mb-2 text-center">
          {selectionStage === 'start-hour' && 'Select start hour'}
          {selectionStage === 'start-minute' && 'Select start minute'}
          {selectionStage === 'end-hour' && 'Select end hour'}
          {selectionStage === 'end-minute' && 'Select end minute'}
          {selectionStage === 'complete' && 'Time range selected'}
        </div>

        {/* Time Selection Buttons */}
        <div className="flex space-x-1">
          {/* Hours Column */}
          <div className="w-1/2 max-h-36 overflow-y-auto bg-neutral-900 rounded-lg">
            <div className="text-center text-white/60 text-[0.6rem] py-0.5">
              {selectionStage.includes('start') ? 'Start Hours' : 'End Hours'}
            </div>
            {(selectionStage.includes('start')
              ? hours
              : hours.filter(
                  (h) =>
                    h > startTime.hour ||
                    (h === startTime.hour && endTime.minute > startTime.minute)
                )
            ).map((hour) => (
              <div
                key={hour}
                onClick={() =>
                  selectionStage === 'start-hour'
                    ? selectStartHour(hour)
                    : selectionStage === 'end-hour'
                    ? selectEndHour(hour)
                    : null
                }
                className={getButtonStyle(
                  selectionStage.includes('start') ? 'start-hour' : 'end-hour',
                  hour
                )}
              >
                {hour % 12 || 12} {hour >= 12 ? 'PM' : 'AM'}
              </div>
            ))}
          </div>

          {/* Minutes Column */}
          <div className="w-1/2 max-h-36 overflow-y-auto bg-neutral-900 rounded-lg">
            <div className="text-center text-white/60 text-[0.6rem] py-0.5">
              {selectionStage.includes('start')
                ? 'Start Minutes'
                : 'End Minutes'}
            </div>
            {minutes.map((minute) => (
              <div
                key={minute}
                onClick={() =>
                  selectionStage === 'start-minute'
                    ? selectStartMinute(minute)
                    : selectionStage === 'end-minute'
                    ? selectEndMinute(minute)
                    : null
                }
                className={getButtonStyle(
                  selectionStage.includes('start')
                    ? 'start-minute'
                    : 'end-minute',
                  minute
                )}
              >
                {minute.toString().padStart(2, '0')}
              </div>
            ))}
          </div>
        </div>

        {/* Reset Button */}
        {(startTime.hour !== null || endTime.hour !== null) && (
          <button
            onClick={resetSelection}
            className="w-full mt-2 text-white/70 hover:text-white bg-neutral-900 py-1 rounded-lg text-xs"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
};

export default CustomTimePicker;

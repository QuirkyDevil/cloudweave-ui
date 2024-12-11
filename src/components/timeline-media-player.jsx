import { useState } from 'react';
import { format } from 'date-fns';
import { Clock, Calendar as CalendarIcon, Play, Pause } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';

export function TimelineMediaPlayer({
  onPlayPauseChange,
  onDateRangeChange,
  onTimelineChange,
  timelineValue,
}) {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [startTime, setStartTime] = useState('00:00');
  const [endTime, setEndTime] = useState('00:00');
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayPauseToggle = () => {
    const newPlayingState = !isPlaying;
    setIsPlaying(newPlayingState);
    onPlayPauseChange?.(newPlayingState);
    toast.info(newPlayingState ? 'Playing' : 'Paused');
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
    onDateRangeChange?.({
      startDate: date,
      startTime,
      endDate,
      endTime,
    });
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    onDateRangeChange?.({
      startDate,
      startTime,
      endDate: date,
      endTime,
    });
  };

  const TimePopover = ({ time, onTimeChange, label }) => {
    const [selectedHour, setSelectedHour] = useState(time.split(':')[0]);
    const [selectedMinute, setSelectedMinute] = useState(time.split(':')[1]);

    const hours = Array.from({ length: 24 }, (_, i) =>
      i.toString().padStart(2, '0')
    );

    const handleConfirm = () => {
      const newTime = `${selectedHour}:${selectedMinute}`;
      onTimeChange(newTime);
    };

    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={'outline'}
            className="flex items-center space-x-1 w-[100px] justify-center"
          >
            <Clock className="h-4 w-4 mr-1" />
            {time}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[320px] p-4 space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-lg font-semibold">Select Time</h4>
            <div className="flex items-center space-x-2">
              <div className="bg-muted rounded-md p-1 text-center w-16">
                {selectedHour}
              </div>
              <span>:</span>
              <div className="bg-muted rounded-md p-1 text-center w-16">
                {selectedMinute}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h5 className="text-sm font-medium mb-2">Hours</h5>
              <ScrollArea className="h-48 w-full border rounded-md">
                <div className="p-2 space-y-1">
                  {hours.map((hour) => (
                    <Button
                      key={hour}
                      variant={selectedHour === hour ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setSelectedHour(hour)}
                      className={cn(
                        'w-full mb-1',
                        selectedHour === hour &&
                          'bg-[#42BCFF] text-white hover:from-[#42BCFF] hover:to-[#5C3FFD]'
                      )}
                    >
                      {hour}
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </div>

            <div>
              <h5 className="text-sm font-medium mb-2">Minutes</h5>
              <div className="grid grid-cols-1 gap-2 border rounded-md p-2">
                {['00', '30'].map((minute) => (
                  <Button
                    key={minute}
                    variant={selectedMinute === minute ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setSelectedMinute(minute)}
                    className={cn(
                      'w-full',
                      selectedMinute === minute &&
                        'bg-[#42BCFF] text-white hover:from-[#42BCFF] hover:to-[#5C3FFD]'
                    )}
                  >
                    {minute}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => {
                setSelectedHour(time.split(':')[0]);
                setSelectedMinute(time.split(':')[1]);
              }}
            >
              Cancel
            </Button>
            <Button
              className={cn('bg-[#42BCFF] text-white hover:from-[#42BCFF] hover:to-[#5C3FFD]')}
              onClick={handleConfirm}
            >
              Confirm
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    );
  };

  const handleStartTimeChange = (newTime) => {
    setStartTime(newTime);
    onDateRangeChange?.({
      startDate,
      startTime: newTime,
      endDate,
      endTime,
    });
  };

  const handleEndTimeChange = (newTime) => {
    setEndTime(newTime);
    onDateRangeChange?.({
      startDate,
      startTime,
      endDate,
      endTime: newTime,
    });
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-xl px-4">
      <Card className="w-full">
        <div className="p-3 space-y-2">
          <div className="flex items-center space-x-2 flex-wrap justify-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={'outline'}
                  className={cn(
                    'flex-1 min-w-[120px] justify-center text-center font-normal',
                    !startDate && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, 'PP') : 'Start'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={handleStartDateChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <TimePopover
              time={startTime}
              onTimeChange={handleStartTimeChange}
              label="Start"
            />

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={'outline'}
                  className={cn(
                    'flex-1 min-w-[120px] justify-center text-center font-normal',
                    !endDate && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, 'PP') : 'End'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={handleEndDateChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <TimePopover
              time={endTime}
              onTimeChange={handleEndTimeChange}
              label="End"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              className="shrink-0"
              onClick={handlePlayPauseToggle}
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
            <Slider
              value={[timelineValue]}
              onValueChange={(value) => {
                onTimelineChange(value[0])
              }}
              max={100}
              step={1}
              className="flex-grow"
            />
          </div>
        </div>
      </Card>
    </div>
  );
}

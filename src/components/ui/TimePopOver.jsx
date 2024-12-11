import { useState } from 'react';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';

export function TimePopover({ time, onTimeChange, label }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedHour, setSelectedHour] = useState(time.split(':')[0]);
  const [selectedMinute, setSelectedMinute] = useState(time.split(':')[1]);

  const hours = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, '0')
  );

  const handleConfirm = () => {
    const newTime = `${selectedHour}:${selectedMinute}`;
    onTimeChange(newTime);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setSelectedHour(time.split(':')[0]);
    setSelectedMinute(time.split(':')[1]);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
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
                      selectedHour === hour && 'bg-black text-white'
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
              {['00', '15', '30','45'].map((minute) => (
                <Button
                  key={minute}
                  variant={selectedMinute === minute ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSelectedMinute(minute)}
                  className={cn(
                    'w-full',
                    selectedMinute === minute && 'bg-black text-white'
                  )}
                >
                  {minute}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>Confirm</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

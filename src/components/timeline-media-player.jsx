"use client";

import { useState } from "react";
import { addDays, format, subDays } from "date-fns";
import { CalendarIcon, Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { TimePopover } from "./ui/TimePopOver";
import { toast } from "sonner";

export function TimelineMediaPlayer({
  onPlayPauseChange,
  onDateRangeChange,
  onTimelineChange,
  timelineValue,
}) {
  const currentYear = new Date().getFullYear();
  const [date, setDate] = useState({
    from: subDays(new Date(), 7),
    to: new Date(),
  });
  const [startTime, setStartTime] = useState("00:00");
  const [endTime, setEndTime] = useState("00:00");
  const [isPlaying, setIsPlaying] = useState(false);

  const createDateTimeString = (selectedDate, time) => {
    if (!selectedDate) return "";
    const formattedDate = format(selectedDate, "yyyy-MM-dd");
    return `${formattedDate}T${time}:00.000Z`;
  };

  const isDateInFuture = (selectedDate, selectedTime) => {
    const selectedDateTime = new Date(
      createDateTimeString(selectedDate, selectedTime),
    );
    const now = new Date();
    return selectedDateTime > now;
  };

  const handleDateRangeChange = (dateInfo = {}) => {
    const effectiveStartDate = dateInfo.from || date?.from;
    const effectiveEndDate = dateInfo.to || date?.to;
    const effectiveStartTime = dateInfo.startTime || startTime;
    const effectiveEndTime = dateInfo.endTime || endTime;

    // Check if the selected date/time is in the future
    if (
      isDateInFuture(effectiveStartDate, effectiveStartTime) ||
      isDateInFuture(effectiveEndDate, effectiveEndTime)
    ) {
      toast.error("Can't select future date/time");
      setDate({
        from: subDays(new Date(), 7),
        to: new Date(),
      });
      return;
    }

    // Create date-time strings
    const startDateString = createDateTimeString(
      effectiveStartDate,
      effectiveStartTime,
    );
    const endDateString = createDateTimeString(
      effectiveEndDate,
      effectiveEndTime,
    );

    onDateRangeChange?.({
      startDate: startDateString,
      endDate: endDateString,
    });
  };

  const handlePlayPauseToggle = () => {
    const newPlayingState = !isPlaying;
    setIsPlaying(newPlayingState);
    onPlayPauseChange?.(newPlayingState);
    toast.info(newPlayingState ? "Playing" : "Paused");
  };

  const video = window.document.querySelector("video");

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4">
      <Card className="w-full">
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-around gap-8">
            <div className="flex flex-col items-center">
              <span className="text-sm text-muted-foreground pb-1">
                Start Time
              </span>
              <TimePopover
                time={startTime}
                onTimeChange={(newTime) => {
                  setStartTime(newTime);
                  handleDateRangeChange({
                    startTime: newTime,
                  });
                }}
                label="Start"
              />
            </div>

            <div className="flex flex-col items-center flex-grow">
              <span className="text-sm text-muted-foreground pb-1">
                Select Date Range
              </span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[300px] justify-start text-left font-normal",
                      !date && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon />
                    {date?.from ? (
                      date.to ? (
                        <>
                          {format(date.from, "LLL dd, y")} -{" "}
                          {format(date.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(date.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 min-h-full" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={(selectedDate) => {
                      setDate(selectedDate);
                      handleDateRangeChange(selectedDate);
                    }}
                    minDate={new Date("2000-01-01")}
                    numberOfMonths={1}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-sm text-muted-foreground pb-1">
                End Time
              </span>
              <TimePopover
                time={endTime}
                onTimeChange={(newTime) => {
                  setEndTime(newTime);
                  handleDateRangeChange({
                    endTime: newTime,
                  });
                }}
                label="End"
              />
            </div>
          </div>
          <div className="flex items-center justify-center space-x-4 mt-4">
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
                if (!video) return;
                if (video.paused) {
                  onTimelineChange(value[0]);
                }
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

'use client';

import React, { useState } from 'react';
import { HoveredLink, Menu, MenuItem } from './ui/navbar-menu';
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
  const [active, setActive] = useState(null);

  const menuItems = [
    {
      item: 'Model',
      options: ['DAIN', 'FILM', 'RIFE', 'RAFT'],
      onSelect: (option) =>
        onItemSelect({
          name: option,
          details: {
            'Published By': getModelPublisher(option),
            'Year Published': getModelYear(option),
          },
          specifications: {
            Architecture: getModelArchitecture(option),
            'Primary Technique': getModelTechnique(option),
          },
        }),
    },
    {
      item: 'Date',
      options: null,
      onSelect: null,
    },
    {
      item: 'Time',
      options: null,
      onSelect: null,
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

  return (
    <div
      className={cn(
        'fixed top-2 left-2 z-50 bg-neutral-900 pl-4 shadow-lg rounded-2xl flex items-center space-x-6',
        className
      )}
    >
      <span className="font-bold text-xl text-white">CloudWeave</span>

      <Menu setActive={setActive}>
        {menuItems.map((menu, index) => (
          <MenuItem
            key={index}
            setActive={setActive}
            active={active}
            item={menu.item}
          >
            {menu.item === 'Date' ? (
              <CustomDatePicker
                onDateRangeSelect={(start, end) => {
                  console.log('Selected Date Range:', start, end);
                }}
              />
            ) : menu.item === 'Time' ? (
              <CustomTimePicker
                onTimeRangeSelect={(start, end) => {
                  console.log('Selected Time Range:', start, end);
                }}
              />
            ) : (
              menu.options && (
                <div className="text-m flex flex-col space-y-4 px-4 bg-neutral-900">
                  {menu.options.map((option) => (
                    <HoveredLink
                      key={option}
                      onClick={() => menu.onSelect?.(option)}
                      className="hover:text-white/80 cursor-pointer"
                    >
                      {option}
                    </HoveredLink>
                  ))}
                </div>
              )
            )}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}

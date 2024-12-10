'use client';

import * as React from 'react';
import Image from 'next/image';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

export function CustomSiderBarHeader() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" className="w-full">
            <Image
              src="/vercel.svg"
              alt="CloudWeave Logo"
              width={32}
              height={32}
            />
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span
              className="font-bold text-transparent bg-clip-text text-2xl"
              style={{
                backgroundImage: 'linear-gradient(to right, #42BCFF, #5C3FFD)',
                WebkitBackgroundClip: 'text',
              }}
            >
              CloudWeave
            </span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

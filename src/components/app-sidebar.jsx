'use client';
import { useState } from 'react';
import { SquareTerminal, Bot } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { toast } from 'sonner';
import { CustomSiderBarHeader } from '@/components/sidebar-headers';

const data = {
  user: {
    name: 'CloudWeave',
    email: 'example@cloudweave.com',
    avatar: '/vercel.svg',
  },
  navMain: [
    {
      title: 'Model Selection',
      icon: SquareTerminal,
      groupId: 'model',
      items: [
        { title: 'FILM', id: 'FILM' },
        { title: 'DAIN', id: 'DAIN' },
        { title: 'RIFE', id: 'RIFE' },
        { title: 'CAIN', id: 'CAIN' },
        { title: 'AMT', id: 'AMT' },
      ],
    },
    {
      title: 'Compute Resources',
      icon: Bot,
      groupId: 'compute',
      items: [
        { title: 'Client GPU', id: 'ClientGPU' },
        { title: 'Server GPU', id: 'ServerGPU' },
      ],
    },
  ],
  locationSelector: [
    {
      title: 'Manual',
      icon: Bot,
      groupId: 'manual',
      items: [
        { title: 'Select Location', id: 'SelectLocation' },
      ],
    },
  ]
};

export function AppSidebar({ ...props }) {
  const [selectedItems, setSelectedItems] = useState({});

  const handleSelectSubItem = (groupId, subItemId) => {
    if (selectedItems[groupId] === subItemId) {
      toast.info(`You have already selected ${subItemId}`);
      return;
    }
    toast.success(`Selected ${subItemId} in ${groupId}`);
    setSelectedItems((prev) => ({
      ...prev,
      [groupId]: subItemId,
    }));
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <CustomSiderBarHeader teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain
          items={data.navMain}
          selectedItems={selectedItems}
          onSelectSubItem={handleSelectSubItem}
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

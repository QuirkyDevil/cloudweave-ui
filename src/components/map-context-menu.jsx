import React from 'react';
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
} from '@/components/ui/context-menu';
import { RefreshCcw, XSquare, Box, Map, CloudOff, Cloud } from 'lucide-react';

export default function MapContextMenu({
  onBoundingBox,
  onReload,
  onCancelDrawing,
  onToggleCloudLayer,
  showCloudLayer,
  children,
}) {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuItem onSelect={onBoundingBox}>
          <Box className="mr-2 w-4 h-4" />
          Select Bounding Box
        </ContextMenuItem>
        <ContextMenuItem onSelect={onReload}>
          <RefreshCcw className="mr-2 w-4 h-4" />
          Reload
        </ContextMenuItem>
        <ContextMenuItem onSelect={onToggleCloudLayer}>
          {showCloudLayer ? (
            <>
              <CloudOff className="mr-2 w-4 h-4" />
              Hide Cloud Layer
            </>
          ) : (
            <>
              <Cloud className="mr-2 w-4 h-4" />
              Show Cloud Layer
            </>
          )}
        </ContextMenuItem>
        <ContextMenuItem onSelect={onCancelDrawing} className="text-red-600">
          <XSquare className="mr-2 w-4 h-4" />
          Cancel Action
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

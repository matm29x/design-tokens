'use client';

import React from 'react';
import MuiTooltip, { TooltipProps as MuiTooltipProps } from '@mui/material/Tooltip';
import Fade from '@mui/material/Fade';
import { useTheme } from '@mui/material/styles';
import { getTooltipSlotStyles } from './Tooltip.styles';

export interface TooltipProps extends Omit<MuiTooltipProps, 'title'> {
  title: React.ReactNode;
  placement?: MuiTooltipProps['placement'];
  children: React.ReactElement;
}

export default function Tooltip({ title, placement = 'top', children, ...props }: TooltipProps) {
  const theme = useTheme();

  return (
    <MuiTooltip
      title={title}
      placement={placement}
      arrow
      TransitionComponent={Fade}
      TransitionProps={{ timeout: 0 }}
      // MUI v9 dropped the v5 `componentsProps` API in favor of `slotProps`.
      // Passing the slot styles via `componentsProps` was a silent no-op, so
      // the tooltip rendered with MUI's default gray styling (illegible in
      // dark mode). `getTooltipSlotStyles` returns the same { tooltip, arrow }
      // shape `slotProps` expects.
      slotProps={getTooltipSlotStyles(theme)}
      {...props}
    >
      {children}
    </MuiTooltip>
  );
}

import type { Theme } from '@mui/material/styles';

export const getTooltipSlotStyles = (theme: Theme) => ({
  tooltip: {
    sx: {
      ...theme.customTypography.body1.regular,
      // Inverted-contrast tooltip: common.black/white are CSS-var-backed and
      // flip with color mode — dark bubble + white text in light mode, white
      // bubble + dark text in dark mode. (These are applied via `slotProps` in
      // Tooltip.tsx; `componentsProps` is a silent no-op in MUI v6+.)
      backgroundColor: theme.semantic.common.black,
      color: theme.semantic.common.white,
      borderRadius: theme.customBorderRadius.xl,
      padding: theme.customSpacing[4],
      maxWidth: theme.customSpacing[80],
      boxShadow: 'none',
    },
  },
  arrow: {
    sx: {
      color: theme.semantic.common.black,
      '&::before': {
        border: 'none',
        backgroundColor: theme.semantic.common.black,
      },
    },
  },
});

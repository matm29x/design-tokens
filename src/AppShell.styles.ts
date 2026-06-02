'use client';

/** @version v0.19 */

import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import SmoothBox from './SmoothBox';

export const ShellRoot = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  backgroundColor: theme.semantic.common.white,
  fontFamily: theme.fontFamilies.body,
}));

export const HeaderWrapper = styled(Box)(({ theme }) => ({
  boxShadow: 'var(--sc-header-shadow)',
  borderBottom: `1px solid ${theme.semantic.divider}`,
  zIndex: 10,
  position: 'relative',
}));

export const BodyWrapper = styled(Box)(({ theme }) => ({
  flex: 1,
  // Desktop: lock the body to the viewport-minus-header. Children own
  // scroll (SideNavDesktop's maxHeight + ContentMain's PanelBody / inner
  // column). Mobile keeps page-scroll because the side nav is in a drawer
  // and the card drops its chrome — a single scroll surface is the
  // predictable behaviour there.
  overflowY: 'hidden',
  overflowX: 'hidden',
  minHeight: 0,
  [theme.breakpoints.down('md')]: { overflowY: 'auto' },
  backgroundColor: theme.semantic.background.default,
}));

export const BodyInner = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: theme.customSpacing[5],
  maxWidth: 1512,
  margin: '0 auto',
  width: '100%',
  // Desktop: lock to BodyWrapper's height so children's `maxHeight: 100%`
  // resolves to a real viewport-minus-header value. Mobile reverts to
  // grow-with-content so page-scroll handles overflow.
  height: '100%',
  minHeight: 0,
  padding: theme.customSpacing[4],
  boxSizing: 'border-box',
  [theme.breakpoints.down('md')]: {
    height: 'auto',
    minHeight: '100%',
    padding: 0,
  },
}));

export const SideNavDesktop = styled(Box)(({ theme }) => ({
  display: 'none',
  position: 'relative',
  alignSelf: 'flex-start',
  // Hug content up to the row's full height. SideNav has its own
  // `minHeight: 640` floor and grows with content; when its content would
  // otherwise overflow the viewport, the inner nav list scrolls (see
  // SideNav.styles.ts `hoverScrollStyles`). Matches ContentMain's behaviour.
  maxHeight: '100%',
  [theme.breakpoints.up('lg')]: {
    display: 'flex',
  },
}));

export const AppDrawer = styled(Drawer)(({ theme }) => ({
  [theme.breakpoints.up('lg')]: {
    display: 'none',
  },
  '& .MuiDrawer-paper': {
    width: 320,
    backgroundColor: theme.semantic.common.white,
    boxShadow: theme.customShadows.lg,
  },
}));

/** Main content area — squircle card, base styles only. Accepts sx + smoothRadius from AppShell. */
export const ContentMain = styled(SmoothBox)(({ theme }) => ({
  flex: 1,
  minWidth: 0,
  // Hugs content with a 640px floor so short pages don't render as a tiny
  // stub. `maxHeight: 100%` caps the card to the viewport-minus-chrome on
  // desktop so when content overflows, scroll lives on the inner body
  // (PanelBody / SettingsBody columns) instead of the page itself —
  // header / sub-nav / actions stay pinned. `min-height: 0` allows the
  // flex children inside (PanelBody overflow:auto) to actually shrink and
  // scroll instead of being squeezed off-screen.
  alignSelf: 'flex-start',
  minHeight: 640,
  maxHeight: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.customSpacing[4],
  backgroundColor: theme.semantic.common.white,
  backgroundImage: theme.surfaceOverlay.base,
  border: `1px solid ${theme.semantic.divider}`,
  boxShadow: 'var(--sc-panel-shadow)',
  padding: theme.customSpacing[5],
  // Mobile — full-bleed: drop the card chrome (border, shadow) and squircle
  // corners so the body reaches the viewport edges. Lift the maxHeight cap
  // so mobile falls back to page-scroll alongside BodyWrapper.
  [theme.breakpoints.down('md')]: {
    border: 'none',
    boxShadow: 'none',
    padding: 0,
    maxHeight: 'none',
    '&::before': { display: 'none' },
  },
}));

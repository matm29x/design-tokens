'use client';

import React, { useCallback, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Popover from '@mui/material/Popover';
import { Theme, useTheme } from '@mui/material/styles';
import BaseButton from './BaseButton';
import { useColorMode } from './ColorModeContext';
import ImagePlaceholder from './ImagePlaceholder';
import Toggle from './Toggle';
import {
  AccessibilityAltIcon,
  AddIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CloseIcon,
  DocumentMultipleIcon,
  EmailInviteIcon,
  EventScheduleIcon,
  LogoutIcon,
  MenuIcon,
  MoonOutlineIcon,
  NotificationIcon,
  SettingsIcon,
  ViewFilledIcon,
} from './icons';
import type { IconProps } from './icons';
import {
  LIAppBar,
  LICloseIconBtn,
  LIDesktopTabletRow,
  LIDividerBox,
  LIDrawerCloseBar,
  LIDrawerColumnBox,
  LIDrawerDividerBox,
  LIDrawerMenuItemsBox,
  LIDrawerProfileHeaderBox,
  LIDropdownIconBox,
  LIDropdownItem,
  LIDropdownItemBtn,
  LIDropdownLabel,
  LIHamburgerBtn,
  LILeftBox,
  LIMenuItemsBox,
  LIMobileLeftCol,
  LIMobileNotificationsBtn,
  LIMobileRightCol,
  LIMobileRow,
  LINavDrawerItem,
  LINavDrawerItemLabel,
  LINavDrawerList,
  LINotificationsIconBtn,
  LIOuterContainer,
  LIProfileButton,
  LIProfileEmailText,
  LIProfileHeaderBox,
  LIProfileNameText,
  LIProfileTextCol,
  LIResourcesIconBtn,
  LIRightBox,
  LIScheduleClosingIconBtn,
  LISendInviteIconBtn,
  LIToolbar,
  LIViewingDesktopBox,
  LIViewingLink,
  LIViewingMobilePill,
  LIViewingPill,
  LIViewingText,
  getFullLogoStyles,
  getNavDrawerPaperStyles,
  getPopoverPaperStyles,
  getProfileDrawerPaperStyles,
  getSymbolLogoStyles,
  logoLinkStyles,
} from './LoggedInHeader.styles';

export type LoggedInHeaderProfileType =
  | 'individual'
  | 'corporate'
  | 'law-firm'
  | 'title-insurance'
  | 'title-search'
  | 'notary'
  | 'title-co'
  | 'licensee-account'
  | 'super-admin';

export type LoggedInHeaderBreakpoint = 'mobile' | 'tablet' | 'desktop';

export interface LoggedInHeaderNavItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export interface LoggedInHeaderProfileMenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

export interface LoggedInHeaderProps {
  profileType?: LoggedInHeaderProfileType;
  impersonating?: boolean;
  userName?: string;
  userEmail?: string;
  avatarSrc?: string;
  profileImageSrc?: string;
  breakpoint?: LoggedInHeaderBreakpoint;
  onMenuClick?: () => void;
  onDrawerOpenChange?: (open: boolean) => void;
  onProfileDrawerOpenChange?: (open: boolean) => void;
  onSendInviteClick?: () => void;
  onScheduleClosingClick?: () => void;
  onResourcesClick?: () => void;
  onNotificationsClick?: () => void;
  onSettingsClick?: () => void;
  onAccessibilityClick?: () => void;
  onLogout?: () => void;
  onNavItemClick?: (item: LoggedInHeaderNavItem) => void;
  drawerActiveItem?: string;
  navItems?: LoggedInHeaderNavItem[];
  profileMenuItems?: LoggedInHeaderProfileMenuItem[];
  hideActions?: boolean;
  hideMenuButton?: boolean;
  hideResources?: boolean;
  hideNotifications?: boolean;
  hideLogout?: boolean;
  disableSettings?: boolean;
  disableScheduleClosing?: boolean;
  homeHref?: string;
  fullLogoSrc?: string;
  symbolLogoSrc?: string;
  logoAlt?: string;
  viewingModeHref?: string;
}

interface ProfileConfig {
  badgeBg: string;
  badgeColor: string;
  linkLabel: string;
}

interface DropdownItemProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  trailing?: React.ReactNode;
  disabled?: boolean;
}

function getProfileConfig(theme: Theme): Record<string, ProfileConfig> {
  const staffConfig = {
    badgeBg: theme.colors.teal[100],
    badgeColor: theme.colors.teal[700],
    linkLabel: 'View Staff',
  };

  return {
    corporate: staffConfig,
    'law-firm': staffConfig,
    'title-insurance': staffConfig,
    'title-search': staffConfig,
    notary: staffConfig,
    'title-co': staffConfig,
    'licensee-account': staffConfig,
    'super-admin': {
      badgeBg: theme.colors.red[100],
      badgeColor: theme.colors.red[700],
      linkLabel: 'View All Users',
    },
  };
}

function SvgIcon({ size = 20, color = 'currentColor', children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ color, flexShrink: 0 }}
    >
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child as React.ReactElement<{ stroke?: string; fill?: string }>, {
              stroke: (child.props as { stroke?: string }).stroke ?? color,
              fill: (child.props as { fill?: string }).fill ?? 'none',
            })
          : child
      )}
    </svg>
  );
}

function MeterIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M4.5 15.5A7.5 7.5 0 1 1 19.5 15.5" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 15L16 10" strokeWidth="1.8" strokeLinecap="round" />
    </SvgIcon>
  );
}

function PipelineIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M5 7H9.5V11.5H5V7ZM14.5 12.5H19V17H14.5V12.5Z" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M9.5 9.25H12C13.38 9.25 14.5 10.37 14.5 11.75V14.75" strokeWidth="1.8" strokeLinecap="round" />
    </SvgIcon>
  );
}

function UserMultipleIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M9.5 11C11.16 11 12.5 9.66 12.5 8C12.5 6.34 11.16 5 9.5 5C7.84 5 6.5 6.34 6.5 8C6.5 9.66 7.84 11 9.5 11Z" strokeWidth="1.8" />
      <path d="M4.5 19C4.9 16.4 6.65 15 9.5 15C12.35 15 14.1 16.4 14.5 19" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M15 6.25C16.4 6.55 17.25 7.55 17.25 9C17.25 10.45 16.4 11.45 15 11.75M16.5 14.8C18.3 15.35 19.35 16.75 19.5 19" strokeWidth="1.8" strokeLinecap="round" />
    </SvgIcon>
  );
}

function ViewingModeBadge({ config, href = '#' }: { config: ProfileConfig; href?: string }) {
  return (
    <>
      <LIViewingDesktopBox sx={{ display: { xs: 'none', md: 'flex' } }}>
        <LIViewingPill style={{ backgroundColor: config.badgeBg }}>
          <ViewFilledIcon size={16} color={config.badgeColor} />
          <LIViewingText component="span" badgeColor={config.badgeColor}>
            Viewing Mode
          </LIViewingText>
        </LIViewingPill>
        <LIViewingLink href={href}>{config.linkLabel}</LIViewingLink>
      </LIViewingDesktopBox>
      <LIViewingMobilePill
        sx={{ display: { xs: 'inline-flex', md: 'none' } }}
        style={{ backgroundColor: config.badgeBg }}
      >
        <ViewFilledIcon size={16} color={config.badgeColor} />
        <ChevronDownIcon size={16} color={config.badgeColor} />
      </LIViewingMobilePill>
    </>
  );
}

function ProfileImage({ src, userName, size }: { src?: string; userName: string; size: number }) {
  return (
    <ImagePlaceholder
      placeholderType={src ? 'Image' : 'Initials'}
      src={src}
      name={userName}
      alt={userName}
      shape="Circle"
      size={size}
    />
  );
}

function DropdownItem({ icon, label, onClick, trailing, disabled }: DropdownItemProps) {
  if (trailing) {
    return (
      <LIDropdownItem component="div" onClick={disabled ? undefined : onClick}>
        <LIDropdownIconBox>{icon}</LIDropdownIconBox>
        <LIDropdownLabel>{label}</LIDropdownLabel>
        {trailing}
      </LIDropdownItem>
    );
  }

  return (
    <LIDropdownItemBtn
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      aria-disabled={disabled || undefined}
      isDisabled={disabled}
    >
      <LIDropdownIconBox>{icon}</LIDropdownIconBox>
      <LIDropdownLabel>{label}</LIDropdownLabel>
    </LIDropdownItemBtn>
  );
}

function DrawerNav({
  items,
  activeItem,
  onItemClick,
}: {
  items: LoggedInHeaderNavItem[];
  activeItem: string;
  onItemClick: (item: LoggedInHeaderNavItem) => void;
}) {
  const NavDrawerItem = LINavDrawerItem as React.ElementType;

  return (
    <LINavDrawerList>
      {items.map((item) => (
        <NavDrawerItem
          key={item.id}
          component={item.href ? 'a' : 'button'}
          href={item.href}
          isActive={item.id === activeItem}
          disabled={item.disabled}
          onClick={() => onItemClick(item)}
        >
          {item.icon}
          <LINavDrawerItemLabel>{item.label}</LINavDrawerItemLabel>
        </NavDrawerItem>
      ))}
    </LINavDrawerList>
  );
}

export default function LoggedInHeader({
  profileType = 'individual',
  impersonating = false,
  userName = 'Larry Thompson',
  userEmail = 'larry@email.com',
  avatarSrc,
  profileImageSrc,
  breakpoint,
  onMenuClick,
  onDrawerOpenChange,
  onProfileDrawerOpenChange,
  onSendInviteClick,
  onScheduleClosingClick,
  onResourcesClick,
  onNotificationsClick,
  onSettingsClick,
  onAccessibilityClick,
  onLogout,
  onNavItemClick,
  drawerActiveItem = 'dashboard',
  navItems,
  profileMenuItems = [],
  hideActions = false,
  hideMenuButton = false,
  hideResources = false,
  hideNotifications = false,
  hideLogout = false,
  disableSettings = false,
  disableScheduleClosing = false,
  homeHref = '/',
  fullLogoSrc = '/logos/logo-full-blue.svg',
  symbolLogoSrc = '/logos/logo-symbol-blue.svg',
  logoAlt = 'Schedule Closings',
  viewingModeHref = '#',
}: LoggedInHeaderProps) {
  const theme = useTheme();
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);
  const [profileDrawerOpen, setProfileDrawerOpen] = useState(false);
  const { colorMode, toggleColorMode } = useColorMode();
  const darkMode = colorMode === 'dark';
  const menuOpen = Boolean(menuAnchor);

  const showDesktopTablet = breakpoint ? (breakpoint !== 'mobile' ? 'flex' : 'none') : undefined;
  const showMobile = breakpoint ? (breakpoint === 'mobile' ? 'flex' : 'none') : undefined;
  const showDesktopOnly = breakpoint ? (breakpoint === 'desktop' ? 'inline-flex' : 'none') : undefined;
  const showTabletOnly = breakpoint ? (breakpoint === 'tablet' ? 'flex' : 'none') : undefined;

  const profileConfigMap = useMemo(() => getProfileConfig(theme), [theme]);
  const profileConfig = impersonating ? profileConfigMap[profileType] : null;
  const popoverPaperSx = useMemo(() => getPopoverPaperStyles(theme, darkMode), [theme, darkMode]);
  const navDrawerPaperSx = useMemo(() => getNavDrawerPaperStyles(theme), [theme]);
  const profileDrawerPaperSx = useMemo(() => getProfileDrawerPaperStyles(theme), [theme]);
  const fullLogoStyles = useMemo(() => getFullLogoStyles(darkMode), [darkMode]);
  const symbolLogoStyles = useMemo(() => getSymbolLogoStyles(darkMode), [darkMode]);
  const resolvedProfileImageSrc = avatarSrc ?? profileImageSrc;

  const defaultNavItems = useMemo<LoggedInHeaderNavItem[]>(() => [
    { id: 'dashboard', label: 'Dashboard', icon: <MeterIcon size={20} color={theme.semantic.text.primary} /> },
    { id: 'documents', label: 'My Documents', icon: <DocumentMultipleIcon size={20} color={theme.semantic.text.primary} /> },
    { id: 'pipeline', label: 'Pipeline', icon: <PipelineIcon size={20} color={theme.semantic.text.primary} /> },
    { id: 'calendar', label: 'Calendar', icon: <EventScheduleIcon size={20} color={theme.semantic.text.primary} /> },
    { id: 'connections', label: 'Connections', icon: <UserMultipleIcon size={20} color={theme.semantic.text.primary} /> },
    { id: 'settings', label: 'Settings', icon: <SettingsIcon size={20} color={theme.semantic.text.primary} /> },
  ], [theme]);
  const resolvedNavItems = navItems ?? defaultNavItems;

  const handleToggleMenu = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor((prev) => (prev ? null : event.currentTarget));
  }, []);
  const handleCloseMenu = useCallback(() => setMenuAnchor(null), []);
  const openNavDrawer = useCallback(() => {
    setNavDrawerOpen(true);
    onDrawerOpenChange?.(true);
  }, [onDrawerOpenChange]);
  const closeNavDrawer = useCallback(() => {
    setNavDrawerOpen(false);
    onDrawerOpenChange?.(false);
  }, [onDrawerOpenChange]);
  const openProfileDrawer = useCallback(() => {
    setProfileDrawerOpen(true);
    onProfileDrawerOpenChange?.(true);
  }, [onProfileDrawerOpenChange]);
  const handleCloseProfileDrawer = useCallback(() => {
    setProfileDrawerOpen(false);
    onProfileDrawerOpenChange?.(false);
  }, [onProfileDrawerOpenChange]);
  const handleNavItemClick = useCallback((item: LoggedInHeaderNavItem) => {
    item.onClick?.();
    onNavItemClick?.(item);
    closeNavDrawer();
  }, [closeNavDrawer, onNavItemClick]);
  const handleProfileMenuAction = useCallback((action?: () => void) => {
    handleCloseMenu();
    action?.();
  }, [handleCloseMenu]);

  const profileMenu = (
    <>
      <DropdownItem
        icon={<SettingsIcon size={20} color={theme.semantic.text.primary} />}
        label="Settings"
        onClick={() => handleProfileMenuAction(onSettingsClick)}
        disabled={disableSettings}
      />
      <DropdownItem
        icon={<MoonOutlineIcon size={20} color={theme.semantic.text.primary} />}
        label="Dark Mode"
        trailing={<Toggle checked={darkMode} onChange={toggleColorMode} size="sm" />}
        onClick={toggleColorMode}
      />
      <DropdownItem
        icon={<AccessibilityAltIcon size={20} color={theme.semantic.text.primary} />}
        label="Accessibility Options"
        onClick={() => handleProfileMenuAction(onAccessibilityClick)}
      />
      {profileMenuItems.map((item) => (
        <DropdownItem
          key={item.id}
          icon={item.icon ?? <Box aria-hidden="true" sx={{ width: 20, height: 20 }} />}
          label={item.label}
          onClick={() => handleProfileMenuAction(item.onClick)}
          disabled={item.disabled}
        />
      ))}
      {!hideLogout && (
        <DropdownItem
          icon={<LogoutIcon size={20} color={theme.semantic.text.primary} />}
          label="Logout"
          onClick={() => handleProfileMenuAction(onLogout)}
        />
      )}
    </>
  );

  return (
    <LIAppBar position="sticky" elevation={0}>
      <LIOuterContainer maxWidth={false}>
        <LIToolbar disableGutters>
          <LIDesktopTabletRow sx={{ display: showDesktopTablet ?? { xs: 'none', md: 'flex' } }}>
            <LILeftBox>
              <Box component="a" href={homeHref} sx={logoLinkStyles}>
                <Box
                  component="img"
                  src={fullLogoSrc}
                  alt={logoAlt}
                  sx={{ ...fullLogoStyles, display: showDesktopOnly ?? { md: 'none', lg: 'block' } }}
                />
                <Box
                  component="img"
                  src={symbolLogoSrc}
                  alt={logoAlt}
                  sx={{ ...symbolLogoStyles, display: showTabletOnly ?? { md: 'block', lg: 'none' } }}
                />
              </Box>
              {profileConfig && <ViewingModeBadge config={profileConfig} href={viewingModeHref} />}
            </LILeftBox>

            <LIRightBox>
              {!hideActions && (
                <>
                  <BaseButton
                    variant="outline"
                    color="secondary"
                    endIcon={<EmailInviteIcon />}
                    onClick={onSendInviteClick}
                    sx={{ display: showDesktopOnly ?? { md: 'none', lg: 'inline-flex' } }}
                  >
                    Send Invite
                  </BaseButton>
                  <LISendInviteIconBtn
                    aria-label="Send invite"
                    onClick={onSendInviteClick}
                    sx={{ display: showTabletOnly ?? { md: 'flex', lg: 'none' } }}
                  >
                    <EmailInviteIcon color={theme.semantic.secondary.main} />
                  </LISendInviteIconBtn>

                  <BaseButton
                    variant="filled"
                    color="primary"
                    endIcon={<AddIcon />}
                    disabled={disableScheduleClosing}
                    onClick={onScheduleClosingClick}
                    sx={{ display: showDesktopOnly ?? { md: 'none', lg: 'inline-flex' } }}
                  >
                    Schedule Closing
                  </BaseButton>
                  <LIScheduleClosingIconBtn
                    aria-label="Schedule closing"
                    disabled={disableScheduleClosing}
                    onClick={onScheduleClosingClick}
                    sx={{ display: showTabletOnly ?? { md: 'flex', lg: 'none' } }}
                  >
                    <AddIcon color={theme.semantic.primary.contrastText} />
                  </LIScheduleClosingIconBtn>

                  {!hideResources && (
                    <LIResourcesIconBtn aria-label="Resources" onClick={onResourcesClick}>
                      <DocumentMultipleIcon color={theme.semantic.text.secondary} />
                    </LIResourcesIconBtn>
                  )}
                  {!hideNotifications && (
                    <LINotificationsIconBtn
                      data-walkthrough-id="header-notifications"
                      aria-label="Notifications"
                      onClick={onNotificationsClick}
                    >
                      <NotificationIcon size={24} color={theme.semantic.text.secondary} />
                    </LINotificationsIconBtn>
                  )}
                </>
              )}

              <LIProfileButton
                component="button"
                onClick={handleToggleMenu}
                aria-label="Account menu"
                aria-expanded={menuOpen}
                aria-haspopup="true"
              >
                <ProfileImage src={resolvedProfileImageSrc} userName={userName} size={32} />
                {menuOpen
                  ? <ChevronUpIcon size={20} color={theme.semantic.text.primary} />
                  : <ChevronDownIcon size={20} color={theme.semantic.text.primary} />}
              </LIProfileButton>
            </LIRightBox>
          </LIDesktopTabletRow>

          <LIMobileRow sx={{ display: showMobile ?? { xs: 'flex', md: 'none' } }}>
            <LIMobileLeftCol>
              {!hideMenuButton && (
                <LIHamburgerBtn
                  aria-label="Open menu"
                  onClick={() => (onMenuClick ? onMenuClick() : openNavDrawer())}
                >
                  <MenuIcon size={24} color={theme.semantic.text.primary} />
                </LIHamburgerBtn>
              )}
              <Box component="a" href={homeHref} sx={logoLinkStyles}>
                <Box component="img" src={symbolLogoSrc} alt={logoAlt} sx={symbolLogoStyles} />
              </Box>
              {profileConfig && <ViewingModeBadge config={profileConfig} href={viewingModeHref} />}
            </LIMobileLeftCol>

            <LIMobileRightCol>
              {!hideActions && (
                <>
                  <LISendInviteIconBtn
                    aria-label="Send invite"
                    onClick={onSendInviteClick}
                  >
                    <EmailInviteIcon color={theme.semantic.secondary.main} />
                  </LISendInviteIconBtn>
                  <LIScheduleClosingIconBtn
                    aria-label="Schedule closing"
                    disabled={disableScheduleClosing}
                    onClick={onScheduleClosingClick}
                  >
                    <AddIcon color={theme.semantic.primary.contrastText} />
                  </LIScheduleClosingIconBtn>
                  {!hideResources && (
                    <LIResourcesIconBtn aria-label="Resources" onClick={onResourcesClick}>
                      <DocumentMultipleIcon color={theme.semantic.text.secondary} />
                    </LIResourcesIconBtn>
                  )}
                  {!hideNotifications && (
                    <LIMobileNotificationsBtn aria-label="Notifications" onClick={onNotificationsClick}>
                      <NotificationIcon size={24} color={theme.semantic.text.secondary} />
                    </LIMobileNotificationsBtn>
                  )}
                </>
              )}
              <LIProfileButton
                component="button"
                onClick={openProfileDrawer}
                aria-label="Open profile"
                aria-haspopup="true"
              >
                <ProfileImage src={resolvedProfileImageSrc} userName={userName} size={32} />
              </LIProfileButton>
            </LIMobileRightCol>
          </LIMobileRow>
        </LIToolbar>
      </LIOuterContainer>

      <Popover
        open={menuOpen}
        anchorEl={menuAnchor}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { sx: popoverPaperSx } }}
      >
        <LIProfileHeaderBox>
          <ProfileImage src={resolvedProfileImageSrc} userName={userName} size={72} />
          <LIProfileTextCol>
            <LIProfileNameText>{userName}</LIProfileNameText>
            <LIProfileEmailText>{userEmail}</LIProfileEmailText>
          </LIProfileTextCol>
        </LIProfileHeaderBox>
        <LIDividerBox />
        <LIMenuItemsBox>{profileMenu}</LIMenuItemsBox>
      </Popover>

      {!onMenuClick && (
        <Drawer
          anchor="left"
          open={navDrawerOpen}
          onClose={closeNavDrawer}
          PaperProps={{ sx: navDrawerPaperSx }}
        >
          <DrawerNav
            items={resolvedNavItems}
            activeItem={drawerActiveItem}
            onItemClick={handleNavItemClick}
          />
        </Drawer>
      )}

      <Drawer
        anchor="right"
        open={profileDrawerOpen}
        onClose={handleCloseProfileDrawer}
        PaperProps={{ sx: profileDrawerPaperSx }}
      >
        <LIDrawerColumnBox>
          <LIDrawerCloseBar>
            <LICloseIconBtn aria-label="Close profile" onClick={handleCloseProfileDrawer}>
              <CloseIcon size={20} color={theme.semantic.text.secondary} />
            </LICloseIconBtn>
          </LIDrawerCloseBar>
          <LIDrawerProfileHeaderBox>
            <ProfileImage src={resolvedProfileImageSrc} userName={userName} size={72} />
            <LIProfileTextCol>
              <LIProfileNameText>{userName}</LIProfileNameText>
              <LIProfileEmailText>{userEmail}</LIProfileEmailText>
            </LIProfileTextCol>
          </LIDrawerProfileHeaderBox>
          <LIDrawerDividerBox />
          <LIDrawerMenuItemsBox>{profileMenu}</LIDrawerMenuItemsBox>
        </LIDrawerColumnBox>
      </Drawer>
    </LIAppBar>
  );
}

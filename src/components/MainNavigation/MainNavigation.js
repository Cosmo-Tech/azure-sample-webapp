// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { ChevronLeft, ChevronRight, Database, FolderTree, ClipboardList } from 'lucide-react';
import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Box, Drawer, IconButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ConfigService from '../../services/ConfigService';
import { useMainNavigation } from '../../state/mainNavigation/hooks';
import { pictureDark, pictureLight } from '../../theme';
import { NavigationSection } from './components/NavigationSection';
import { ScenarioList } from './components/ScenarioList';
import { UserMenu } from './components/UserMenu';
import { UserProfile } from './components/UserProfile';

const DRAWER_WIDTH = 320;
const DRAWER_WIDTH_COLLAPSED = 64;
const STORAGE_NAV_COLLAPSED_KEY = 'mainNavigationCollapsed';

const NAVIGATION_SECTIONS = [
  { id: 'datasets', label: 'Data', icon: Database },
  { id: 'scenarios', label: 'Scenarios', icon: FolderTree },
  { id: 'scorecard', label: 'Scorecard', icon: ClipboardList },
];

export const MainNavigation = () => {
  const theme = useTheme();

  const {
    sortedScenarioList,
    workspaceId,
    changeScenario,
    isSwitchingScenario,
    noScenario,
    currentScenarioData,
    userEmail,
    userName,
    userProfilePic,
    isDarkTheme,
    activeSection,
  } = useMainNavigation();

  const [isCollapsed, setIsCollapsed] = useState(localStorage.getItem(STORAGE_NAV_COLLAPSED_KEY) === 'true');
  const navigate = useNavigate();

  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const isUserMenuOpen = Boolean(userMenuAnchor);
  const [activeUserMenuItem, setActiveUserMenuItem] = useState('profile');

  const navigationPalette = theme.palette;
  const navColors = {
    background: navigationPalette?.background.background01.main,
    border: navigationPalette?.background.background02.main,
    text: navigationPalette?.secondary.main,
    hoverBg: navigationPalette?.background.background02.main,
    mutedBg: navigationPalette?.neutral.neutral05.main,
    activeBg: navigationPalette?.neutral.neutral04.main,
    activeText: navigationPalette?.neutral.neutral04.main,
    icon: navigationPalette?.secondary.main,
    menuBackground: navigationPalette?.neutral.neutral04.main,
    scrollbarThumb: navigationPalette?.neutral.neutral06.main,
    scrollbarThumbHover: navigationPalette?.neutral.neutral07.main,
  };

  // logo
  const publicUrl = ConfigService.getParameterValue('PUBLIC_URL') ?? '';
  const logoPath = useMemo(
    () => `${publicUrl}${isDarkTheme ? pictureDark.darkLogo : pictureLight.lightLogo}`,
    [isDarkTheme, publicUrl]
  );

  // collapse state persistence
  useEffect(() => {
    localStorage.setItem(STORAGE_NAV_COLLAPSED_KEY, isCollapsed.toString());
  }, [isCollapsed]);

  // drawer width
  const drawerWidth = isCollapsed ? DRAWER_WIDTH_COLLAPSED : DRAWER_WIDTH;

  // CSS var for layout
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty('--main-navigation-width', `${drawerWidth}px`);
    }
  }, [drawerWidth]);

  useEffect(() => {
    return () => {
      if (typeof document !== 'undefined') {
        document.documentElement.style.removeProperty('--main-navigation-width');
      }
    };
  }, []);

  // user menu
  const handleUserMenuClick = (e) => {
    e.stopPropagation();
    setUserMenuAnchor(e.currentTarget);
  };

  const handleUserMenuClose = () => setUserMenuAnchor(null);

  const handleMenuAction = (action) => {
    setActiveUserMenuItem(action);
    handleUserMenuClose();
  };

  const topSections = NAVIGATION_SECTIONS.filter((s) => s.id !== 'scorecard');
  const bottomSections = NAVIGATION_SECTIONS.filter((s) => s.id === 'scorecard');

  // NAV ITEMS RENDER
  const navigationItems = useMemo(
    () => (
      <>
        <NavigationSection
          sections={topSections}
          activeSection={activeSection}
          onSectionChange={(sectionId) => {
            navigate(`/${workspaceId}/${sectionId}`);
          }}
          isCollapsed={isCollapsed}
          currentWorkspaceId={workspaceId}
        />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            minHeight: 0,
            position: 'relative',
          }}
        >
          {activeSection === 'scenarios' && (
            <ScenarioList
              disabled={isSwitchingScenario || noScenario}
              scenarios={sortedScenarioList}
              activeScenarioId={currentScenarioData?.id}
              isCollapsed={isCollapsed}
              currentWorkspaceId={workspaceId}
              onScenarioChange={(scenarioId) => {
                changeScenario(scenarioId);
                navigate(`/${workspaceId}/scenario/${scenarioId}`);
              }}
            />
          )}
          <NavigationSection
            sections={bottomSections}
            activeSection={activeSection}
            isCollapsed={isCollapsed}
            currentWorkspaceId={workspaceId}
            onSectionChange={(sectionId) => {
              navigate(`/${workspaceId}/${sectionId}`);
            }}
          />
        </Box>
      </>
    ),
    [
      activeSection,
      isCollapsed,
      sortedScenarioList,
      currentScenarioData,
      isSwitchingScenario,
      noScenario,
      bottomSections,
      changeScenario,
      topSections,
      workspaceId,
      navigate,
    ]
  );

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        transition: 'width 0.3s ease',
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: navColors.background,
          borderRight: `1px solid ${navColors.border}`,
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          transition: 'width 0.3s ease',
          overflowX: 'hidden',
        },
      }}
    >
      {/* Logo + Collapse */}
      <Box
        sx={{
          paddingTop: 2,
          paddingX: 2,
          paddingBottom: 0,
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: isCollapsed ? 'center' : 'flex-start',
            alignItems: 'center',
            opacity: isCollapsed ? 0 : 1,
            transition: 'opacity 0.3s ease',
            flex: 1,
          }}
        >
          <img
            alt="Cosmo Tech"
            src={logoPath}
            style={{
              height: '32px',
              maxWidth: '100%',
              objectFit: 'contain',
            }}
          />
        </Box>

        <IconButton
          onClick={() => setIsCollapsed(!isCollapsed)}
          size="small"
          sx={{
            position: isCollapsed ? 'relative' : 'absolute',
            right: isCollapsed ? 0 : 2,
            color: navColors.text,
            marginLeft: isCollapsed ? 0 : 4,
            '&:hover': {
              backgroundColor: navColors.hoverBg,
            },
          }}
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </IconButton>
      </Box>

      {/* Navigation Items */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          minHeight: 0,
          paddingTop: isCollapsed ? 2 : 8,
        }}
      >
        {workspaceId != null && navigationItems}
      </Box>

      {/* User Profile */}
      <UserProfile
        userName={userName}
        userEmail={userEmail}
        userProfilePic={userProfilePic}
        isCollapsed={isCollapsed}
        onUserMenuClick={handleUserMenuClick}
        isUserMenuOpen={isUserMenuOpen}
      />

      <UserMenu
        anchorEl={userMenuAnchor}
        open={isUserMenuOpen}
        onClose={handleUserMenuClose}
        userName={userName}
        userEmail={userEmail}
        activeUserMenuItem={activeUserMenuItem}
        onMenuAction={handleMenuAction}
      />
    </Drawer>
  );
};

MainNavigation.propTypes = {
  onSectionChange: PropTypes.func,
  onDrawerWidthChange: PropTypes.func,
};

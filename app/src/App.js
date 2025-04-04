import { useState, useEffect, useMemo } from 'react';

// react-router components
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

// @mui material components
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Icon from '@mui/material/Icon';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

// Material Dashboard 2 React components
import MDBox from 'components/MDBox';

// Material Dashboard 2 React example components
import Sidenav from 'examples/Sidenav';
import Configurator from 'examples/Configurator';

// Material Dashboard 2 React themes
import theme from 'assets/theme';
import themeRTL from 'assets/theme/theme-rtl';

// Material Dashboard 2 React Dark Mode themes
import themeDark from 'assets/theme-dark';
import themeDarkRTL from 'assets/theme-dark/theme-rtl';

// RTL plugins
import rtlPlugin from 'stylis-plugin-rtl';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';

// Material Dashboard 2 React routes
import routes from 'routes';

// Material Dashboard 2 React contexts
import { useMaterialUIController, setMiniSidenav, setOpenConfigurator } from 'context';

// Auth context and components
import { AuthProvider, useAuth } from 'context/AuthContext';
import ProtectedRoute from 'components/auth/ProtectedRoute';
import PrivateRoute from './components/auth/PrivateRoute';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import Dashboard from './components/dashboard/Dashboard';
import Profile from './components/profile/Profile';
import Navbar from './components/layout/Navbar';
import NutritionGuide from './components/nutrition/NutritionGuide';

// Auth Service for initialization
import authService from './services/authService';

// Images
import brandWhite from 'assets/images/logo-ct.png';
import brandDark from 'assets/images/logo-ct-dark.png';

// We'll eliminate the asynchronous initialization here as it's unreliable
// The AuthProvider will handle initialization instead
console.log('App component loaded, initialization will be handled by AuthProvider');

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

const AppContent = () => {
  const [controller, dispatch] = useMaterialUIController();
  const {
    miniSidenav,
    direction,
    layout,
    openConfigurator,
    sidenavColor,
    transparentSidenav,
    whiteSidenav,
    darkMode,
    invertColors,
    fontSize,
  } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const [rtlCache, setRtlCache] = useState(null);
  const { pathname } = useLocation();
  const { user, loading } = useAuth();

  // Cache for the rtl
  useMemo(() => {
    const cacheRtl = createCache({
      key: 'rtl',
      stylisPlugins: [rtlPlugin],
    });

    setRtlCache(cacheRtl);
  }, []);

  // Open sidenav when mouse enter on mini sidenav
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  // Close sidenav when mouse leave mini sidenav
  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  // Change the openConfigurator state
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);

  // Setting the dir attribute for the body element
  useEffect(() => {
    document.body.setAttribute('dir', direction);
  }, [direction]);

  // Apply font size scaling to the entire document
  useEffect(() => {
    try {
      // Create a custom stylesheet for accessibility features
      let styleSheet = document.getElementById('accessibility-styles');
      if (!styleSheet) {
        styleSheet = document.createElement('style');
        styleSheet.id = 'accessibility-styles';
        document.head.appendChild(styleSheet);
      }

      // Define a scaling approach that maintains proportions better
      styleSheet.innerHTML = `
        :root {
          --font-scale: ${fontSize};
        }
        
        /* Set base font size on html */
        html {
          font-size: ${fontSize}rem !important;
        }
        
        /* Adjust spacing and layout elements to maintain proportions */
        .MuiBox-root, .MuiContainer-root, .MuiPaper-root {
          max-width: calc(100% - ${(fontSize - 1) * 2}rem) !important;
        }
        
        /* Adjust margins and paddings based on font size */
        .MuiCardContent-root, .MuiCardHeader-root, .MuiListItem-root {
          padding: calc(${fontSize} * 0.75rem) !important;
        }
        
        /* Ensure line heights adjust with font size */
        body, p, h1, h2, h3, h4, h5, h6, .MuiTypography-root {
          line-height: calc(1.5 * ${0.8 + fontSize * 0.2}) !important;
        }
        
        /* Help maintain overall layout with larger fonts */
        @media (max-width: 900px) {
          .MuiGrid-container {
            flex-direction: column !important;
          }
          
          .MuiGrid-item {
            width: 100% !important;
            max-width: 100% !important;
            flex-basis: 100% !important;
          }
        }
      `;
    } catch (error) {
      console.error('Error applying font size scaling:', error);
    }
  }, [fontSize]);

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }

      if (route.route) {
        if (route.noAuth) {
          return <Route exact path={route.route} element={route.component} key={route.key} />;
        }
        return (
          <Route
            exact
            path={route.route}
            element={<PrivateRoute>{route.component}</PrivateRoute>}
            key={route.key}
          />
        );
      }

      return null;
    });

  const configsButton = (
    <MDBox
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="3.25rem"
      height="3.25rem"
      bgColor="white"
      shadow="sm"
      borderRadius="50%"
      position="fixed"
      right="2rem"
      bottom="2rem"
      zIndex={99}
      color="dark"
      sx={{ cursor: 'pointer' }}
      onClick={handleConfiguratorOpen}
    >
      <Icon fontSize="small" color="inherit">
        settings
      </Icon>
    </MDBox>
  );

  const renderApp = () => (
    <Box
      sx={{
        filter: invertColors ? 'invert(100%)' : 'none',
      }}
    >
      {layout === 'dashboard' &&
        pathname !== '/landing' &&
        pathname !== '/signin' &&
        pathname !== '/signup' && (
          <>
            <Sidenav
              color={sidenavColor}
              brand=""
              brandName="FitVice"
              routes={routes}
              onMouseEnter={handleOnMouseEnter}
              onMouseLeave={handleOnMouseLeave}
            />
            <Configurator />
            {configsButton}
          </>
        )}
      {layout === 'vr' && <Configurator />}
      <Routes>
        {getRoutes(routes)}
        <Route 
          path="/signin" 
          element={
            loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
              </Box>
            ) : user ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <SignIn />
            )
          } 
        />
        <Route 
          path="/signup" 
          element={
            loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
              </Box>
            ) : user ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <SignUp />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/nutrition"
          element={
            <PrivateRoute>
              <NutritionGuide />
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Navigate to="/landing" replace />} />
        <Route path="*" element={<Navigate to="/landing" />} />
      </Routes>
    </Box>
  );

  return (
    <>
      {direction === 'rtl' ? (
        <CacheProvider value={rtlCache}>
          <ThemeProvider theme={darkMode ? themeDarkRTL : themeRTL}>
            <CssBaseline />
            {user &&
              pathname !== '/landing' &&
              pathname !== '/signin' &&
              pathname !== '/signup' && <Navbar />}
            {renderApp()}
          </ThemeProvider>
        </CacheProvider>
      ) : (
        <ThemeProvider theme={darkMode ? themeDark : theme}>
          <CssBaseline />
          {user && pathname !== '/landing' && pathname !== '/signin' && pathname !== '/signup' && (
            <Navbar />
          )}
          {renderApp()}
        </ThemeProvider>
      )}
    </>
  );
};

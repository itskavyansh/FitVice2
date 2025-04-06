import { useState, useEffect, useMemo, forwardRef } from 'react';

// react-router components
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';

// @mui material components
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Icon from '@mui/material/Icon';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import Slide from '@mui/material/Slide';

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
import Navbar from './components/layout/Navbar';
import NutritionGuide from './components/nutrition/NutritionGuide';
import JarvisChat from './components/JarvisChat';

// Chatbot layout
import ChatbotContent from 'layouts/chatbot';

// Auth Service for initialization
import authService from './services/authService';

// Images
import brandWhite from 'assets/images/logo-ct.png';
import brandDark from 'assets/images/logo-ct-dark.png';

// Custom chatbot button styles
const chatButtonStyles = `
  .chat-button {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background-color: #4caf50;
    border: none;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 20px 0 rgba(76, 175, 80, 0.3);
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.34, 1.61, 0.7, 1);
    overflow: hidden;
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    z-index: 99;
  }

  .chat-button:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 30px 0 rgba(76, 175, 80, 0.4);
  }

  .chat-button-icon {
    width: 28px;
    height: 28px;
    transition: transform 0.3s ease;
  }

  .chat-button-icon path {
    fill: white;
  }

  .chat-button:hover .chat-button-icon {
    transform: scale(1.1);
  }
`;

// Transition component for the chatbot dialog
const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// We'll eliminate the asynchronous initialization here as it's unreliable
// The AuthProvider will handle initialization instead
console.log('App component loaded, initialization will be handled by AuthProvider');

import { JarvisProvider } from './context/JarvisContext';
import ExerciseDetails from 'layouts/muscle-pedia/exercise-details';
import MusclePedia from 'layouts/muscle-pedia';
import Chatbot from 'layouts/chatbot';
import AuthCallback from './components/auth/AuthCallback';

export default function App() {
  return (
    <AuthProvider>
      <JarvisProvider>
        <AppContent />
      </JarvisProvider>
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
  const [openChatbot, setOpenChatbot] = useState(false);
  const { pathname } = useLocation();
  const { user, loading } = useAuth();
  const navigate = useNavigate();

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

  // Handle chatbot dialog open/close
  const handleChatbotToggle = () => {
    setOpenChatbot(!openChatbot);
  };

  // Navigate to the full chatbot page
  const handleNavigateToChatbot = () => {
    setOpenChatbot(false);
    navigate('/chatbot');
  };

  // Setting the dir attribute for the body element
  useEffect(() => {
    document.body.setAttribute('dir', direction);
  }, [direction]);

  // Apply the chatbot button styles
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.id = 'chatbot-button-styles';
    styleElement.innerHTML = chatButtonStyles;
    document.head.appendChild(styleElement);

    return () => {
      const element = document.getElementById('chatbot-button-styles');
      if (element) element.remove();
    };
  }, []);

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

  // Chatbot floating button
  const chatbotButton = (
    <button className="chat-button" onClick={handleChatbotToggle}>
      <svg className="chat-button-icon" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-13c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z"></path>
      </svg>
    </button>
  );

  // Chatbot dialog
  const chatbotDialog = (
    <Dialog
      open={openChatbot}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleChatbotToggle}
      aria-describedby="chatbot-dialog-slide"
      maxWidth="sm"
      fullWidth={false}
      sx={{
        '& .MuiDialog-container': {
          alignItems: 'flex-end',
          justifyContent: 'flex-end',
        },
        '& .MuiDialog-paper': {
          height: '600px',
          width: '420px',
          maxWidth: '95vw',
          maxHeight: '85vh',
          margin: '0 16px 16px 0',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
          overflow: 'hidden',
          transition: 'all 0.3s cubic-bezier(0.34, 1.61, 0.7, 1)',
          bgcolor: 'background.paper',
        },
      }}
    >
      <DialogContent sx={{ p: 0, overflow: 'hidden', height: '100%' }}>
        <JarvisChat />
      </DialogContent>
    </Dialog>
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
            {user && chatbotButton}
            {chatbotDialog}
          </>
        )}
      {layout === 'vr' && <Configurator />}
      <Routes>
        {getRoutes(routes)}
        <Route
          path="/signin"
          element={
            loading ? (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100vh',
                }}
              >
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
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100vh',
                }}
              >
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
          path="/muscle-pedia"
          element={
            <PrivateRoute>
              <MusclePedia />
            </PrivateRoute>
          }
        />
        <Route
          path="/muscle-pedia/:muscleName"
          element={
            <PrivateRoute>
              <ExerciseDetails />
            </PrivateRoute>
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
          path="/nutrition"
          element={
            <PrivateRoute>
              <NutritionGuide />
            </PrivateRoute>
          }
        />
        <Route
          path="/chatbot"
          element={
            <PrivateRoute>
              <Chatbot />
            </PrivateRoute>
          }
        />
        <Route path="/auth/callback" element={<AuthCallback />} />
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

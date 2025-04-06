import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Suspense } from 'react';
import Box from '@mui/material/Box';
import Icon from '@mui/material/Icon';

// Material Dashboard 2 React components
import MDBox from 'components/MDBox';

// Material Dashboard 2 React example components
import Sidenav from 'examples/Sidenav';
import Configurator from 'examples/Configurator';

// Material Dashboard 2 React themes
import theme from 'assets/theme';

// Components
import { AuthProvider } from './context/AuthContext';
import { JarvisProvider } from './context/JarvisContext';
import { LoadingProvider } from './context/LoadingContext';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingScreen from './components/LoadingScreen';
import ProtectedRoute from './components/auth/ProtectedRoute';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import Dashboard from './components/dashboard/Dashboard';
import Profile from './components/profile/Profile';
import Navbar from './components/layout/Navbar';
import NutritionGuide from './components/nutrition/NutritionGuide';
import JarvisChat from './components/JarvisChat';

// Images
import brandWhite from 'assets/images/logo-ct.png';
import brandDark from 'assets/images/logo-ct-dark.png';

// Material Dashboard 2 React contexts
import { useMaterialUIController, setMiniSidenav, setOpenConfigurator } from 'context';

function MainLayout() {
  const [controller, dispatch] = useMaterialUIController();
  const {
    miniSidenav,
    layout,
    openConfigurator,
    sidenavColor,
    transparentSidenav,
    whiteSidenav,
    darkMode,
  } = controller;

  // Handle sidenav toggling
  const handleOnMouseEnter = () => {
    if (miniSidenav && !layout.includes('mini')) {
      setMiniSidenav(dispatch, false);
    }
  };

  const handleOnMouseLeave = () => {
    if (miniSidenav && !layout.includes('mini')) {
      setMiniSidenav(dispatch, true);
    }
  };

  // Change the openConfigurator state
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);

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

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidenav
        color={sidenavColor}
        brand={darkMode ? brandWhite : brandDark}
        brandName="FitVice"
        routes={[]}
        onMouseEnter={handleOnMouseEnter}
        onMouseLeave={handleOnMouseLeave}
      />
      <Box
        sx={{
          flexGrow: 1,
          minHeight: '100vh',
          backgroundColor: darkMode ? '#121212' : '#f0f2f5',
        }}
      >
        <Navbar />
        <Box sx={{ p: 3 }}>
          <Routes>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/nutrition"
              element={
                <ProtectedRoute>
                  <NutritionGuide />
                </ProtectedRoute>
              }
            />
            <Route
              path="/jarvis"
              element={
                <ProtectedRoute>
                  <JarvisChat />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Box>
      </Box>
      {configsButton}
      <Configurator />
    </Box>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary>
        <LoadingProvider>
          <AuthProvider>
            <JarvisProvider>
              <Suspense fallback={<LoadingScreen />}>
                <MainLayout />
              </Suspense>
            </JarvisProvider>
          </AuthProvider>
        </LoadingProvider>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;

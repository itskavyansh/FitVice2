// Configurator Root Component
// Styled drawer component for theme configuration panel

import { styled } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';

const ConfiguratorRoot = styled(Drawer)(({ theme, ownerState }) => ({
  width: 280,
  position: 'fixed',
  zIndex: 1200,
  height: '100vh',
  margin: 0,
  padding: 0,
  border: 'none',
  transition: theme.transitions.create('transform', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.short,
  }),
  transform: ownerState.openConfigurator ? 'translateX(0)' : 'translateX(280px)',

  '& .MuiDrawer-paper': {
    width: 280,
    height: '100vh',
    margin: 0,
    padding: 0,
    border: 'none',
    background:
      theme.palette.mode === 'dark' ? theme.palette.background.default : theme.palette.white.main,
  },
}));

export default ConfiguratorRoot;

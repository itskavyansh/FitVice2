// Sidenav Root Component
// Styled wrapper for the sidenav with theme-aware styling

import { styled } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';

const SidenavRoot = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary,
  },
}));

export default SidenavRoot;

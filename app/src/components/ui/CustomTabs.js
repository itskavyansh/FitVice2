// Custom Tabs Component
// Enhanced tab navigation with animations and responsive design

import React from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledTabs = styled(Tabs)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  '& .MuiTabs-indicator': {
    backgroundColor: theme.palette.primary.main,
    height: 3,
  },
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: 'none',
  minWidth: 0,
  padding: theme.spacing(1.5),
  [theme.breakpoints.up('sm')]: {
    minWidth: 0,
  },
}));

function TabPanel({ children, value, index, ...props }) {
  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...props}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Box>
  );
}

function CustomTabs({ tabs, value, onChange, ...props }) {
  return (
    <Box>
      <StyledTabs
        value={value}
        onChange={onChange}
        variant="scrollable"
        scrollButtons="auto"
        {...props}
      >
        {tabs.map((tab, index) => (
          <StyledTab key={index} label={tab.label} icon={tab.icon} disabled={tab.disabled} />
        ))}
      </StyledTabs>
      {tabs.map((tab, index) => (
        <TabPanel key={index} value={value} index={index}>
          {tab.content}
        </TabPanel>
      ))}
    </Box>
  );
}

export default CustomTabs;

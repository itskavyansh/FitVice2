/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import { styled } from '@mui/material/styles';

// Material Dashboard 2 React components
import MDBox from 'components/MDBox';

export default styled(MDBox)(({ theme, ownerState }) => {
  const { borders } = theme;
  const { darkMode } = ownerState;

  return {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderTop: darkMode ? 'none' : `${borders.borderWidth[1]} solid ${borders.borderColor}`,
  };
});

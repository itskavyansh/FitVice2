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

// prop-types is a library for typechecking of props
import PropTypes from 'prop-types';

// Material Dashboard 2 React components
import MDBox from 'components/MDBox';

function Timeline({ children, dark }) {
  return (
    <MDBox
      p={2}
      position="relative"
      sx={{
        backgroundColor: dark ? 'rgba(30, 30, 30, 0.8)' : 'transparent',
        borderRadius: 2,
      }}
    >
      {children}
    </MDBox>
  );
}

// Setting default values for the props of Timeline
Timeline.defaultProps = {
  dark: false,
};

// Typechecking props for the Timeline
Timeline.propTypes = {
  children: PropTypes.node.isRequired,
  dark: PropTypes.bool,
};

export default Timeline;

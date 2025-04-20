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

// @mui material components
import Icon from '@mui/material/Icon';

// Material Dashboard 2 React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';

// Custom styles for the TimelineItem
import timelineItem from 'examples/Timeline/TimelineItem/styles';

function TimelineItem({ color, icon, title, dateTime, lastItem }) {
  return (
    <MDBox position="relative" mb={!lastItem && 3} sx={(theme) => ({
      "&:after": {
        content: !lastItem && "''",
        position: "absolute",
        top: 0,
        left: "14px",
        height: "100%",
        width: "2px",
        backgroundColor: "lightgray",
        transform: "translateX(-50%)"
      },
      ...timelineItem(theme),
    })}>
      <MDBox
        display="flex"
        justifyContent="center"
        alignItems="center"
        bgcolor={color}
        color="white"
        width="30px"
        height="30px"
        borderRadius="50%"
        position="absolute"
        top="0.25rem"
        left="1.6%"
        zIndex={2}
        sx={{ fontSize: ({ typography: { size } }) => size.sm }}
        className="timeline-icon"
      >
        <Icon fontSize="inherit">{icon}</Icon>
      </MDBox>
      <MDBox ml={5.75} pt={0.5} lineHeight={0} maxWidth="30rem">
        <MDTypography variant="button" fontWeight="medium" color="text">
          {title}
        </MDTypography>
        <MDBox mt={0.5}>
          <MDTypography variant="caption" color="text">
            {dateTime}
          </MDTypography>
        </MDBox>
      </MDBox>
    </MDBox>
  );
}

// Setting default values for the props of TimelineItem
TimelineItem.defaultProps = {
  color: "info",
  lastItem: false,
};

// Typechecking props for the TimelineItem
TimelineItem.propTypes = {
  color: PropTypes.oneOf([
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
    "dark",
    "light",
  ]),
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  dateTime: PropTypes.string.isRequired,
  lastItem: PropTypes.bool,
};

export default TimelineItem; 
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
import Card from '@mui/material/Card';
import Icon from '@mui/material/Icon';

// Material Dashboard 2 React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';

function OrdersOverview() {
  return (
    <Card sx={{ height: '100%' }}>
      <MDBox pt={3} px={3}>
        <MDTypography variant="h6" fontWeight="medium">
          Health Tips & Nutrition
        </MDTypography>
        <MDBox mt={0} mb={2}>
          <MDTypography variant="button" color="text" fontWeight="regular">
            <MDTypography display="inline" variant="body2" verticalAlign="middle">
              <Icon sx={{ color: ({ palette: { success } }) => success.main }}>arrow_upward</Icon>
            </MDTypography>
            &nbsp;
            <MDTypography variant="button" color="text" fontWeight="medium">
              5 new tips
            </MDTypography>{' '}
            this week
          </MDTypography>
        </MDBox>
      </MDBox>
      <MDBox p={2}>
        <MDBox mb={3} display="flex" alignItems="center">
          <MDBox
            width="3rem"
            height="3rem"
            bgColor="info"
            variant="gradient"
            borderRadius="50%"
            display="flex"
            justifyContent="center"
            alignItems="center"
            shadow="md"
          >
            <Icon sx={{ color: 'white', fontSize: '1.5rem' }}>restaurant_menu</Icon>
          </MDBox>
          <MDBox ml={2}>
            <MDTypography variant="h6" fontWeight="medium">
              Healthy Breakfast Ideas
            </MDTypography>
            <MDTypography variant="caption" color="text">
              Start your day with nutritious options
            </MDTypography>
          </MDBox>
        </MDBox>

        <MDBox mb={3} display="flex" alignItems="center">
          <MDBox
            width="3rem"
            height="3rem"
            bgColor="error"
            variant="gradient"
            borderRadius="50%"
            display="flex"
            justifyContent="center"
            alignItems="center"
            shadow="md"
          >
            <Icon sx={{ color: 'white', fontSize: '1.5rem' }}>fitness_center</Icon>
          </MDBox>
          <MDBox ml={2}>
            <MDTypography variant="h6" fontWeight="medium">
              Pre-workout Nutrition
            </MDTypography>
            <MDTypography variant="caption" color="text">
              Fuel your workouts properly
            </MDTypography>
          </MDBox>
        </MDBox>

        <MDBox mb={3} display="flex" alignItems="center">
          <MDBox
            width="3rem"
            height="3rem"
            bgColor="info"
            variant="gradient"
            borderRadius="50%"
            display="flex"
            justifyContent="center"
            alignItems="center"
            shadow="md"
          >
            <Icon sx={{ color: 'white', fontSize: '1.5rem' }}>self_improvement</Icon>
          </MDBox>
          <MDBox ml={2}>
            <MDTypography variant="h6" fontWeight="medium">
              Stress Management
            </MDTypography>
            <MDTypography variant="caption" color="text">
              Balance mind and body wellness
            </MDTypography>
          </MDBox>
        </MDBox>

        <MDBox mb={3} display="flex" alignItems="center">
          <MDBox
            width="3rem"
            height="3rem"
            bgColor="warning"
            variant="gradient"
            borderRadius="50%"
            display="flex"
            justifyContent="center"
            alignItems="center"
            shadow="md"
          >
            <Icon sx={{ color: 'white', fontSize: '1.5rem' }}>health_and_safety</Icon>
          </MDBox>
          <MDBox ml={2}>
            <MDTypography variant="h6" fontWeight="medium">
              Hydration Guidelines
            </MDTypography>
            <MDTypography variant="caption" color="text">
              Stay hydrated throughout the day
            </MDTypography>
          </MDBox>
        </MDBox>

        <MDBox display="flex" alignItems="center">
          <MDBox
            width="3rem"
            height="3rem"
            bgColor="success"
            variant="gradient"
            borderRadius="50%"
            display="flex"
            justifyContent="center"
            alignItems="center"
            shadow="md"
          >
            <Icon sx={{ color: 'white', fontSize: '1.5rem' }}>restaurant</Icon>
          </MDBox>
          <MDBox ml={2}>
            <MDTypography variant="h6" fontWeight="medium">
              Post-workout Nutrition
            </MDTypography>
            <MDTypography variant="caption" color="text">
              Optimize recovery with proper meals
            </MDTypography>
          </MDBox>
        </MDBox>
      </MDBox>
    </Card>
  );
}

export default OrdersOverview;

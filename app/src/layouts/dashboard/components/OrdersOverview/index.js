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

// Material Dashboard 2 React example components
import TimelineItem from 'examples/Timeline/TimelineItem';

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
        <TimelineItem
          color="success"
          icon="restaurant_menu"
          title="Healthy Breakfast Ideas"
          dateTime="Today 7:20 AM"
        />
        <TimelineItem
          color="error"
          icon="fitness_center"
          title="Pre-workout Nutrition Guide"
          dateTime="Yesterday 11:00 AM"
        />
        <TimelineItem
          color="info"
          icon="self_improvement"
          title="Stress Management Tips"
          dateTime="Yesterday 9:34 PM"
        />
        <TimelineItem
          color="warning"
          icon="health_and_safety"
          title="Hydration Guidelines"
          dateTime="2 days ago 2:20 PM"
        />
        <TimelineItem
          color="primary"
          icon="restaurant"
          title="Post-workout Meal Plans"
          dateTime="3 days ago 4:54 PM"
          lastItem
        />
      </MDBox>
    </Card>
  );
}

export default OrdersOverview;

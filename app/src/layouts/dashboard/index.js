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
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Icon from '@mui/material/Icon';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';

// Material Dashboard 2 React components
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';

// Material Dashboard 2 React example components
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import Footer from 'examples/Footer';
import ReportsBarChart from 'examples/Charts/BarCharts/ReportsBarChart';
import ReportsLineChart from 'examples/Charts/LineCharts/ReportsLineChart';
import ComplexStatisticsCard from 'examples/Cards/StatisticsCards/ComplexStatisticsCard';

// Data
import reportsBarChartData from 'layouts/dashboard/data/reportsBarChartData';
import reportsLineChartData from 'layouts/dashboard/data/reportsLineChartData';

// Dashboard components
import Projects from 'layouts/dashboard/components/Projects';
import OrdersOverview from 'layouts/dashboard/components/OrdersOverview';

// Styled components
const EnhancedCard = styled(Card)(({ theme }) => ({
  transition: 'all 0.3s ease',
  overflow: 'hidden',
  position: 'relative',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    '&::before': {
      opacity: 1,
    },
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    left: 0,
    top: 0,
    width: '4px',
    height: '100%',
    background: `linear-gradient(to bottom, ${theme.palette.primary.main}, ${theme.palette.info.main})`,
    opacity: 0.7,
    transition: 'opacity 0.3s ease',
  },
}));

const EnhancedChartCard = styled(Card)(({ theme }) => ({
  transition: 'all 0.3s ease',
  overflow: 'hidden',
  position: 'relative',
  '&:hover': {
    transform: 'translateY(-5px) scale(1.01)',
    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.12)',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '3px',
    background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.info.main})`,
    transition: 'opacity 0.3s ease',
  },
}));

function Dashboard() {
  const { sales, tasks } = reportsLineChartData;

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="fitness_center"
                title="Active Workouts"
                count={281}
                percentage={{
                  color: 'success',
                  amount: '+15%',
                  label: 'than last week',
                }}
                sx={{
                  '& .MuiBox-root': {
                    transition: 'all 0.3s ease',
                  },
                  '&:hover .MuiBox-root': {
                    transform: 'scale(1.03)',
                  },
                  '& .MuiIcon-root': {
                    transition: 'all 0.3s ease',
                  },
                  '&:hover .MuiIcon-root': {
                    transform: 'rotate(10deg) scale(1.2)',
                  },
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="self_improvement"
                title="Yoga Sessions"
                count="2,300"
                percentage={{
                  color: 'success',
                  amount: '+8%',
                  label: 'than last month',
                }}
                sx={{
                  '& .MuiBox-root': {
                    transition: 'all 0.3s ease',
                  },
                  '&:hover .MuiBox-root': {
                    transform: 'scale(1.03)',
                  },
                  '& .MuiIcon-root': {
                    transition: 'all 0.3s ease',
                  },
                  '&:hover .MuiIcon-root': {
                    transform: 'rotate(-10deg) scale(1.2)',
                  },
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="health_and_safety"
                title="Health Tips"
                count="34"
                percentage={{
                  color: 'success',
                  amount: '+5%',
                  label: 'new tips added',
                }}
                sx={{
                  '& .MuiBox-root': {
                    transition: 'all 0.3s ease',
                  },
                  '&:hover .MuiBox-root': {
                    transform: 'scale(1.03)',
                  },
                  '& .MuiIcon-root': {
                    transition: 'all 0.3s ease',
                  },
                  '&:hover .MuiIcon-root': {
                    transform: 'rotate(10deg) scale(1.2)',
                  },
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="restaurant_menu"
                title="Nutrition Plans"
                count="+12"
                percentage={{
                  color: 'success',
                  amount: '',
                  label: 'Just updated',
                }}
                sx={{
                  '& .MuiBox-root': {
                    transition: 'all 0.3s ease',
                  },
                  '&:hover .MuiBox-root': {
                    transform: 'scale(1.03)',
                  },
                  '& .MuiIcon-root': {
                    transition: 'all 0.3s ease',
                  },
                  '&:hover .MuiIcon-root': {
                    transform: 'rotate(-10deg) scale(1.2)',
                  },
                }}
              />
            </MDBox>
          </Grid>
        </Grid>

        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <EnhancedChartCard>
                  <ReportsBarChart
                    color="info"
                    title="Workout Engagement"
                    description="Weekly Activity Overview"
                    date="updated 2 days ago"
                    chart={reportsBarChartData}
                  />
                </EnhancedChartCard>
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <EnhancedChartCard>
                  <ReportsLineChart
                    color="success"
                    title="Yoga Attendance"
                    description={
                      <>
                        (<strong>+20%</strong>) increase in yoga class attendance.
                      </>
                    }
                    date="updated 4 min ago"
                    chart={sales}
                  />
                </EnhancedChartCard>
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <EnhancedChartCard>
                  <ReportsLineChart
                    color="dark"
                    title="Health Goals"
                    description="Monthly Progress"
                    date="just updated"
                    chart={tasks}
                  />
                </EnhancedChartCard>
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
        <MDBox>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={8}>
              <EnhancedCard>
                <Projects />
              </EnhancedCard>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <EnhancedCard>
                <OrdersOverview />
              </EnhancedCard>
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;

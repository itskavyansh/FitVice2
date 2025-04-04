/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================
*/

// @mui material components
import Grid from '@mui/material/Grid';

// Material Dashboard 2 React components
import MDBox from 'components/MDBox';

// Material Dashboard 2 React example components
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import Footer from 'examples/Footer';

function HealthTips() {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <MDBox>
              <h1>Health Tips</h1>
              {/* Add your health tips content here */}
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default HealthTips;

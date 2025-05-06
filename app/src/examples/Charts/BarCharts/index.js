// Bar Charts Component
// Reusable bar chart component with customizable styling and data visualization

import PropTypes from 'prop-types';
import { Bar } from 'react-chartjs-2';
import MDBox from 'components/MDBox';

function BarCharts({ data, options }) {
  return (
    <MDBox>
      <Bar data={data} options={options} />
    </MDBox>
  );
}

BarCharts.propTypes = {
  data: PropTypes.object.isRequired,
  options: PropTypes.object,
};

export default BarCharts;

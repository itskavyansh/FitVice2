// Line Charts Component
// Reusable line chart component with customizable styling and data mapping

import PropTypes from 'prop-types';
import { Line } from 'react-chartjs-2';
import MDBox from 'components/MDBox';

function LineCharts({ data, options }) {
  return (
    <MDBox>
      <Line data={data} options={options} />
    </MDBox>
  );
}

LineCharts.propTypes = {
  data: PropTypes.object.isRequired,
  options: PropTypes.object,
};

LineCharts.defaultProps = {
  options: {},
};

export default LineCharts;

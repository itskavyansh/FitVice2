// Card Component
// Customizable card container with material design styling

import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import MDBox from 'components/MDBox';

function CustomCard({ children, ...rest }) {
  return (
    <Card {...rest}>
      <MDBox p={2}>{children}</MDBox>
    </Card>
  );
}

CustomCard.propTypes = {
  children: PropTypes.node.isRequired,
};

export default CustomCard;

// Item Component
// Reusable list item with customizable icon and content

import PropTypes from 'prop-types';
import Icon from '@mui/material/Icon';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';

function Item({ icon, content }) {
  return (
    <MDBox display="flex" alignItems="center">
      <Icon>{icon}</Icon>
      <MDTypography variant="button" fontWeight="regular" ml={1}>
        {content}
      </MDTypography>
    </MDBox>
  );
}

Item.propTypes = {
  icon: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
};

export default Item;

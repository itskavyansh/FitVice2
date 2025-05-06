// Data Table Body Cell Component
// Table cell with customizable alignment and border options

import PropTypes from 'prop-types';
import MDBox from 'components/MDBox';

function DataTableBodyCell({ align, noBorder, children }) {
  return (
    <MDBox
      component="td"
      textAlign={align}
      py={1.5}
      px={3}
      sx={{
        borderBottom: noBorder ? 'none' : '1px solid #e0e0e0',
      }}
    >
      {children}
    </MDBox>
  );
}

// Typechecking props for the DataTableBodyCell
DataTableBodyCell.propTypes = {
  align: PropTypes.oneOf(['left', 'center', 'right']),
  noBorder: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

export default DataTableBodyCell;

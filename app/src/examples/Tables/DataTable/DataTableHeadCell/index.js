// Data Table Head Cell Component
// Sortable table header cell with customizable alignment

import PropTypes from 'prop-types';
import Icon from '@mui/material/Icon';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';

// DataTableHeadCell component
function DataTableHeadCell({ align, children, sorted, sortingDirection }) {
  return (
    <MDBox
      component="th"
      width="auto"
      textAlign={align}
      verticalAlign="middle"
      px={1}
      py={1}
      sx={{ borderBottom: '1px solid #e0e0e0' }}
    >
      <MDTypography
        variant="caption"
        fontWeight="medium"
        color="text"
        textTransform="uppercase"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: align === 'right' ? 'flex-end' : 'flex-start',
        }}
      >
        {children}
        {sorted && (
          <Icon
            sx={{
              fontSize: '1rem',
              marginLeft: align === 'right' ? 0 : '0.5rem',
              marginRight: align === 'right' ? '0.5rem' : 0,
            }}
          >
            {sortingDirection === 'asc' ? 'arrow_upward' : 'arrow_downward'}
          </Icon>
        )}
      </MDTypography>
    </MDBox>
  );
}

// Typechecking props for the DataTableHeadCell
DataTableHeadCell.propTypes = {
  align: PropTypes.oneOf(['left', 'right', 'center']),
  children: PropTypes.node.isRequired,
  sorted: PropTypes.bool,
  sortingDirection: PropTypes.oneOf(['asc', 'desc']),
};

// Default props for the DataTableHeadCell
DataTableHeadCell.defaultProps = {
  align: 'left',
  sorted: false,
  sortingDirection: 'asc',
};

export default DataTableHeadCell;

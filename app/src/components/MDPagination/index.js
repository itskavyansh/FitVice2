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

import { forwardRef, createContext, useContext, useMemo } from 'react';

// prop-types is a library for typechecking of props
import PropTypes from 'prop-types';

// Material Dashboard 2 React components
import MDBox from 'components/MDBox';

// Custom styles for MDPagination
import MDPaginationItemRoot from 'components/MDPagination/MDPaginationItemRoot';
import MDPaginationRoot from 'components/MDPagination/MDPaginationRoot';

// The Pagination main context
const Context = createContext();

const MDPagination = forwardRef(
  ({ item, variant, color, size, active, children, ...rest }, ref) => {
    const [controller] = useMaterialUIController();
    const { darkMode } = controller;

    const value = useMemo(() => ({ variant, color, size }), [variant, color, size]);

    return (
      <Context.Provider value={{ variant, color, size, active }}>
        {item ? (
          <MDPaginationItemRoot
            {...rest}
            ref={ref}
            variant={variant === 'gradient' ? 'contained' : variant}
            size={size}
            ownerState={{ variant, active, paginationSize: size, darkMode }}
          >
            {children}
          </MDPaginationItemRoot>
        ) : (
          <MDPaginationRoot
            {...rest}
            ref={ref}
            ownerState={{ variant, paginationSize: size, darkMode }}
          >
            {children}
          </MDPaginationRoot>
        )}
      </Context.Provider>
    );
  },
);

// Setting default values for the props of MDPagination
MDPagination.defaultProps = {
  item: false,
  variant: 'gradient',
  color: 'info',
  size: 'medium',
  active: false,
};

// Typechecking props for the MDPagination
MDPagination.propTypes = {
  item: PropTypes.bool,
  variant: PropTypes.oneOf(['gradient', 'contained']),
  color: PropTypes.oneOf([
    'white',
    'primary',
    'secondary',
    'info',
    'success',
    'warning',
    'error',
    'light',
    'dark',
  ]),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  active: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

export default MDPagination;

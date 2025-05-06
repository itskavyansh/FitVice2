// Sidenav Collapse Component
// Collapsible navigation item with icon and label

import PropTypes from 'prop-types';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Icon from '@mui/material/Icon';
import MDBox from 'components/MDBox';

function SidenavCollapse({ icon, label, active }) {
  return (
    <ListItem button selected={active}>
      <ListItemIcon>
        <Icon>{icon}</Icon>
      </ListItemIcon>
      <ListItemText primary={label} />
    </ListItem>
  );
}

SidenavCollapse.propTypes = {
  icon: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  active: PropTypes.bool,
};

SidenavCollapse.defaultProps = {
  active: false,
};

export default SidenavCollapse;

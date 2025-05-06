// Grocery List Component
// Manages shopping lists generated from meal plans with category organization

import React, { useState } from 'react';
import { List, ListItem, ListItemText, Checkbox, Divider, Typography, Box } from '@mui/material';

const GroceryList = ({ items }) => {
  const [checkedItems, setCheckedItems] = useState([]);

  const handleToggle = (value) => {
    const currentIndex = checkedItems.indexOf(value);
    const newChecked = [...checkedItems];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setCheckedItems(newChecked);
  };

  return (
    <Box>
      <Typography variant="h6">Grocery List</Typography>
      <List>
        {items.map((item, index) => (
          <React.Fragment key={index}>
            <ListItem>
              <Checkbox
                edge="start"
                checked={checkedItems.indexOf(item) !== -1}
                tabIndex={-1}
                disableRipple
                onChange={() => handleToggle(item)}
              />
              <ListItemText primary={item} />
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};

export default GroceryList;

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

// Material Dashboard 2 React Base Styles
import colors from 'assets/theme/base/colors';
import borders from 'assets/theme/base/borders';
import boxShadows from 'assets/theme/base/boxShadows';

// Material Dashboard 2 React Helper Function
import rgba from 'assets/theme/functions/rgba';
import pxToRem from 'assets/theme/functions/pxToRem';

const { black, white } = colors;
const { borderWidth, borderRadius } = borders;
const { md } = boxShadows;

// Define a more subtle shadow (you can adjust this)
const subtleShadow = '0rem 0.125rem 0.25rem rgba(0, 0, 0, 0.075)'; // Example: Lighter shadow

const card = {
  styleOverrides: {
    root: {
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      minWidth: 0,
      wordWrap: 'break-word',
      backgroundColor: white.main,
      backgroundClip: 'border-box',
      border: '0 solid rgba(0, 0, 0, 0.125)',
      borderRadius: borderRadius.xl,
      boxShadow: subtleShadow,
      overflow: 'visible',
    },
  },
};

export default card;

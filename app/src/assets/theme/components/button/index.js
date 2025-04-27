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
import typography from 'assets/theme/base/typography';
import borders from 'assets/theme/base/borders';
import colors from 'assets/theme/base/colors';

// Material Dashboard 2 React Helper Functions
import pxToRem from 'assets/theme/functions/pxToRem';
import boxShadow from 'assets/theme/functions/boxShadow';

const { fontWeightBold, size } = typography;
const { borderRadius } = borders;
const { grey, gradients } = colors;

// Define a subtle shadow for buttons
const subtleButtonShadow = `${boxShadow([0, 1], [3, 1], grey[300], 0.15)}, ${boxShadow([0, 1], [2, 0], grey[300], 0.2)}`;

export default {
  styleOverrides: {
    root: {
      display: 'inline-flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: size.sm,
      fontWeight: fontWeightBold,
      borderRadius: borderRadius.lg,
      padding: `${pxToRem(12)} ${pxToRem(24)}`,
      lineHeight: 1.4,
      textAlign: 'center',
      textTransform: 'uppercase',
      userSelect: 'none',
      backgroundSize: '150% !important',
      backgroundPositionX: '25% !important',
      transition: 'all 150ms ease-in',

      '&:disabled': {
        pointerEvents: 'none',
        opacity: 0.65,
      },

      '& .material-icons': {
        fontSize: pxToRem(15),
        marginTop: pxToRem(-2),
      },
    },

    contained: {
      backgroundPosition: '50%',
      // Remove default gradient background, use solid color from palette
      // backgroundImage: linearGradient(gradients.info.main, gradients.info.state),
      boxShadow: subtleButtonShadow, // Use a more subtle shadow
      '&:hover': {
        boxShadow: subtleButtonShadow, // Keep shadow subtle on hover
      },
    },

    containedSizeSmall: {
      fontSize: size.xs,
      padding: `${pxToRem(10)} ${pxToRem(20)}`,
      '& .material-icons': {
        fontSize: pxToRem(12),
      },
    },

    containedSizeLarge: {
      padding: `${pxToRem(15)} ${pxToRem(36)}`,
      '& .material-icons': {
        fontSize: pxToRem(16),
      },
    },

    outlined: {
      // Keep outlined as is, they are usually clean already
      borderColor: 'currentColor', // Ensure border color matches text
      boxShadow: 'none',
      '&:hover': {
        boxShadow: 'none',
      },
    },

    text: {
      // Keep text as is, they are usually clean already
      boxShadow: 'none',
      '&:hover': {
        boxShadow: 'none',
      },
    },
  },
};

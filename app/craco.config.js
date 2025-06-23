const path = require('path');

module.exports = {
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      'assets': path.resolve(__dirname, 'src/assets'),
      'components': path.resolve(__dirname, 'src/components'),
      'layouts': path.resolve(__dirname, 'src/layouts'),
      'examples': path.resolve(__dirname, 'src/examples'),
      'context': path.resolve(__dirname, 'src/context'),
      'services': path.resolve(__dirname, 'src/services'),
    },
  },
}; 
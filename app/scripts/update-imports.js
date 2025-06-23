const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Get all JavaScript files
const files = glob.sync('src/**/*.{js,jsx}');

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  
  // Replace absolute imports with relative imports
  let updatedContent = content;
  
  // Only process files in theme and theme-dark directories
  if (file.includes('theme/') || file.includes('theme-dark/')) {
    // Handle theme imports
    updatedContent = updatedContent
      .replace(/from ['"]assets\/theme\/(.*?)['"]/g, (match, p1) => {
        const relativePath = path.relative(
          path.dirname(file),
          path.join('src/assets/theme', p1)
        ).replace(/\\/g, '/');
        return `from '${relativePath}'`;
      })
      // Handle theme-dark imports
      .replace(/from ['"]assets\/theme-dark\/(.*?)['"]/g, (match, p1) => {
        const relativePath = path.relative(
          path.dirname(file),
          path.join('src/assets/theme-dark', p1)
        ).replace(/\\/g, '/');
        return `from '${relativePath}'`;
      })
      // Handle same directory imports in theme files
      .replace(/from ['"]([^/][^'"]*)['"]/g, (match, p1) => {
        if (p1.startsWith('.')) return match;
        return `from './${p1}'`;
      });
  }

  if (content !== updatedContent) {
    fs.writeFileSync(file, updatedContent);
    console.log(`Updated imports in ${file}`);
  }
}); 
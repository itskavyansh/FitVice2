const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Get all JavaScript files
const files = glob.sync('src/**/*.{js,jsx}');

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  let updatedContent = content;

  // Only process theme and theme-dark files
  if (file.includes('theme/') || file.includes('theme-dark/')) {
    // Fix imports in the same directory
    updatedContent = updatedContent.replace(
      /from ['"]([^/][^'"]*)['"]/g,
      (match, p1) => {
        if (p1.startsWith('.')) return match;
        return `from './${p1}'`;
      }
    );

    // Fix imports from parent directories
    updatedContent = updatedContent.replace(
      /from ['"]\.\.\/([^'"]*)['"]/g,
      (match, p1) => {
        const relativePath = path.relative(
          path.dirname(file),
          path.join(path.dirname(path.dirname(file)), p1)
        ).replace(/\\/g, '/');
        return `from '${relativePath}'`;
      }
    );
  }

  if (content !== updatedContent) {
    fs.writeFileSync(file, updatedContent);
    console.log(`Updated imports in ${file}`);
  }
}); 
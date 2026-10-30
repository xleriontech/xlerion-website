const fs = require('fs');
const path = require('path');

function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
      console.log(`Copied ${entry.name} to ${dest}`);
    }
  }
}

const srcImagesDir = path.join(__dirname, '..', 'public', 'images');
const destImagesDir = path.join(__dirname, '..', 'dist', 'images');

if (fs.existsSync(path.join(__dirname, '..', 'public', 'images'))) {
  // Copy deeptech
  const deeptechSrc = path.join(__dirname, '..', 'public', 'images', 'deeptech');
  const deeptechDest = path.join(__dirname, '..', 'dist', 'images', 'deeptech');
  if (fs.existsSync(deeptechSrc)) {
    copyDir(deeptechSrc, path.join(__dirname, '..', 'dist', 'images', 'deeptech'));
    console.log('Copied deeptech folder');
  }

  // Copy portfolio
  const portfolioSrc = path.join(__dirname, '..', 'public', 'images', 'portfolio');
  if (fs.existsSync(portfolioSrc)) {
    copyDir(portfolioSrc, path.join(__dirname, '..', 'dist', 'images', 'portfolio'));
    console.log('Copied portfolio folder');
  }

  // Copy renders
  const rendersSrc = path.join(__dirname, '..', 'public', 'images', 'renders');
  if (fs.existsSync(rendersSrc)) {
    copyDir(rendersSrc, path.join(__dirname, '..', 'dist', 'images', 'renders'));
    console.log('Copied renders folder');
  }

  // Copy casos (case studies screenshots)
  const casosSrc = path.join(__dirname, '..', 'public', 'images', 'casos');
  if (fs.existsSync(casosSrc)) {
    copyDir(casosSrc, path.join(__dirname, '..', 'dist', 'images', 'casos'));
    console.log('Copied casos folder');
  }

  // Copy PWA icons (public/icons -> dist/icons)
  const iconsSrc = path.join(__dirname, '..', 'public', 'icons');
  if (fs.existsSync(iconsSrc)) {
    copyDir(iconsSrc, path.join(__dirname, '..', 'dist', 'icons'));
    console.log('Copied icons folder');
  }

  // Copy PHP endpoints (public/api -> dist/api) for Apache/cPanel hosting
  const apiSrc = path.join(__dirname, '..', 'public', 'api');
  if (fs.existsSync(apiSrc)) {
    copyDir(apiSrc, path.join(__dirname, '..', 'dist', 'api'));
    console.log('Copied api folder');
  }

  // Copy /.well-known (security.txt segun RFC 9116)
  const wellKnownSrc = path.join(__dirname, '..', 'public', '.well-known');
  if (fs.existsSync(wellKnownSrc)) {
    copyDir(wellKnownSrc, path.join(__dirname, '..', 'dist', '.well-known'));
    console.log('Copied .well-known folder');
  }

  // Copy root-level files inside public/images/ (og-cover.jpg, share previews, etc.)
  const imagesRoot = path.join(__dirname, '..', 'public', 'images');
  const distImagesRoot = path.join(__dirname, '..', 'dist', 'images');
  if (!fs.existsSync(distImagesRoot)) {
    fs.mkdirSync(distImagesRoot, { recursive: true });
  }
  for (const imgEntry of fs.readdirSync(imagesRoot, { withFileTypes: true })) {
    if (imgEntry.isFile()) {
      fs.copyFileSync(path.join(imagesRoot, imgEntry.name), path.join(distImagesRoot, imgEntry.name));
      console.log(`Copied ${imgEntry.name} to dist/images/`);
    }
  }

  // Copy portfolio folder (for Home.jsx references)
  const portfolioSrc2 = path.join(__dirname, '..', 'public', 'images', 'portfolio');
  if (fs.existsSync(portfolioSrc2)) {
    copyDir(portfolioSrc2, path.join(__dirname, '..', 'dist', 'images', 'portfolio'));
    console.log('Copied portfolio folder (second pass)');
  }

  // Copy root-level files from public/ to dist/
  const rootFiles = [
    'manifest.json',
    'favicon.ico',
    'favicon.png',
    'LogoX.png',
    'LogoX.svg',
    'humans.txt',
    'sitemap.xml',
    'robots.txt',
    'service-worker.js',
    '.htaccess'
  ];

  const srcPublicDir = path.join(__dirname, '..', 'public');
  const destDistDir = path.join(__dirname, '..', 'dist');

  for (const file of rootFiles) {
    const srcFile = path.join(srcPublicDir, file);
    const destFile = path.join(destDistDir, file);
    if (fs.existsSync(srcFile)) {
      fs.copyFileSync(srcFile, destFile);
      console.log(`Copied ${file} to dist/`);
    } else {
      console.log(`Warning: ${file} not found in public/`);
    }
  }

  console.log('Assets copied successfully!');
} else {
  console.error('Source images directory not found');
  process.exit(1);
}
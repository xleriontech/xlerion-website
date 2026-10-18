const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');

function walk(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    files.forEach((file) => {
        const full = path.join(dir, file);
        const stat = fs.statSync(full);
        if (stat.isDirectory()) walk(full, fileList);
        else fileList.push({ path: full, size: stat.size });
    });
    return fileList;
}

const allFiles = walk(publicDir);
const images = allFiles.filter(f => /\.(png|jpe?g|webp|svg)$/i.test(f.path));
const large = images.filter(i => i.size > 100 * 1024).sort((a, b) => b.size - a.size);

console.log('Large public images (>100KB):');
large.forEach(i => {
    console.log(`${(i.size / 1024).toFixed(1)} KB - ${i.path.replace(publicDir + path.sep, '')}`);
});

if (!large.length) console.log('No large images found.');

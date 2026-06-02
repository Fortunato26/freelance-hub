const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const iconsDir = path.join(__dirname, '..', 'public', 'icons');
const svgPath = path.join(iconsDir, 'icon.svg');

// Check if sharp is available
let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  console.log('Sharp not available, using placeholder icons');
  // Create placeholder PNG files
  const sizes = [180, 192, 512];
  sizes.forEach(size => {
    const filename = size === 180 ? 'apple-touch-icon.png' : `icon-${size}.png`;
    const filepath = path.join(iconsDir, filename);
    if (!fs.existsSync(filepath)) {
      // Create a simple 1x1 pixel PNG as placeholder
      const pngBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');
      fs.writeFileSync(filepath, pngBuffer);
      console.log(`Created placeholder: ${filename}`);
    }
  });
  process.exit(0);
}

// Generate icons using sharp
const sizes = [
  { size: 180, name: 'apple-touch-icon.png' },
  { size: 192, name: 'icon-192.png' },
  { size: 512, name: 'icon-512.png' },
];

async function generateIcons() {
  const svgBuffer = fs.readFileSync(svgPath);
  
  for (const { size, name } of sizes) {
    const outputPath = path.join(iconsDir, name);
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(outputPath);
    console.log(`Generated: ${name} (${size}x${size})`);
  }
}

generateIcons().catch(console.error);

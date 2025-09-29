#!/usr/bin/env node

// Simple image optimization script
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const optimizeImages = () => {
  const assetsDir = path.join(__dirname, '../src/assets');
  const publicDir = path.join(__dirname, '../public');
  
  console.log('🖼️  Image Optimization Report:');
  console.log('================================');
  
  // Check current image sizes
  const checkImageSize = (filePath) => {
    try {
      const stats = fs.statSync(filePath);
      const sizeInKB = (stats.size / 1024).toFixed(2);
      const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
      
      console.log(`📁 ${path.basename(filePath)}: ${sizeInKB} KB (${sizeInMB} MB)`);
      
      if (stats.size > 500 * 1024) { // > 500KB
        console.log(`⚠️  WARNING: ${path.basename(filePath)} is larger than 500KB!`);
        return { size: stats.size, needsOptimization: true };
      }
      
      return { size: stats.size, needsOptimization: false };
    } catch (error) {
      console.log(`❌ Error reading ${filePath}: ${error.message}`);
      return null;
    }
  };
  
  // Check assets directory
  if (fs.existsSync(assetsDir)) {
    console.log('\n📂 Assets Directory:');
    const files = fs.readdirSync(assetsDir);
    files.forEach(file => {
      if (/\.(jpg|jpeg|png|gif|webp)$/i.test(file)) {
        checkImageSize(path.join(assetsDir, file));
      }
    });
  }
  
  // Check public directory
  if (fs.existsSync(publicDir)) {
    console.log('\n📂 Public Directory:');
    const files = fs.readdirSync(publicDir);
    files.forEach(file => {
      if (/\.(jpg|jpeg|png|gif|webp)$/i.test(file)) {
        checkImageSize(path.join(publicDir, file));
      }
    });
  }
  
  console.log('\n💡 Optimization Recommendations:');
  console.log('================================');
  console.log('1. Convert large PNG files to WebP format');
  console.log('2. Compress JPEG images to 80-85% quality');
  console.log('3. Use responsive images with srcset');
  console.log('4. Implement lazy loading for images');
  console.log('5. Consider using a CDN for image delivery');
  console.log('\n🔧 Manual Optimization Steps:');
  console.log('1. Use online tools like TinyPNG or Squoosh');
  console.log('2. Convert weqaya-logo.png to WebP format');
  console.log('3. Reduce logo size to max 200KB');
  console.log('4. Use multiple sizes for responsive design');
};

optimizeImages();

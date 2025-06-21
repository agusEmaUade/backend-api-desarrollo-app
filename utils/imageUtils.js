const fs = require('fs');
const path = require('path');

/**
 * Converts an image file to base64 string
 * @param {string} filePath - Path to the image file
 * @returns {Promise<string>} Base64 encoded image string
 */
const imageToBase64 = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        reject(new Error('Error reading image file'));
        return;
      }
      
      // Get the file extension
      const ext = path.extname(filePath).toLowerCase();
      let mimeType = 'image/jpeg'; // default
      
      // Set appropriate mime type based on file extension
      if (ext === '.png') mimeType = 'image/png';
      else if (ext === '.gif') mimeType = 'image/gif';
      else if (ext === '.webp') mimeType = 'image/webp';
      
      // Convert to base64
      const base64Image = `data:${mimeType};base64,${data.toString('base64')}`;
      resolve(base64Image);
    });
  });
};

/**
 * Validates if a string is a base64 image
 * @param {string} str - The string to validate
 * @returns {boolean} True if the string is a valid base64 image
 */
const isBase64Image = (str) => {
  if (typeof str !== 'string') return false;
  
  // Check if it's a data URL
  if (!str.startsWith('data:image/')) return false;
  
  // Check if it has the base64 prefix
  const base64Regex = /^data:image\/(png|jpeg|jpg|gif|webp);base64,/;
  if (!base64Regex.test(str)) return false;
  
  // Extract the base64 part
  const base64Data = str.split(';base64,').pop();
  
  try {
    // Try to decode the base64 string
    const buffer = Buffer.from(base64Data, 'base64');
    
    // Check if the decoded data is a valid image
    // This is a basic check - in production you might want to do more thorough validation
    return buffer.length > 0;
  } catch (e) {
    return false;
  }
};

/**
 * Validates if a base64 image is under a certain size
 * @param {string} base64Image - The base64 image string
 * @param {number} maxSizeKB - Maximum size in KB (default: 500KB)
 * @returns {boolean} True if the image is under the size limit
 */
const validateImageSize = (base64Image, maxSizeKB = 500) => {
  if (!isBase64Image(base64Image)) return false;
  
  // Calculate size in KB
  const sizeInKB = (base64Image.length * (3/4)) / 1024;
  
  return sizeInKB <= maxSizeKB;
};

/**
 * Extracts image data from base64 string
 * @param {string} base64Image - The base64 image string
 * @returns {{mimeType: string, data: Buffer}} The image mime type and data buffer
 */
const extractImageData = (base64Image) => {
  if (!isBase64Image(base64Image)) {
    throw new Error('Invalid base64 image string');
  }
  
  const matches = base64Image.match(/^data:(.*?);base64,(.*)$/);
  if (!matches || matches.length !== 3) {
    throw new Error('Invalid image format');
  }
  
  return {
    mimeType: matches[1],
    data: Buffer.from(matches[2], 'base64')
  };
};

module.exports = {
  imageToBase64,
  isBase64Image,
  validateImageSize,
  extractImageData
};

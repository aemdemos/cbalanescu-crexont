/**
 * Image transformer
 * Handles image path conversions and optimizations
 */
export default function images(document, params) {
  const { url } = params;
  
  // Convert relative image paths to absolute
  document.querySelectorAll('img').forEach((img) => {
    if (img.src && !img.src.startsWith('http')) {
      img.src = new URL(img.src, url).href;
    }
  });
  
  // Handle background images
  document.querySelectorAll('[style*="background-image"]').forEach((el) => {
    const style = el.getAttribute('style');
    if (style) {
      const updated = style.replace(/url\(['"]?([^'"()]+)['"]?\)/g, (match, imgUrl) => {
        if (!imgUrl.startsWith('http')) {
          const absoluteUrl = new URL(imgUrl, url).href;
          return `url('${absoluteUrl}')`;
        }
        return match;
      });
      el.setAttribute('style', updated);
    }
  });
}

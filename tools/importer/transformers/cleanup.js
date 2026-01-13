/**
 * Site-wide cleanup transformer
 * Removes unwanted elements and cleans up the DOM before parsing
 */
export default function cleanup(document) {
  // Remove header, footer, navigation
  document.querySelectorAll('header, footer, nav').forEach((el) => el.remove());
  
  // Remove cookie banners
  document.querySelectorAll('.cookie-banner').forEach((el) => el.remove());
  
  // Remove scripts and styles
  document.querySelectorAll('script, style, link[rel="stylesheet"]').forEach((el) => el.remove());
  
  // Remove Elementor editing tools
  document.querySelectorAll('.elementor-edit-mode, .elementor-widget-container > .elementor-widget-container').forEach((el) => el.remove());
  
  // Clean up empty divs
  document.querySelectorAll('div:empty').forEach((el) => el.remove());
}

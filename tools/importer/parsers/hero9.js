/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row exactly as specified
  const headerRow = ['Hero (hero9)'];

  // --- 2nd row: Background image ---
  // No explicit background image in HTML, so leave cell empty
  const backgroundRow = [''];

  // --- 3rd row: Title, subheading, CTA ---
  // We want to preserve all meaningful content (heading, CTA, etc)
  const contentArr = [];

  // Find heading(s)
  const headingEl = element.querySelector('.elementor-widget-text-editor .elementor-widget-container h4');
  if (headingEl) contentArr.push(headingEl);

  // Find CTA button and associated arrow image
  const ctaContainer = element.querySelector('.cta-button-wrapper');
  if (ctaContainer) {
    // CTA button
    const buttonEl = ctaContainer.querySelector('a.elementor-button');
    if (buttonEl) {
      contentArr.push(document.createElement('br'));
      contentArr.push(buttonEl);
    }
    // Arrow image (decorative, usually after button)
    const arrowImgEl = ctaContainer.querySelector('.cta-button-arrow img');
    if (arrowImgEl) {
      contentArr.push(document.createTextNode(' '));
      contentArr.push(arrowImgEl);
    }
  }

  // If no content found, provide empty string (edge case handling)
  const contentRow = [contentArr.length ? contentArr : ''];

  // Build the array for the block table
  const cells = [
    headerRow,
    backgroundRow,
    contentRow,
  ];

  // Create and replace the block table
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(blockTable);
}

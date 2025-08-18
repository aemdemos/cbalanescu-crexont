/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row (exact block name)
  const headerRow = ['Hero (hero33)'];

  // 2. Background image row: find the first img descendant, or empty string if none exists
  let bgImageEl = null;
  bgImageEl = element.querySelector('img'); // None in this HTML, so will be empty
  const bgImageRow = [bgImageEl ? bgImageEl : ''];

  // 3. Content row: 
  // Find all visible content: headings and text. In this HTML, all are inside .elementor-widget-container under .e-con-inner
  // We'll select all .elementor-widget-container descendants of the block
  const contentElements = Array.from(element.querySelectorAll('.elementor-widget-container'))
    .filter(el => el.textContent && el.textContent.trim() !== '');
  // This includes: the top small heading, the main heading, and the paragraph

  // Place all in a single cell (so structure matches 1 column, 3 rows)
  const contentRow = [contentElements];

  // Compose table
  const cells = [headerRow, bgImageRow, contentRow];

  // Create table block and replace the original element with it
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}

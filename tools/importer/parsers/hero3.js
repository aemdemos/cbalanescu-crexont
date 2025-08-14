/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header must match exactly
  const headerRow = ['Hero (hero3)'];

  // 2. Background row: This HTML block has no background image (row is present, but cell is empty)
  const backgroundRow = [''];

  // 3. Content row: Should reference the content area (the inner elementor-widget-container div)
  // Use the actual container so we reference existing nodes
  let contentContainer = element.querySelector('.elementor-widget-container') || element;

  // Defensive: If the container is empty, use an empty string
  let contentRow = [contentContainer && contentContainer.childNodes.length > 0 ? contentContainer : ''];

  // 4. Assemble and replace
  const cells = [headerRow, backgroundRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

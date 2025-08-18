/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row
  const headerRow = ['Hero (hero17)'];

  // 2. Background image row (no <img> present)
  const backgroundRow = [''];

  // 3. Content row: collect all headline/subheading/paragraph
  // For robustness, gather all heading and paragraph-like elements from the block
  // Try to find the deepest meaningful content container
  let contentContainer = element;
  // First, try to find the inner container that holds visible content
  const candidateContainers = Array.from(element.querySelectorAll('.elementor-widget-container'));
  // Use the deepest container if possible (last in list)
  if (candidateContainers.length > 0) {
    contentContainer = candidateContainers[candidateContainers.length - 1];
  }

  // Collect all headings (h1-h6), paragraphs, and any directly visible content
  const contentItems = [];
  // Find all block-level elements that might be meaningful text
  const blockSelectors = 'h1,h2,h3,h4,h5,h6,p,div,span';
  const blocks = Array.from(contentContainer.querySelectorAll(blockSelectors));
  // Only include elements that actually have visible text
  blocks.forEach(el => {
    // Check if element has visible text
    if (el.textContent && el.textContent.trim().length > 0) {
      contentItems.push(el);
    }
  });
  // If nothing found, fallback to the whole content container
  if (contentItems.length === 0 && contentContainer.textContent.trim().length > 0) {
    contentItems.push(contentContainer);
  }

  // Compose the table rows
  const contentRow = [contentItems.length > 0 ? contentItems : ''];
  const cells = [
    headerRow,
    backgroundRow,
    contentRow,
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}

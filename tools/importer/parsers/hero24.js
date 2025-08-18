/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block
  const headerRow = ['Hero (hero24)'];

  // No image/background in provided HTML, so empty cell
  const imageRow = [''];

  // The content is inside element > div > h3
  // We want to reference the actual heading element to preserve structure/formatting
  let contentCell = '';
  const innerContainer = element.querySelector(':scope > div');
  if (innerContainer) {
    // Find the first heading element inside this container
    const heading = innerContainer.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) {
      contentCell = heading;
    } else {
      // fallback: reference the whole inner container
      contentCell = innerContainer;
    }
  } else {
    // fallback: reference the element itself
    contentCell = element;
  }

  const contentRow = [contentCell];

  // Build the table
  const cells = [
    headerRow,
    imageRow,
    contentRow
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new block table
  element.replaceWith(block);
}

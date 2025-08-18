/* global WebImporter */
export default function parse(element, { document }) {
  // HEADER: block name as specified
  const headerRow = ['Columns (columns19)'];

  // Get all immediate child containers
  const inner = element.querySelector('.e-con-inner');
  let leftColContent = [];
  let rightColContent = [];

  // Find child containers
  const containers = inner ? Array.from(inner.children).filter(e => e.classList.contains('e-con')) : [];
  if (containers.length >= 2) {
    const leftCol = containers[0];
    const rightCol = containers[1];

    // LEFT COLUMN: Title + share buttons
    // Title container (usually heading)
    const titleBlock = leftCol.querySelector('[data-widget_type="theme-post-title.default"] .elementor-widget-container');
    if (titleBlock) leftColContent.push(titleBlock);
    // Desktop share buttons
    const shareDesktop = leftCol.querySelector('[data-id="ab22091"] .elementor-widget-container');
    if (shareDesktop) leftColContent.push(shareDesktop);
    // Mobile share buttons (hidden on desktop/tablet)
    const shareMobile = leftCol.querySelector('[data-id="b2622dd"] .elementor-widget-container');
    if (shareMobile) leftColContent.push(shareMobile);

    // RIGHT COLUMN: Image
    const imageBlock = rightCol.querySelector('[data-widget_type="image.default"] .elementor-widget-container');
    if (imageBlock) rightColContent.push(imageBlock);
  }

  // Table row for columns
  const secondRow = [leftColContent, rightColContent];

  // Compose table data
  const cells = [headerRow, secondRow];

  // Create columns block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}

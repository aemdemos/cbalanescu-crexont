/* global WebImporter */
export default function parse(element, { document }) {
  // --- CRITICAL REVIEWED IMPLEMENTATION ---
  // Header row matching example
  const headerRow = ['Columns (columns4)'];

  // Find the main content container (may be nested)
  // For provided HTML, actual content is in a child container
  let innerContainer = element.querySelector(':scope > .elementor-element');
  if (!innerContainer) innerContainer = element;

  // Gather content blocks (text-editor, heading, etc.)
  // For each block, get its .elementor-widget-container content
  const blocks = Array.from(innerContainer.children).filter(child =>
    child.classList.contains('elementor-element')
  );
  const contentEls = [];
  blocks.forEach(block => {
    const widgetContainer = block.querySelector('.elementor-widget-container');
    if (widgetContainer) {
      contentEls.push(widgetContainer);
    }
  });

  // Edge case: If no blocks found, fallback to all element children
  if (contentEls.length === 0) {
    contentEls.push(...Array.from(element.children));
  }

  // Table structure: header row, one row with all columns
  // This HTML only has one logical 'column block' with several stacked elements
  const cells = [
    headerRow,
    [contentEls]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(table);
}

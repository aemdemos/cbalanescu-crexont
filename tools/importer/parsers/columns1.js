/* global WebImporter */
export default function parse(element, { document }) {
  // Block type header as per requirements
  const headerRow = ['Columns (columns1)'];

  // Get immediate child divs for columns
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // Defensive check: If no columns, fallback to element's children
  let colCount = columns.length;
  if (colCount < 2) {
    // Try to treat all element children as columns
    const fallbackColumns = Array.from(element.children);
    if (fallbackColumns.length > 1) {
      colCount = fallbackColumns.length;
      columns.length = 0;
      columns.push(...fallbackColumns);
    } else {
      // If only one column, just use the whole element
      columns.length = 0;
      columns.push(element);
      colCount = 1;
    }
  }

  // Build cells: first row is header, second row actual columns' contents
  const cells = [
    headerRow,
    columns
  ];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}

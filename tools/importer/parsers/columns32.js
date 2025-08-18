/* global WebImporter */
export default function parse(element, { document }) {
  // Compose the header row for the columns block.
  const headerRow = ['Columns (columns32)'];

  // Find all immediate child containers (each is a column in this layout)
  const columnDivs = Array.from(element.querySelectorAll(':scope > div'));

  // Prepare the columns' content
  // Each columnDiv may have multiple children; we want to preserve their structure.
  const rowCells = columnDivs.map(colDiv => {
    // For robustness, get all element children OR (if only text) all childNodes
    // Prefer the immediate children of the column div
    const nodes = Array.from(colDiv.childNodes).filter(
      n => n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim().length > 0)
    );
    if (nodes.length === 1) {
      return nodes[0];
    } else if (nodes.length > 1) {
      return nodes;
    } else {
      // If empty, insert an empty string (rare, but possible for edge cases)
      return '';
    }
  });

  // Only create the table if there's meaningful content
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    rowCells
  ], document);

  // Replace the original element with the generated table
  element.replaceWith(table);
}

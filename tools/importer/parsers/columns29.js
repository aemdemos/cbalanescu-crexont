/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get direct child by data-id
  function getByDataId(parent, id) {
    return parent.querySelector(`:scope > [data-id="${id}"]`);
  }

  // Header row as per requirements
  const headerRow = ['Columns (columns29)'];

  // The left logical column: all content except the logo image
  // The right logical column: just the logo image
  // From the HTML structure:
  // - The left column is the div[data-id="011f99b"]
  // - The right column is the div[data-id="cb36e2f"]

  const leftCol = getByDataId(element, '011f99b');
  let leftContent = [];
  if (leftCol) {
    // Collect all widgets from leftCol (text, h4, paragraph with link)
    // We want them in the order they appear
    leftContent = Array.from(leftCol.children);
  }

  const rightCol = getByDataId(element, 'cb36e2f');
  let rightContent = [];
  if (rightCol) {
    // All content from rightCol (should be the logo image)
    rightContent = Array.from(rightCol.children);
  }

  // Compose table as: header, [left, right]
  const cells = [
    headerRow,
    [leftContent, rightContent]
  ];

  // Create table and replace original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

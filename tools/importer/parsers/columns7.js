/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as specified
  const headerRow = ['Columns (columns7)'];

  // Get the columns (immediate children with .e-child)
  const cols = Array.from(element.querySelectorAll(':scope > .e-child'));

  // Left column: heading and text, must be grouped semantically (wrapping in a div)
  let leftCol = [];
  if (cols[0]) {
    const div = document.createElement('div');
    // Get all .elementor-widget inside left column
    const widgets = Array.from(cols[0].querySelectorAll(':scope > .elementor-widget'));
    widgets.forEach(widget => {
      const container = widget.querySelector('.elementor-widget-container');
      if (container) {
        // Move all children of container into the div
        Array.from(container.childNodes).forEach(node => {
          if (!(node.nodeType === Node.TEXT_NODE && !node.textContent.trim())) {
            div.appendChild(node);
          }
        });
      }
    });
    leftCol = div.childNodes.length ? [div] : [];
  }

  // Right column: the button
  let rightCol = [];
  if (cols[1]) {
    const widgets = Array.from(cols[1].querySelectorAll('.elementor-widget-button'));
    widgets.forEach(widget => {
      const container = widget.querySelector('.elementor-widget-container');
      if (container) {
        Array.from(container.childNodes).forEach(node => {
          if (!(node.nodeType === Node.TEXT_NODE && !node.textContent.trim())) {
            rightCol.push(node);
          }
        });
      }
    });
  }

  // Output: header row, then content row with left and right columns
  const cells = [
    headerRow,
    [leftCol, rightCol],
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}

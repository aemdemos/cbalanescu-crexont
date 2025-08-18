/* global WebImporter */
export default function parse(element, { document }) {
  // Header as specified in the instructions.
  const headerRow = ['Columns (columns38)'];

  // Get all top-level child divs (elementor containers)
  const containers = Array.from(element.querySelectorAll(':scope > div'));

  // We'll collect all textual/heading content into the left column
  let leftCellContent = [];
  if (containers.length > 0) {
    const widgets = Array.from(containers[0].querySelectorAll(':scope > div'));
    widgets.forEach(widget => {
      // Find the container ('.elementor-widget-container') or fallback to the widget itself
      const container = widget.querySelector('.elementor-widget-container') || widget;
      if (container && container.textContent && container.textContent.trim().length > 0) {
        leftCellContent.push(container);
      }
    });
  }
  // If nothing found, fallback to the text content of the entire element
  if (leftCellContent.length === 0 && element.textContent.trim()) {
    const span = document.createElement('span');
    span.textContent = element.textContent.trim();
    leftCellContent = [span];
  }

  // For this block, right cell is intentionally left empty as there are no images/media in the sample HTML
  const cells = [headerRow, [leftCellContent, '']];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

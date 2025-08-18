/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: must exactly match the name provided
  const headerRow = ['Columns (columns41)'];

  // Find the inner content container
  const inner = element.querySelector('.e-con-inner');
  if (!inner) return;
  
  // Get the main columns
  // Typical structure: two sibling divs with .e-con in .e-con-inner
  const columns = inner.querySelectorAll(':scope > .e-con');
  if (columns.length < 2) return;

  // --- LEFT COLUMN ---
  // Get all direct widget children of the left column, in order
  const leftColumnWidgets = columns[0].querySelectorAll(':scope > .elementor-element');
  const leftColFragment = document.createElement('div');
  leftColumnWidgets.forEach(widget => {
    // Get the widget container
    const widgetContainer = widget.querySelector('.elementor-widget-container');
    if (widgetContainer) {
      leftColFragment.appendChild(widgetContainer);
    }
  });

  // --- RIGHT COLUMN ---
  // The right column contains a nested .e-con, which contains the image widget
  let rightImgElem = null;
  const rightNestedCon = columns[1].querySelector('.e-con');
  if (rightNestedCon) {
    const imageWidget = rightNestedCon.querySelector('.elementor-widget-image');
    if (imageWidget) {
      const imageContainer = imageWidget.querySelector('.elementor-widget-container');
      if (imageContainer) {
        rightImgElem = imageContainer.querySelector('img');
      }
    }
  }

  // Defensive: if no image found, put empty div
  const rightColContent = rightImgElem ? rightImgElem : document.createElement('div');

  // Assemble the table rows per Columns block structure
  const tableRows = [
    headerRow,
    [leftColFragment, rightColContent]
  ];
  
  // Create the block table
  const table = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element with the new table
  element.replaceWith(table);
}

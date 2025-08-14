/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: safely get widget containers from a column
  function getWidgets(col) {
    const widgets = [];
    const directWidgets = col.querySelectorAll(':scope > .elementor-element');
    directWidgets.forEach(w => {
      const widget = w.querySelector('.elementor-widget-container');
      if (widget) widgets.push(widget);
    });
    return widgets;
  }

  // Find the inner content wrapper (elementor sometimes double-wraps)
  let eConInner = element.querySelector('.e-con-inner');
  const main = eConInner || element;
  // Find top-level columns
  const columns = main.querySelectorAll(':scope > .elementor-element.e-con');
  // If missing, fallback: treat all direct .elementor-element children as columns
  let colsToProcess = Array.from(columns);
  if (colsToProcess.length < 2) {
    // Fallback: look for all direct .elementor-element children as columns
    colsToProcess = Array.from(main.querySelectorAll(':scope > .elementor-element'));
  }
  // Defensive: Use only first two columns as per structure
  const leftCol = colsToProcess[0] || null;
  const rightCol = colsToProcess[1] || null;
  // Extract widgets/content from each column
  const leftColContent = leftCol ? getWidgets(leftCol) : [];
  const rightColContent = rightCol ? getWidgets(rightCol) : [];

  // If column is empty, don't push empty arrays, but ensure correct cell count
  const contentRow = [leftColContent.length ? leftColContent : '', rightColContent.length ? rightColContent : ''];

  // Header row as per instructions
  const headerRow = ['Columns (columns6)'];
  const table = WebImporter.DOMUtils.createTable([headerRow, contentRow], document);
  element.replaceWith(table);
}

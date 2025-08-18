/* global WebImporter */
export default function parse(element, { document }) {
  // Table header: must match block name exactly
  const headerRow = ['Columns (columns1)'];

  // Find columns: the structure is two main containers
  const columns = Array.from(element.querySelectorAll(':scope > .elementor-element'));

  let leftColumnContent = [], rightColumnContent = [];

  // --- Left column content extraction ---
  // The left column is the first child container (columns[0])
  if (columns[0]) {
    // Find the deepest child container (contains text/editor+button)
    const leftInner = columns[0].querySelector('.elementor-element.e-child');
    let textBlocks = [];
    if (leftInner) {
      // Get all widget containers inside leftInner
      const widgets = Array.from(leftInner.querySelectorAll('.elementor-widget-container'));
      widgets.forEach(w => textBlocks.push(w));
    } else {
      // Fallback: get all text and button widgets from columns[0]
      const widgets = Array.from(columns[0].querySelectorAll('.elementor-widget-container'));
      widgets.forEach(w => textBlocks.push(w));
    }
    // If we found any content, push them into the leftColumnContent
    if (textBlocks.length > 0) {
      leftColumnContent = textBlocks;
    }
  }

  // --- Right column content extraction ---
  // The right column is the second child container (columns[1])
  if (columns[1]) {
    // Find the image widget in right column
    const imgWidget = columns[1].querySelector('.elementor-widget-image .elementor-widget-container');
    if (imgWidget) {
      // Find the img itself
      const imgEl = imgWidget.querySelector('img');
      if (imgEl) {
        rightColumnContent = [imgEl];
      }
    }
  }

  // Edge case: columns missing, fallback to search in root
  if (leftColumnContent.length === 0) {
    // Try to grab any text-editor/widget-container outside of columns[1]
    const widgets = Array.from(element.querySelectorAll('.elementor-widget-text-editor .elementor-widget-container, .elementor-widget-button .elementor-widget-container'));
    leftColumnContent = widgets;
  }
  if (rightColumnContent.length === 0) {
    // Try to grab any img
    const imgEl = element.querySelector('img');
    if (imgEl) {
      rightColumnContent = [imgEl];
    }
  }

  // Compose table row
  const secondRow = [leftColumnContent, rightColumnContent];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable([headerRow, secondRow], document);

  // Replace original element
  element.replaceWith(table);
}

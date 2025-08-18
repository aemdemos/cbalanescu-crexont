/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header matches exactly
  const headerRow = ['Hero (hero31)'];

  // 2. Extract image (use only the first found image)
  let imgEl = null;
  const imgWidget = element.querySelector('.elementor-widget-image .elementor-widget-container img');
  if (imgWidget) {
    imgEl = imgWidget;
  }

  // 3. Collect all relevant text content (h4, p, spans, etc.)
  // This covers the heading, subhead, paragraphs, etc.
  const textContentEls = [];
  // Query all text-editor widgets (could be multiple)
  const textEditorWidgets = element.querySelectorAll('.elementor-widget-text-editor .elementor-widget-container');
  textEditorWidgets.forEach(container => {
    // Add all children (h4, p, etc.) in order
    Array.from(container.children).forEach(child => {
      textContentEls.push(child);
    });
  });

  // 4. Ensure all text is included and referenced (not cloned)
  // 5. Build final table (3 rows, 1 column)
  const cells = [
    headerRow,
    [imgEl ? imgEl : ''],
    [textContentEls.length > 0 ? textContentEls : '']
  ];

  // 6. Create the block table and replace original
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}

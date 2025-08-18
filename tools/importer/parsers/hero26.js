/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as per block name in example
  const headerRow = ['Hero (hero26)'];

  // This HTML has no background image, so the row is empty
  const backgroundImageRow = [''];

  // Gather the inner content for row 3: Title, Subheading, etc.
  const contentRowContent = [];
  // Find the main content wrapper
  const inner = element.querySelector('.e-con-inner');
  if (inner) {
    // Get all its direct children (the widgets)
    const directWidgets = Array.from(inner.children);
    directWidgets.forEach((widget) => {
      // Each widget contains .elementor-widget-container
      const container = widget.querySelector('.elementor-widget-container');
      if (container) {
        // Reference actual content elements (heading, paragraph, etc.)
        for (const node of container.childNodes) {
          // Only append element nodes (not comments/text nodes with just whitespace)
          if (node.nodeType === Node.ELEMENT_NODE) {
            contentRowContent.push(node);
          }
        }
      }
    });
  }

  // If no content was found, put an empty string to avoid empty cell
  if (contentRowContent.length === 0) {
    contentRowContent.push('');
  }

  // Table rows as per the structure: header, bg image, content
  const cells = [
    headerRow,
    backgroundImageRow,
    [contentRowContent.length === 1 ? contentRowContent[0] : contentRowContent],
  ];

  // Create block table and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}

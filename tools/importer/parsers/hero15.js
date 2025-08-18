/* global WebImporter */
export default function parse(element, { document }) {
  // Table header
  const headerRow = ['Hero (hero15)'];

  // --- Gather the background/decorative image (optional) ---
  // Example: <img ... src="...">
  let imageEl = null;
  // Find first img descendant (usually in .elementor-widget-image)
  const img = element.querySelector('img');
  if (img) {
    imageEl = img;
  }

  // --- Gather content: headings, paragraphs, CTAs (buttons/links) ---
  const content = [];

  // Headings (h1-h6)
  // Will grab all heading widgets, preserving their order
  const headingWidgets = element.querySelectorAll('.elementor-widget-heading .elementor-widget-container h1, .elementor-widget-heading .elementor-widget-container h2, .elementor-widget-heading .elementor-widget-container h3, .elementor-widget-heading .elementor-widget-container h4, .elementor-widget-heading .elementor-widget-container h5, .elementor-widget-heading .elementor-widget-container h6');
  headingWidgets.forEach(h => content.push(h));

  // Subheadings/paragraphs (text-editor widgets)
  const textEditors = element.querySelectorAll('.elementor-widget-text-editor .elementor-widget-container');
  textEditors.forEach(editor => {
    // push all direct children (p, span, etc) to preserve formatting
    Array.from(editor.childNodes).forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE && (node.tagName === 'P' || node.tagName === 'SPAN' || node.tagName === 'DIV')) {
        content.push(node);
      } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        // wrap text node in <span> for semantic inclusion
        const span = document.createElement('span');
        span.textContent = node.textContent;
        content.push(span);
      }
    });
  });

  // Call-To-Action Button(s)
  // Find any .elementor-widget-button a elements (not nested in text-editor)
  const buttonLinks = element.querySelectorAll('.elementor-widget-button .elementor-button');
  buttonLinks.forEach(btn => content.push(btn));

  // Additional links (e.g. "Resubmit form")
  // Already covered if in the text-editor, but let's ensure all links are captured
  const extraLinks = element.querySelectorAll('a');
  extraLinks.forEach(a => {
    // Only add if not already in content
    if (!content.includes(a)) {
      content.push(a);
    }
  });

  // Build table rows: always 3 rows, 1 column
  // Row 1: header, Row 2: [image] (may be null), Row 3: [content stack]
  const tableRows = [
    headerRow,
    [imageEl ? imageEl : ''],
    [content.length > 0 ? content : '']
  ];

  // Create table using WebImporter helper
  const table = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element with our table
  element.replaceWith(table);
}

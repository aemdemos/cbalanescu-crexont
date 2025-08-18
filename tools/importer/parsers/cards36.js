/* global WebImporter */
export default function parse(element, { document }) {
  // Utility: Get all direct children divs (each card)
  const cardDivs = Array.from(element.children).filter(child => child.tagName === 'DIV');

  // Start rows with the header as per example
  const rows = [['Cards (cards36)']];

  cardDivs.forEach(cardDiv => {
    // Card structure: image in one child, text in another
    // Find image: look for any <img> inside this cardDiv
    let img = cardDiv.querySelector('img');

    // Find text: look for .elementor-widget-text-editor .elementor-widget-container inside this cardDiv
    const textFragments = [];
    const textEditors = cardDiv.querySelectorAll('.elementor-widget-text-editor .elementor-widget-container');
    textEditors.forEach(editor => {
      // Only push element nodes, keep them as is
      Array.from(editor.childNodes).forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          textFragments.push(node);
        } else if (node.nodeType === Node.TEXT_NODE && node.nodeValue.trim()) {
          // Preserve any inline text nodes (rare)
          const span = document.createElement('span');
          span.textContent = node.nodeValue;
          textFragments.push(span);
        }
      });
    });
    // We want to reference the actual <img> and the collection of text nodes/elements
    rows.push([
      img || '',
      textFragments.length === 1 ? textFragments[0] : textFragments
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}

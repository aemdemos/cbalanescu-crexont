/* global WebImporter */
export default function parse(element, { document }) {
  // Header row exactly as in the example
  const headerRow = ['Cards (cards25)'];
  const tableRows = [];

  // All card containers are immediate children
  const cards = element.querySelectorAll(':scope > div');
  cards.forEach(card => {
    // Find the image: always first .elementor-widget-image .elementor-widget-container img in the card
    let imgEl = null;
    const imgContainer = card.querySelector('.elementor-widget-image .elementor-widget-container');
    if (imgContainer) {
      imgEl = imgContainer.querySelector('img');
    }
    // Gather all text-editor containers (divs with .elementor-widget-text-editor .elementor-widget-container)
    const textEls = Array.from(card.querySelectorAll('.elementor-widget-text-editor .elementor-widget-container'));
    // If there are any, use them all, otherwise fallback to all direct descendants except those containing images
    let textCellContent = [];
    if (textEls.length > 0) {
      textCellContent = textEls;
    } else {
      // Fallback: gather all children except those containing images
      textCellContent = Array.from(card.children).filter(child => !child.querySelector('img'));
    }
    // Always reference the original nodes (do not clone)
    tableRows.push([imgEl, textCellContent]);
  });

  // Compose the table array and build the block
  const tableArray = [headerRow, ...tableRows];
  const block = WebImporter.DOMUtils.createTable(tableArray, document);
  element.replaceWith(block);
}

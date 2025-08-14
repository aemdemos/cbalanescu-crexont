/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as per the block name in the example
  const headerRow = ['Cards (cards8)'];

  // Each card is a direct child with [data-elementor-type="loop-item"]
  const cards = Array.from(element.querySelectorAll('.elementor-loop-container > [data-elementor-type="loop-item"]'));

  // Build each card's row
  const rows = cards.map(card => {
    // First cell: Image (mandatory, if present)
    let img = null;
    const imgWidget = card.querySelector('.elementor-widget-theme-post-featured-image .elementor-widget-container img');
    if (imgWidget) {
      img = imgWidget;
    }

    // Second cell: Quote and author
    const textParts = [];
    const quoteNode = card.querySelector('.elementor-widget-theme-post-excerpt .elementor-widget-container');
    if (quoteNode) {
      textParts.push(quoteNode);
    }
    const authorNode = card.querySelector('.elementor-widget-text-editor .elementor-widget-container');
    if (authorNode) {
      textParts.push(authorNode);
    }

    return [img, textParts];
  });

  // Assemble the table
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

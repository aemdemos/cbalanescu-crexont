/* global WebImporter */
export default function parse(element, { document }) {
  // Find the carousel posts section
  const postsWidget = element.querySelector('.elementor-posts-container');
  if (!postsWidget) return;

  // Find all article cards/slides
  const cards = Array.from(postsWidget.querySelectorAll('.elementor-post'));
  const rows = [];

  // For each card, extract image in first cell, all visible text content (title, description, CTA) in second cell
  cards.forEach(card => {
    // Image cell (first cell)
    const img = card.querySelector('img');

    // Second cell: reference ALL content inside .elementor-post__text
    const textBlock = card.querySelector('.elementor-post__text');
    let rightCellContent;
    if (textBlock) {
      // Reference the whole text block (retains heading, link, formatting)
      rightCellContent = textBlock;
    } else {
      // Fallback: if text block missing, just put an empty string
      rightCellContent = '';
    }

    rows.push([img, rightCellContent]);
  });

  // The header row must match the example exactly
  const cells = [
    ['Carousel (carousel2)'],
    ...rows
  ];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

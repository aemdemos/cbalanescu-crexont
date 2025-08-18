/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as specified
  const headerRow = ['Cards (cards35)'];

  // Get all immediate articles as cards
  const cards = Array.from(element.querySelectorAll('.elementor-posts-container > .elementor-post'));

  const rows = cards.map(card => {
    // IMAGE CELL
    let imageCell = '';
    // Look for a thumbnail link containing an image
    const thumbnailLink = card.querySelector('.elementor-post__thumbnail__link');
    if (thumbnailLink) {
      const thumbnailImg = thumbnailLink.querySelector('img');
      if (thumbnailImg) imageCell = thumbnailImg;
    }

    // TEXT CELL
    let textCellContents = [];
    const postText = card.querySelector('.elementor-post__text');
    if (postText) {
      // Title
      const title = postText.querySelector('.elementor-post__title');
      if (title) textCellContents.push(title);
      // Excerpt
      const excerpt = postText.querySelector('.elementor-post__excerpt');
      if (excerpt) textCellContents.push(excerpt);
      // CTA
      const cta = postText.querySelector('.elementor-post__read-more');
      if (cta) textCellContents.push(cta);
    }
    return [imageCell, textCellContents];
  });

  // Compose cells array
  const cells = [headerRow, ...rows];

  // Create and insert block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
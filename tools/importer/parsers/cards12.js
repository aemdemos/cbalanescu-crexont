/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as specified precisely
  const cells = [
    ['Cards (cards12)']
  ];

  // Find the container with the cards
  const cardsContainer = element.querySelector('.elementor-posts-container');
  if (!cardsContainer) return;

  // Each card is an <article> with class 'elementor-post'
  const articles = cardsContainer.querySelectorAll('.elementor-post');

  articles.forEach((article) => {
    // Image cell
    let imageCell = '';
    const thumbnailLink = article.querySelector('.elementor-post__thumbnail__link');
    if (thumbnailLink) {
      const img = thumbnailLink.querySelector('img');
      if (img) imageCell = img;
    }

    // Text cell
    const textDiv = article.querySelector('.elementor-post__text');
    const textCellContent = [];
    if (textDiv) {
      // Title: heading (keep semantic)
      const h3 = textDiv.querySelector('.elementor-post__title');
      if (h3) {
        // Reference the actual <h3> element itself (not clone)
        textCellContent.push(h3);
      }
      // Description: paragraph(s)
      const excerpt = textDiv.querySelector('.elementor-post__excerpt');
      if (excerpt) {
        Array.from(excerpt.childNodes).forEach((node) => {
          textCellContent.push(node);
        });
      }
      // CTA: reference the anchor
      const cta = textDiv.querySelector('.elementor-post__read-more');
      if (cta) {
        textCellContent.push(document.createElement('br'));
        textCellContent.push(cta);
      }
    }
    cells.push([
      imageCell,
      textCellContent
    ]);
  });

  // Replace the original element with the table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

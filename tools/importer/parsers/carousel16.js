/* global WebImporter */
export default function parse(element, { document }) {
  // Compose header row as in the example
  const headerRow = ['Carousel (carousel16)'];

  // Slides: each <article> is a slide, but we can process only the provided 'element' (assumed to be <article>) per call
  // 2 columns: image in col 1, text content in col 2
  // Extract image
  const img = element.querySelector('img');

  // Extract title (heading)
  const h2 = element.querySelector('h2');
  let heading = null;
  if (h2) {
    // Use <h2> directly, maintaining heading semantics and any inline formatting (like <span> color)
    heading = h2;
  }

  // Extract description
  const desc = element.querySelector('p');

  // Compose text cell: heading (if present) + description (if present)
  const textCell = [];
  if (heading) textCell.push(heading);
  if (desc) textCell.push(desc);

  // Build the table structure
  const cells = [headerRow, [img, textCell]];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new block table
  element.replaceWith(block);
}
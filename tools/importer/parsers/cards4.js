/* global WebImporter */
export default function parse(element, { document }) {
  // Table header must match the example exactly
  const headerRow = ['Cards (cards4)'];

  // Find all immediate card containers
  const cardContainers = Array.from(element.querySelectorAll(':scope > div'));

  const rows = cardContainers.map(card => {
    // Get all immediate children for images/text
    const children = Array.from(card.querySelectorAll(':scope > div'));
    // Find the first image in the card (reference actual element)
    let image = null;
    for (const child of children) {
      const img = child.querySelector('img');
      if (img) {
        image = img;
        break;
      }
    }
    // Gather all non-image content from .elementor-widget-container within each card
    const textBlocks = [];
    children.forEach(child => {
      // Skip image blocks
      if (child.querySelector('img')) return;
      const containers = child.querySelectorAll('.elementor-widget-container');
      containers.forEach(ctn => {
        // Keep all headings, paragraphs, and other textual content
        Array.from(ctn.childNodes).forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Only add elements that contain real text
            if (node.textContent && node.textContent.trim()) {
              textBlocks.push(node);
            }
          } else if (node.nodeType === Node.TEXT_NODE) {
            // Add text nodes as span for semantic meaning
            if (node.textContent && node.textContent.trim()) {
              const span = document.createElement('span');
              span.textContent = node.textContent.trim();
              textBlocks.push(span);
            }
          }
        });
      });
    });
    // Fallback: If nothing found, add the entire .elementor-widget-container
    if (textBlocks.length === 0) {
      children.forEach(child => {
        if (!child.querySelector('img')) {
          const ctn = child.querySelector('.elementor-widget-container');
          if (ctn && ctn.textContent && ctn.textContent.trim()) {
            textBlocks.push(ctn);
          }
        }
      });
    }
    // If there is still no text, create an empty cell
    const textCell = textBlocks.length > 0 ? textBlocks : [''];
    return [image, textCell];
  });

  // Assemble table cells
  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}

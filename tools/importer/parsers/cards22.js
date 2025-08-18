/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as per example
  const headerRow = ['Cards (cards22)'];

  // Get all card blocks inside the loop
  const loopContainer = element.querySelector('.elementor-loop-container');
  const cardElements = loopContainer ? loopContainer.querySelectorAll('[data-elementor-type="loop-item"]') : [];

  const rows = [];
  cardElements.forEach((card) => {
    // Image: always present as first img in card
    const img = card.querySelector('img');

    // Collect ALL text content relevant for the card
    // Find excerpt and author, preserving formatting and order
    const textContainer = document.createElement('div');
    // Find all widget containers inside this card (in order)
    const widgetContainers = card.querySelectorAll('.elementor-widget-container');
    widgetContainers.forEach((container) => {
      const txt = container.textContent.trim();
      if (txt) {
        // Check for author line (starts with '-')
        if (/^-[A-Za-z]+/.test(txt)) {
          const authorP = document.createElement('p');
          const authorEm = document.createElement('em');
          authorEm.textContent = txt;
          authorP.appendChild(authorEm);
          textContainer.appendChild(authorP);
        } else {
          // For main quote/excerpt, use paragraph
          const p = document.createElement('p');
          p.textContent = txt;
          textContainer.appendChild(p);
        }
      }
    });

    // If nothing was added, fallback to all text content
    let cellContent = textContainer.childNodes.length ? textContainer : card.textContent.trim();

    rows.push([
      img,
      cellContent
    ]);
  });

  // Only the cards table is needed, no Section Metadata
  const cells = [headerRow, ...rows];
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(blockTable);
}

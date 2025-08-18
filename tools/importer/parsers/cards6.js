/* global WebImporter */
export default function parse(element, { document }) {
  // Table header exactly as requested
  const headerRow = ['Cards (cards6)'];

  // Card containers: each card is a flex container under one of the 3 main card rows
  // These are found under the grid in the source HTML
  const cardRows = Array.from(element.querySelectorAll(':scope > div > div > div'));

  // Defensive: only process cards that actually contain an image and some text
  const rows = cardRows
    .map(card => {
      // Find image (first image in card)
      const imageContainer = card.querySelector('[data-widget_type="image.default"]');
      let img = null;
      if (imageContainer) {
        img = imageContainer.querySelector('img');
      }
      // If the card doesn't have an image, skip it
      if (!img) return null;

      // Compose the text cell using all editorial text in card
      // Find all .cards-title-text for main titles
      const title = card.querySelector('.cards-title-text');
      // Find all text-editor widgets except cards-title-text
      const textEditors = Array.from(card.querySelectorAll('[data-widget_type="text-editor.default"]'));
      // Remove cards-title-text from the list
      const filteredTextEditors = textEditors.filter(e => !e.classList.contains('cards-title-text'));

      // Typically, the first is the label, middle is 'compared', last (if more than one) is the explanation/footnotes
      // But sometimes only one or two are present
      const textCellContent = [];
      filteredTextEditors.forEach(e => {
        // Only add non-empty
        if (e && e.textContent && e.textContent.trim()) {
          textCellContent.push(e);
        }
      });
      if (title) textCellContent.push(title);

      // Defensive: If a card is missing its main content, skip
      if (!title && textCellContent.length === 0) return null;

      return [img, textCellContent];
    })
    .filter(Boolean);

  // Compose final table rows (header then each card)
  const tableRows = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(tableRows, document);

  element.replaceWith(table);
}

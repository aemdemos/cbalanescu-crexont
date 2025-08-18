/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards14)'];
  const cells = [headerRow];
  
  // Get immediate card containers
  const cardContainers = Array.from(element.querySelectorAll(':scope > div'));
  cardContainers.forEach(card => {
    let imgEl = null, textEl = null, btnEl = null;
    // Only direct children divs
    const widgetDivs = Array.from(card.querySelectorAll(':scope > div'));
    widgetDivs.forEach(widget => {
      if (widget.classList.contains('elementor-widget-image')) {
        const img = widget.querySelector('img');
        if (img) imgEl = img;
      } else if (widget.classList.contains('elementor-widget-text-editor')) {
        const textContainer = widget.querySelector('.elementor-widget-container');
        if (textContainer) textEl = textContainer;
      } else if (widget.classList.contains('elementor-widget-button')) {
        const btn = widget.querySelector('a.elementor-button-link');
        if (btn) btnEl = btn;
      }
    });
    // Only add card if image and text exist
    if (imgEl && textEl) {
      // Compose text cell: text, with button below if present
      if (btnEl) {
        // Ensure button is visually below text by wrapping in a div
        const wrapper = document.createElement('div');
        wrapper.appendChild(textEl);
        wrapper.appendChild(btnEl);
        cells.push([imgEl, wrapper]);
      } else {
        cells.push([imgEl, textEl]);
      }
    }
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

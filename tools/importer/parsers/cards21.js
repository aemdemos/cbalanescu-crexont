/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract heading (number) and icon from the card
  function getCardTop(grid) {
    let heading = null;
    let img = null;
    // Number heading
    const headingWidget = grid.querySelector('.elementor-widget-text-editor .elementor-widget-container h3, .elementor-widget-text-editor .elementor-widget-container h4, .elementor-widget-text-editor .elementor-widget-container h5');
    if (headingWidget) heading = headingWidget;
    // Icon img
    const imgWidget = grid.querySelector('.elementor-widget-image img');
    if (imgWidget) img = imgWidget;
    // Return both, in correct order (heading then img)
    const frag = document.createDocumentFragment();
    if (heading) frag.appendChild(heading);
    if (img) frag.appendChild(img);
    return frag.childNodes.length ? frag : null;
  }

  // Helper: extract all direct card containers (with background_background setting)
  const cardContainers = Array.from(element.querySelectorAll(':scope > .elementor-element')).filter(div => {
    return div.classList.contains('e-con-full') && div.classList.contains('e-flex') && div.hasAttribute('data-settings');
  });

  const rows = [['Cards (cards21)']];

  cardContainers.forEach(cardEl => {
    // (1) Find the grid with number and icon
    const grid = cardEl.querySelector('.e-grid.e-con');
    const cardTopFrag = grid ? getCardTop(grid) : null;

    // (2) Find subtitles (h4, sometimes with br) after the grid
    let subtitle = null;
    const gridParent = grid && grid.parentElement;
    let textWidgets = [];
    // Get all :scope > .elementor-widget-text-editor in the cardEl
    textWidgets = Array.from(cardEl.querySelectorAll(':scope > .elementor-widget-text-editor'));
    // Subtitle is likely the first one with h4
    subtitle = null;
    let detail = null;
    textWidgets.forEach(w => {
      const cont = w.querySelector('.elementor-widget-container');
      if (!subtitle && cont && cont.querySelector('h4')) {
        subtitle = cont;
      }
      if (!detail && cont && cont.querySelector('h5')) {
        detail = cont;
      }
    });
    // If no detail found, use the last .elementor-widget-text-editor's container if present
    if (!detail && textWidgets.length > 0) {
      detail = textWidgets[textWidgets.length - 1].querySelector('.elementor-widget-container');
    }

    // Compose content for text cell
    const textFrag = document.createDocumentFragment();
    if (subtitle) {
      Array.from(subtitle.childNodes).forEach(node => textFrag.appendChild(node));
    }
    if (detail) {
      // Add a <br> between subtitle and detail if both exist and they're not the same
      if (subtitle && detail !== subtitle) {
        textFrag.appendChild(document.createElement('br'));
      }
      Array.from(detail.childNodes).forEach(node => textFrag.appendChild(node));
    }

    rows.push([
      cardTopFrag || document.createTextNode(''),
      textFrag.childNodes.length ? textFrag : document.createTextNode('')
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}

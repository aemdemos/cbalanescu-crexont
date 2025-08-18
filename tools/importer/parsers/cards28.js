/* global WebImporter */
export default function parse(element, { document }) {
  // Table header, exactly as required
  const headerRow = ['Cards (cards28)'];
  const cells = [headerRow];

  // Helper: safely get direct children with specific class
  function getDirectChildrenByClass(parent, className) {
    return Array.from(parent.children).filter(child => child.classList.contains(className));
  }

  // Each card is a .card-capsule direct child of 'element'
  const cardElems = getDirectChildrenByClass(element, 'card-capsule');
  cardElems.forEach(cardElem => {
    // Card title (find first <p> within any .elementor-widget-text-editor)
    let title = cardElem.querySelector('.elementor-widget-text-editor .elementor-widget-container p');
    // Card subtitle/description (find first <h5> within any .elementor-widget-text-editor)
    let subtitle = cardElem.querySelector('.elementor-widget-text-editor .elementor-widget-container h5');
    // Card icon: small round image inside .elementor-widget-image container (not decorative pill image)
    let iconImg = cardElem.querySelector('.e-flex.e-con.e-child .elementor-widget-image img');
    // Card icon description: after icon
    let iconDesc = null;
    // The icon description is within the same flex row as the icon (usually second child)
    let iconRow = cardElem.querySelector('.e-flex.e-con.e.child, .e-flex.e-con.e-child');
    if (!iconRow) iconRow = cardElem.querySelector('.e-flex.e-con.e-child');
    if (iconRow) {
      // Find all children with .elementor-widget-text-editor
      const descWidget = iconRow.querySelector('.elementor-widget-text-editor .elementor-widget-container');
      if (descWidget) iconDesc = descWidget;
    }

    // Compose the image/icon cell
    const imgCell = iconImg ? iconImg : '';

    // Compose the text cell: everything except icon
    const textParts = [];
    if (title) textParts.push(title);
    if (subtitle) textParts.push(subtitle);
    if (iconDesc) textParts.push(iconDesc);
    const textCell = textParts.length > 0 ? textParts : '';
    cells.push([imgCell, textCell]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

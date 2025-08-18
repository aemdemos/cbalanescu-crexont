/* global WebImporter */
export default function parse(element, { document }) {
  // Block header row
  const headerRow = ['Columns (columns8)'];

  // Get the logo column (first child of element)
  const logoCol = element.children[0];

  // Get the container for the nav columns (second child)
  const navContainer = element.children[1];

  // For robustness, select ONLY the nav menu widgets at the top level of the nav container
  // Should be two: main nav and submenu
  const navMenus = Array.from(navContainer.children).filter(
    child => child.classList.contains('elementor-widget-nav-menu')
  );

  // Compose the content row: logo | main nav | sub nav
  const contentRow = [logoCol, ...navMenus];

  // Structure the table
  const cells = [headerRow, contentRow];

  // Create the block table and replace the original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

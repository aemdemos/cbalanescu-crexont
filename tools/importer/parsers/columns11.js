/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: element must have at least 3 children corresponding to columns
  const children = Array.from(element.children);
  if (children.length < 3) return;

  // First column: logo (anchor with img)
  let logoCellContent = [];
  const logoDiv = children[0];
  // Try to find the logo anchor or image
  let logoLink = logoDiv.querySelector('a');
  let logoImg = logoDiv.querySelector('img');
  if (logoLink) {
    logoCellContent.push(logoLink);
  } else if (logoImg) {
    logoCellContent.push(logoImg);
  } else {
    // Reference the whole widget container if anchor/img not found
    const widgetContainer = logoDiv.querySelector('.elementor-widget-container');
    if (widgetContainer) logoCellContent.push(widgetContainer);
    else logoCellContent.push(logoDiv);
  }

  // Second column: main nav menu
  let mainMenuCellContent = [];
  const mainMenuDiv = children[1];
  // Use only the main nav, not the dropdown nav
  const mainNav = mainMenuDiv.querySelector('nav.elementor-nav-menu--main');
  if (mainNav) {
    mainMenuCellContent.push(mainNav);
  }

  // Third column: submenu/social links
  let subMenuCellContent = [];
  const subMenuDiv = children[2];
  const subNav = subMenuDiv.querySelector('nav.elementor-nav-menu--main');
  if (subNav) {
    subMenuCellContent.push(subNav);
  }

  // Table structure: header row, then one row with three columns
  const headerRow = ['Columns (columns11)'];
  const contentRow = [logoCellContent, mainMenuCellContent, subMenuCellContent];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  element.replaceWith(table);
}

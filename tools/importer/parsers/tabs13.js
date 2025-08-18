/* global WebImporter */
export default function parse(element, { document }) {
  // Build header row matching the block name exactly
  const headerRow = ['Tabs (tabs13)'];

  // Find the nav menu containing the tab labels (prefer desktop, then mobile)
  let nav = element.querySelector('.anchor-menu .elementor-nav-menu--main');
  if (!nav) {
    nav = element.querySelector('.elementor-nav-menu--main');
  }

  // Extract tab labels from visible nav menu
  let tabLabels = [];
  if (nav) {
    const links = nav.querySelectorAll('ul > li > a');
    tabLabels = Array.from(links).map(a => a.textContent.trim());
  }
  // If not found, just put an empty cell
  if (tabLabels.length === 0) tabLabels = [''];

  // Find the container that holds the heading and all navs (desktop/mobile)
  // Use direct children to retain full structure and all visible text, referencing actual elements
  let wrapper = element.querySelector('.title-menu-wrapper');
  if (!wrapper) wrapper = element; // Fallback if not found
  const contentCell = document.createElement('div');
  Array.from(wrapper.children).forEach(child => {
    contentCell.appendChild(child);
  });

  // Build the table as [header], [tab labels...], [content cell]
  const cells = [
    headerRow,
    tabLabels,
    [contentCell]
  ];

  // Replace the element with the structured table block
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

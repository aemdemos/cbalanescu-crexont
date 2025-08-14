/* global WebImporter */
export default function parse(element, { document }) {
  // HEADER must match example exactly
  const headerRow = ['Columns (columns12)'];

  // The HTML is a nav menu, rendered as a single row of column links.
  // We want the text content and links all visible on the page (from the horizontal nav)

  // Find the first nav menu with horizontal links
  // (This is the only visible one; the dropdown is hidden)
  const nav = element.querySelector('nav.elementor-nav-menu--main');

  let columnCells = [];
  if (nav) {
    // Get all <li> direct children of the nav's <ul>
    const lis = nav.querySelectorAll('ul > li');
    if (lis.length > 0) {
      columnCells = Array.from(lis).map(li => {
        // Reference the <a> as the content of this column
        const a = li.querySelector('a');
        // If for some reason there is no <a>, use the text
        return a ? a : li.textContent.trim();
      });
    }
  }

  // If still empty, fallback to all text content
  if (!columnCells.length) {
    const txt = element.textContent.trim();
    columnCells = [txt ? txt : ''];
  }

  // Assemble the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    columnCells
  ], document);

  // Replace the original element
  element.replaceWith(table);
}

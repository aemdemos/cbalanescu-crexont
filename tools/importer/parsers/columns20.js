/* global WebImporter */
export default function parse(element, { document }) {
  // Table header exactly as required
  const headerRow = ['Columns (columns20)'];

  // Get the .elementor-widget-nav-menu within element
  const navMenuWidget = element.querySelector('.elementor-widget-nav-menu');
  if (!navMenuWidget) return;

  // Find the menu UL that is visible (the horizontal menu)
  // There may be multiple ULs (for main and dropdown), we want the visible one
  const navUl = navMenuWidget.querySelector('.elementor-nav-menu--main ul');
  if (!navUl) return;

  // For each li in the menu, collect the full li contents (text + link)
  const navItems = Array.from(navUl.children).filter(li => li.tagName === 'LI');

  // For each nav item, reference all children of the li (preserves text + anchor)
  const contentRow = navItems.map(li => {
    // If there's both text and a link, include both
    // Get all child nodes (text and elements)
    if (li.childNodes.length === 1) {
      // Usually just an <a>, reference it directly
      return li.firstElementChild || li.firstChild || '';
    } else {
      // If there is text + element, include both
      // Build a fragment to keep all content in order
      const frag = document.createDocumentFragment();
      li.childNodes.forEach(node => {
        if (node.nodeType === 3) { // text node
          if (node.textContent.trim()) {
            frag.appendChild(document.createTextNode(node.textContent));
          }
        } else {
          frag.appendChild(node);
        }
      });
      return frag.childNodes.length ? frag : '';
    }
  });

  // Only create the block if we have content
  if (contentRow.length === 0) return;

  // Structure for createTable
  const cells = [
    headerRow,
    contentRow
  ];

  // Create the block table and replace element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}

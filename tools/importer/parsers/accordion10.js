/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get the accordion title node (h6, or strong inside span, or strong)
  function getTitleNode(panel) {
    let h6 = Array.from(panel.children).find(child => child.tagName === 'H6');
    if (h6) return h6;
    // Sometimes title is a strong inside span inside h6 (be robust)
    let strongSpan = Array.from(panel.children).find(child =>
      child.querySelector && child.querySelector('strong')
    );
    if (strongSpan) {
      let strong = strongSpan.querySelector('strong');
      if (strong) return strong.parentElement;
    }
    // Fallback to first strong
    let strong = panel.querySelector('strong');
    if (strong) return strong;
    // Fallback to first element child
    return panel.firstElementChild;
  }

  // Get all direct child divs, except mobile duplicate
  const panels = Array.from(element.querySelectorAll(':scope > div'))
    .filter(div => !div.classList.contains('mobile'));

  // Build the rows for the accordion block
  const rows = [['Accordion']];

  panels.forEach(panel => {
    // Title node
    const titleNode = getTitleNode(panel);

    // Content nodes: all children except the title node
    let contentNodes = [];
    // Find which node in panel.children is the title, so we can skip it
    let children = Array.from(panel.children);
    let titleIndex = children.indexOf(titleNode);
    children.forEach((child, idx) => {
      if (idx !== titleIndex) {
        contentNodes.push(child);
      }
    });
    // If no children (should not happen), fallback to text
    if (contentNodes.length === 0 && panel.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = panel.textContent.trim();
      contentNodes.push(p);
    }
    // If there's only one content node, use it directly, otherwise array
    rows.push([
      titleNode,
      contentNodes.length === 1 ? contentNodes[0] : contentNodes
    ]);
  });

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}

/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Get all immediate child containers
  function getImmediateChildren(el) {
    return Array.from(el.children).filter(child => child.tagName === 'DIV');
  }

  // Find the main column containers
  let leftCol = null, rightCol = null;
  let candidates = getImmediateChildren(element);
  // Traverse down if only one child container (Elementor nesting)
  while (candidates.length === 1 && getImmediateChildren(candidates[0]).length) {
    candidates = getImmediateChildren(candidates[0]);
  }
  // Now, if two or more, use first two as columns
  if (candidates.length >= 2) {
    leftCol = candidates[0];
    rightCol = candidates[1];
  } else if (candidates.length === 1) {
    leftCol = candidates[0];
    rightCol = element;
  } else {
    leftCol = element;
    rightCol = element;
  }

  // Extract all relevant content from a column element
  function extractColumnContent(col) {
    // Gather headings, paragraphs, links, buttons, images, etc.
    const content = [];
    // Use querySelectorAll for direct children, but allow for nesting
    Array.from(col.childNodes).forEach(node => {
      if (node.nodeType === 1) {
        // If div, flatten one level
        if (node.tagName === 'DIV') {
          Array.from(node.childNodes).forEach(subNode => {
            if (subNode.nodeType === 1) {
              content.push(subNode);
            } else if (subNode.nodeType === 3 && subNode.textContent.trim()) {
              const span = document.createElement('span');
              span.textContent = subNode.textContent.trim();
              content.push(span);
            }
          });
        } else {
          content.push(node);
        }
      } else if (node.nodeType === 3 && node.textContent.trim()) {
        // Direct text node
        const span = document.createElement('span');
        span.textContent = node.textContent.trim();
        content.push(span);
      }
    });
    // Fallback if nothing found, use innerText
    if (content.length === 0 && col.innerText.trim()) {
      content.push(col.innerText.trim());
    }
    return content.length ? content : [''];
  }

  // Extract left and right column content
  const leftContent = extractColumnContent(leftCol);
  const rightContent = extractColumnContent(rightCol);

  // Table header EXACTLY as required
  const headerRow = ['Columns (columns3)'];
  const cells = [
    headerRow,
    [leftContent, rightContent]
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}

/* global WebImporter */
export default function parse(element, { document }) {
  // Table header must match example exactly
  const headerRow = ['Tabs (tabs40)'];

  // Find tab wrappers (labels) and tab content wrappers
  const tabsWrapper = element.querySelector('.elementor-tabs-wrapper');
  const tabsContentWrapper = element.querySelector('.elementor-tabs-content-wrapper');
  if (!tabsWrapper || !tabsContentWrapper) return;

  // Get all desktop tab titles (labels and intro)
  const tabTitles = Array.from(tabsWrapper.children).filter(e => e.classList.contains('elementor-tab-title'));
  // Get all tab content panels (images and other tab-specific content)
  const tabContents = Array.from(tabsContentWrapper.children).filter(e => e.classList.contains('elementor-tab-content'));

  // Defensive: Use minimum length in case there's a mismatch
  const rowCount = Math.min(tabTitles.length, tabContents.length);
  const rows = [];

  for (let i = 0; i < rowCount; i++) {
    const tabTitleEl = tabTitles[i];
    const tabContentEl = tabContents[i];

    // First cell (label and intro):
    // Reference all heading and paragraph nodes from tabTitleEl, preserving their structure
    const labelContainer = document.createElement('div');
    Array.from(tabTitleEl.childNodes).forEach(node => {
      // Only append Element nodes (preserve <h6>, <p>, etc), also include text nodes
      if (node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && node.textContent.trim())) {
        labelContainer.appendChild(node);
      }
    });
    // If nothing is added, fallback to tabTitleEl.textContent
    if (!labelContainer.childNodes.length) {
      labelContainer.textContent = tabTitleEl.textContent.trim();
    }

    // Second cell (content): Reference all content (images, etc) from tabContentEl
    // Preserve all images and any text
    const contentContainer = document.createElement('div');
    Array.from(tabContentEl.childNodes).forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && node.textContent.trim())) {
        contentContainer.appendChild(node);
      }
    });
    // If nothing found, fallback to textContent
    if (!contentContainer.childNodes.length) {
      contentContainer.textContent = tabContentEl.textContent.trim();
    }

    rows.push([labelContainer, contentContainer]);
  }

  // Compose final table as per instructions
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

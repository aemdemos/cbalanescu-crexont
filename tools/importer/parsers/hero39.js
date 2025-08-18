/* global WebImporter */
export default function parse(element, { document }) {
  // Header row matches example
  const headerRow = ['Hero (hero39)'];

  // Find the main inner container
  const inner = element.querySelector('.e-con-inner');
  if (!inner) return;
  // Get all direct children (should be two: image container and content container)
  const containers = inner.querySelectorAll(':scope > .e-con');
  if (containers.length < 2) return;

  // --- Row 2: Background/decorative image (optional) ---
  let image = null;
  // Look for first <img> in the first container
  const imgEl = containers[0].querySelector('img');
  if (imgEl) image = imgEl;

  // --- Row 3: Content (headline, subheading, cta) ---
  const contentContainer = containers[1];
  const contentParts = [];
  // Get heading(s)
  const heading = contentContainer.querySelector('h4');
  if (heading) contentParts.push(heading);
  // Get subheading/paragraph
  const para = contentContainer.querySelector('p');
  if (para) contentParts.push(para);
  // Get button (link)
  const buttonWrap = contentContainer.querySelector('.elementor-button-wrapper');
  if (buttonWrap) contentParts.push(buttonWrap);

  // Compose final table array
  const cells = [
    headerRow,
    [image],
    [contentParts]
  ];

  // Create and replace with block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

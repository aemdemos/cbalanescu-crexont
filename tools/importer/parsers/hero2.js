/* global WebImporter */
export default function parse(element, { document }) {
  // --- Table header ---
  const headerRow = ['Hero (hero2)']; // Matches the example exactly

  // --- Background Image Row (2nd row) ---
  // The block description says this row is for a background image (optional)
  // For this HTML, the image is a CSS background, not present as <img>. Do NOT add a Section Metadata block; the example doesn't have one.
  // Therefore, cell is empty string.

  // --- Content/Body Row (3rd row) ---
  // Gather all relevant content from the block in visual order
  // We reference existing elements without cloning
  const contentElements = [];

  // 1. Hero label ("David, a real person...")
  const heroLabel = element.querySelector('.hero-label');
  if (heroLabel) contentElements.push(heroLabel);

  // 2. For adults with Parkinson’s disease (PD)
  const pdText = element.querySelector('[data-id="9d0f68c"]');
  if (pdText) contentElements.push(pdText);

  // 3. Headline: From lunch to leash to lake
  const heroTitle = element.querySelector('.hero-title');
  if (heroTitle) contentElements.push(heroTitle);

  // 4. Description: Stay in step with your day ...
  const heroDesc = element.querySelector('.hero-description');
  if (heroDesc) contentElements.push(heroDesc);

  // 5. Disclaimers (2 paragraphs)
  const disclaimer1 = element.querySelector('[data-id="5c5b456"]');
  if (disclaimer1) contentElements.push(disclaimer1);
  const disclaimer2 = element.querySelector('[data-id="0de495b"]');
  if (disclaimer2) contentElements.push(disclaimer2);

  // 6. Arrow graphic + CTA ("Take your next step")
  const arrowCTA = element.querySelector('[data-id="5d18d87"]');
  if (arrowCTA) contentElements.push(arrowCTA);

  // Compose the table
  const cells = [
    headerRow,        // Table header
    [''],             // Background image row (empty)
    [contentElements] // Content/body row
  ];

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}

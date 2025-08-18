/* global WebImporter */
export default function parse(element, { document }) {
  // Header row matches the block name
  const headerRow = ['Hero (hero5)'];

  // The block specifies a 1 column, 3 row table:
  // Row 1: header
  // Row 2: background image (optional)
  // Row 3: content (headline, subheadline, CTA etc)
  //
  // -- In the provided HTML, there is NO actual background image element.
  // We'll look for an <img> at the top level or background-image style, but if neither is present, the cell stays empty.

  let backgroundImageEl = null;
  // Check for an <img> anywhere inside the block that isn't part of the CTA
  // This block doesn't have a decorative background image, so leave empty

  // Get content container
  // The text and CTA are in nested containers
  const contentEls = [];
  const inner = element.querySelector('.e-con-inner');
  if (inner) {
    // Find the text headline (likely h4)
    // Use all heading or paragraph elements for a general solution
    // Also include the CTA button (link) and arrow image if present
    // Get all direct children divs
    const sectionDivs = inner.querySelectorAll(':scope > div');
    for (const div of sectionDivs) {
      // Text headline (h4)
      const textWidget = div.querySelector('.elementor-widget-text-editor');
      if (textWidget) {
        const widgetContainer = textWidget.querySelector('.elementor-widget-container');
        if (widgetContainer) {
          // Push all children (should be h4/span etc)
          Array.from(widgetContainer.children).forEach(el => {
            contentEls.push(el);
          });
        }
      }
      // CTA wrapper
      const ctaButtonWrapper = div.querySelector('.cta-button-wrapper');
      if (ctaButtonWrapper) {
        // Find the button link
        const buttonContainer = ctaButtonWrapper.querySelector('.elementor-widget-button');
        if (buttonContainer) {
          const buttonWidgetContainer = buttonContainer.querySelector('.elementor-widget-container');
          if (buttonWidgetContainer) {
            // Find the link inside
            const ctaLink = buttonWidgetContainer.querySelector('a');
            if (ctaLink) {
              contentEls.push(ctaLink);
            }
          }
        }
        // Also look for arrow image inside the wrapper
        const imageWidget = ctaButtonWrapper.querySelector('.elementor-widget-image');
        if (imageWidget) {
          const widgetContainer = imageWidget.querySelector('.elementor-widget-container');
          if (widgetContainer) {
            const imgLink = widgetContainer.querySelector('a');
            if (imgLink) {
              const img = imgLink.querySelector('img');
              if (img) {
                contentEls.push(img);
              }
            }
          }
        }
      }
    }
  }

  // Build the table
  const rows = [
    headerRow,
    [backgroundImageEl ? backgroundImageEl : ''],
    [contentEls]
  ];

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}

/* global WebImporter */
export default function parse(element, { document }) {
  // Header: must match exactly
  const headerRow = ['Hero (hero23)'];

  // Row 2: background image (optional). No background image in provided HTML so use null.
  const backgroundRow = [null];

  // Row 3: All hero content.
  // We want to preserve semantic meaning, order, and reference existing elements ONLY.

  // Gather content containers from .e-con-inner
  const inner = element.querySelector('.e-con-inner');
  const contentElements = [];
  if (inner) {
    const children = Array.from(inner.children);
    children.forEach((child) => {
      // 1. Hero label: (DAVID...)
      if (child.classList.contains('hero-label')) {
        const label = child.querySelector('.elementor-widget-container');
        if (label) contentElements.push(label);
        return;
      }
      // 2. Main text blocks (heading, subtitle, description, footnotes)
      if (child.classList.contains('elementor-widget')) {
        const widget = child.querySelector('.elementor-widget-container');
        if (widget) contentElements.push(widget);
        return;
      }
      // 3. Arrow+CTA container (find inside for both image and CTA text)
      if (child.querySelector('.elementor-widget-image, .elementor-widget-text-editor')) {
        // Arrow image
        const imgWidget = child.querySelector('.elementor-widget-image .elementor-widget-container');
        if (imgWidget) {
          const img = imgWidget.querySelector('img');
          if (img) contentElements.push(img);
        }
        // Arrow CTA text
        const ctaWidget = child.querySelector('.elementor-widget-text-editor .elementor-widget-container');
        if (ctaWidget) contentElements.push(ctaWidget);
        return;
      }
    });
  }

  // Build table
  const cells = [
    headerRow,
    backgroundRow,
    [contentElements]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

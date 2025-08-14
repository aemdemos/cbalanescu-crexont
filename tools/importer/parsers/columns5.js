/* global WebImporter */
export default function parse(element, { document }) {
  // Get the e-con-inner container (main columns wrapper)
  const eConInner = element.querySelector('.e-con-inner');
  if (!eConInner) return;

  // Get the two major columns (flex children)
  const majorCols = Array.from(eConInner.children).filter(el => el.nodeType === 1);
  if (majorCols.length < 2) return;

  // ----- TEXT COLUMN (should be first column, per example) -----
  let textCell = [];
  {
    // Find deepest .e-child in the second major column (text)
    let textCol = majorCols[1];
    // Sometimes there's a .e-con-full > .e-con-full > .elementor-widget structure
    let innerMost = textCol;
    while (innerMost && innerMost.querySelector('.e-child')) {
      const next = Array.from(innerMost.children).find(child => child.classList.contains('e-child'));
      if (!next) break;
      innerMost = next;
    }
    // Gather all widget containers in order: heading, main paragraph, button, footnotes
    const widgetEls = Array.from(innerMost.querySelectorAll(':scope > .elementor-element'));
    widgetEls.forEach(widget => {
      if (widget.classList.contains('elementor-widget-text-editor')) {
        const widgetCont = widget.querySelector('.elementor-widget-container');
        if (widgetCont && widgetCont.textContent.trim()) {
          textCell.push(widgetCont);
        }
      } else if (widget.classList.contains('elementor-widget-button')) {
        const widgetCont = widget.querySelector('.elementor-widget-container');
        if (widgetCont) {
          const button = widgetCont.querySelector('a');
          if (button) textCell.push(button);
        }
      }
    });
    if (textCell.length === 0) textCell = [textCol];
  }

  // ----- IMAGE COLUMN (should be second column, per example) -----
  let mediaCell = null;
  {
    // Look for overlay image in the first major column
    const mediaCol = majorCols[0];
    const videoWidget = mediaCol.querySelector('.elementor-widget-video');
    let overlayImg = null;
    if (videoWidget) {
      const overlay = videoWidget.querySelector('.elementor-custom-embed-image-overlay');
      if (overlay && overlay.style.backgroundImage) {
        const urlMatch = overlay.style.backgroundImage.match(/url\(["']?([^"')]+)["']?\)/);
        if (urlMatch) {
          overlayImg = document.createElement('img');
          overlayImg.src = urlMatch[1];
          mediaCell = overlayImg;
        }
      }
    }
    // Fallback: if no overlay image, leave cell empty
  }

  // Compose table with correct column order
  const cells = [
    ['Columns (columns5)'],
    [textCell, mediaCell]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

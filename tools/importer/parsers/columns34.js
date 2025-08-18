/* global WebImporter */
export default function parse(element, { document }) {
  // --- 1. Table header: Columns (columns34) ---
  const headerRow = ['Columns (columns34)'];

  // --- 2. Get structured columns ---
  // Top-level rows: element > .e-con-inner > direct child .e-con.e-child (usually two)
  const mainInner = element.querySelector('.e-con-inner');
  if (!mainInner) return;

  const columns = Array.from(mainInner.querySelectorAll(':scope > .e-con.e-child'));
  if (columns.length < 2) return;

  // --- 3. Left column (image/video) ---
  const leftCol = columns[0];
  let leftCell = [];

  // Find the video widget (contains iframe, overlay image)
  const videoWidgetContainer = leftCol.querySelector('.elementor-widget-video .elementor-widget-container');
  if (videoWidgetContainer) {
    // a. If iframe present, add as a link (NOT image)
    const iframe = videoWidgetContainer.querySelector('iframe');
    if (iframe && iframe.src) {
      const a = document.createElement('a');
      a.href = iframe.src;
      a.textContent = iframe.title || 'Video';
      leftCell.push(a);
    }
    // b. If overlay image present, extract as image
    const overlayDiv = videoWidgetContainer.querySelector('.elementor-custom-embed-image-overlay');
    if (overlayDiv) {
      const bgStyle = overlayDiv.style.backgroundImage;
      const urlMatch = bgStyle && bgStyle.match(/url\(["']?(.*?)["']?\)/);
      if (urlMatch && urlMatch[1]) {
        const img = document.createElement('img');
        img.src = urlMatch[1];
        leftCell.push(img);
      }
    }
  }

  // --- 4. Right column (content) ---
  const rightCol = columns[1];
  let rightCell = [];

  // Find all .elementor-widget-text-editor and .elementor-widget-button in order
  // Widgets are inside .e-con.e-child containers
  const rightWidgets = Array.from(rightCol.querySelectorAll('.elementor-widget-text-editor .elementor-widget-container, .elementor-widget-button .elementor-widget-container'));
  if (rightWidgets.length) {
    rightCell = rightWidgets;
  }

  // --- 5. Compose table ---
  // The second row contains exactly 2 columns (one for each block)
  const rows = [
    headerRow,
    [leftCell, rightCell]
  ];
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // --- 6. Replace original element ---
  element.replaceWith(table);
}

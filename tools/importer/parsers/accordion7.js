/* global WebImporter */
export default function parse(element, { document }) {
  // Get all immediate children divs
  const divs = Array.from(element.querySelectorAll(':scope > div'));

  // Extract indication (title and content)
  const desktopDiv = divs.find(div => div.classList.contains('desktop'));
  let indicationTitle, indicationContent;
  if (desktopDiv) {
    indicationTitle = desktopDiv.querySelector('h6, h5, h4');
    indicationContent = desktopDiv.querySelector('p');
  }

  // Extract safety information (title and content)
  const infoDiv = divs.find(div => !div.classList.contains('desktop') && !div.classList.contains('mobile') && !div.classList.contains('info'));
  let safetyTitle;
  let safetyContent = [];
  if (infoDiv) {
    safetyTitle = infoDiv.querySelector('h6, h5, h4');
    // Get all paragraphs and ul
    const ps = Array.from(infoDiv.querySelectorAll('p'));
    const ul = infoDiv.querySelector('ul');
    safetyContent = ps;
    if (ul) safetyContent.push(ul);
  }

  // Extract bottom info (contact/reporting etc)
  const bottomDiv = divs.find(div => div.classList.contains('info'));
  let bottomContent = [];
  if (bottomDiv) {
    bottomContent = Array.from(bottomDiv.children);
  }

  // Compose Accordion table rows
  const cells = [];
  // Header row exactly as specified
  cells.push(['Accordion']);
  // Indication row
  if (indicationTitle && indicationContent) {
    cells.push([
      indicationTitle,
      indicationContent
    ]);
  }
  // Safety info row
  if (safetyTitle && safetyContent.length) {
    cells.push([
      safetyTitle,
      safetyContent
    ]);
  }
  // Info row (only if content exists)
  if (bottomContent.length) {
    // Use existing formatting: keep semantic grouping
    cells.push([
      '',
      bottomContent
    ]);
  }

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

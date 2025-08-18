/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row - must match example exactly
  const headerRow = ['Columns (columns18)'];

  // 2. Find the main logical columns in the block
  // The source is a flex layout, left = image + all headline/footnote, right = summary text.
  // We'll use :scope > div to get all top-level direct children
  const topChildren = Array.from(element.querySelectorAll(':scope > div'));

  // Defensive: Find the deepest grid-like container (usually first child)
  let contentContainer = topChildren.length === 1 ? topChildren[0] : element;

  // Gather all visible content into logical left and right columns
  // LEFT = icon image, headline text, footnotes (all except the summary paragraph)
  // RIGHT = summary paragraph (study results, appears as desktop and/or mobile)

  // Get all divs in the main content container
  const contentChildren = Array.from(contentContainer.children).filter(el => el.nodeType === 1);

  // Identify left col: image + headline + all non-summary text
  const leftCol = [];
  // Image
  const imgEl = contentContainer.querySelector('img');
  if (imgEl) leftCol.push(imgEl);

  // Headline and secondary headline
  const textBlocks = Array.from(contentContainer.querySelectorAll('.elementor-widget-text-editor .elementor-widget-container'));
  // The first .elementor-widget-text-editor is usually the headline label
  if (textBlocks.length > 0) leftCol.push(textBlocks[0]);
  // The next is usually the headline sentence (if present)
  const headlineBlock = contentContainer.querySelector('.cards-title-text .elementor-widget-container');
  if (headlineBlock) leftCol.push(headlineBlock);

  // Footnotes or explanatory text (with <sup> and <em>), usually last .elementor-widget-text-editor
  // Could be multiple <p> with <sup> or <em>
  const footnoteBlocks = Array.from(contentContainer.querySelectorAll('.elementor-widget-text-editor .elementor-widget-container p')).filter(p => p.querySelector('sup') || p.querySelector('em'));
  footnoteBlocks.forEach(p => leftCol.push(p));

  // Defensive: Collect any extra text blocks not yet added that are NOT the summary paragraph
  // The summary is the block mentioning "in a clinical study".
  textBlocks.forEach(t => {
    if (!leftCol.includes(t) && !/clinical study/i.test(t.textContent)) {
      leftCol.push(t);
    }
  });

  // RIGHT column: summary paragraph (desktop version preferred)
  let rightCol = [];
  // Prefer desktop version (elementor-hidden-tablet, elementor-hidden-mobile)
  const desktopSummary = contentContainer.querySelector('.elementor-hidden-tablet.elementor-hidden-mobile .elementor-widget-container');
  if (desktopSummary) {
    rightCol.push(desktopSummary);
  } else {
    // Fallback: use mobile version if present
    const mobileSummary = contentContainer.querySelector('.elementor-hidden-desktop .elementor-widget-container');
    if (mobileSummary) {
      rightCol.push(mobileSummary);
    } else {
      // Fallback: any text block mentioning "clinical study"
      const anySummary = Array.from(contentContainer.querySelectorAll('.elementor-widget-text-editor .elementor-widget-container')).find(t => /clinical study/i.test(t.textContent));
      if (anySummary) rightCol.push(anySummary);
    }
  }

  // Remove empty/duplicate nodes
  const unique = arr => arr.filter((item, idx) => arr.indexOf(item) === idx && item && (item.textContent || item.tagName === 'IMG'));
  const leftColumnContent = unique(leftCol);
  const rightColumnContent = unique(rightCol);

  // Ensure semantic meaning and all text content is included
  // Compose cells
  const cells = [
    headerRow,
    [leftColumnContent, rightColumnContent]
  ];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}

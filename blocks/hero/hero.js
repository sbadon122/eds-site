function getCell(row) {
  return row?.firstElementChild || row;
}

function getLink(cell) {
  const link = cell?.querySelector?.('a[href]');
  const text = cell?.textContent?.trim();
  return link?.getAttribute('href') || text || '';
}

function moveChildren(from, to) {
  while (from?.firstChild) to.append(from.firstChild);
}

function hasContent(cell) {
  return !!(cell?.textContent?.trim() || cell?.children.length);
}

function hasStructuredCopy(cell) {
  return !!cell?.querySelector?.('h1,h2,h3,h4,h5,h6,p,ul,ol,blockquote');
}

function appendTitle(cell, content) {
  const title = cell?.textContent?.trim();
  if (!title) return;

  const heading = document.createElement('h1');
  heading.className = 'adaptive-carousel--title';
  heading.textContent = title;
  content.append(heading);
}

function appendDescription(cell, content) {
  if (!hasContent(cell)) return;

  const description = document.createElement('div');
  description.className = 'hero-description';
  moveChildren(cell, description);
  content.append(description);
}

function getRows(rows, hasAuthoredAltRow, usesSplitCopy) {
  if (usesSplitCopy) {
    return {
      titleRow: rows[2],
      descriptionRow: rows[3],
      textRow: null,
      ctaTextRow: null,
      ctaLinkRow: rows[4],
    };
  }

  if (hasAuthoredAltRow) {
    return {
      titleRow: null,
      descriptionRow: null,
      textRow: rows[2],
      ctaTextRow: rows[3],
      ctaLinkRow: rows[4],
    };
  }

  return {
    titleRow: null,
    descriptionRow: null,
    textRow: rows[1],
    ctaTextRow: rows[2],
    ctaLinkRow: rows[3],
  };
}

/**
 * loads and decorates the hero block
 * @param {Element} block The hero block element
 */
export default function decorate(block) {
  const rows = [...block.children];
  const [imageRow] = rows;
  const hasAuthoredAltRow = rows.length > 3;
  const altRow = hasAuthoredAltRow ? rows[1] : null;
  const firstCopyRow = hasAuthoredAltRow ? rows[2] : rows[1];
  const usesSplitCopy = hasAuthoredAltRow
    && rows.length > 4
    && !hasStructuredCopy(getCell(firstCopyRow));
  const {
    titleRow,
    descriptionRow,
    textRow,
    ctaTextRow,
    ctaLinkRow,
  } = getRows(rows, hasAuthoredAltRow, usesSplitCopy);
  const imageCell = getCell(imageRow);
  const altCell = getCell(altRow);
  const titleCell = getCell(titleRow);
  const descriptionCell = getCell(descriptionRow);
  const textCell = getCell(textRow);
  const picture = imageCell?.querySelector?.('picture');

  if (picture) {
    const img = picture.querySelector('img');
    const alt = altCell?.textContent?.trim();
    if (img && alt) img.setAttribute('alt', alt);
    block.prepend(picture);
  }

  const content = document.createElement('div');
  content.className = 'hero-content';
  appendTitle(titleCell, content);
  appendDescription(descriptionCell, content);
  moveChildren(textCell, content);
  content.querySelectorAll('h1').forEach((heading) => heading.classList.add('adaptive-carousel--title'));

  const existingCta = content.querySelector('a.button, a[href].hero-cta');
  if (!existingCta) {
    const ctaText = ctaTextRow?.textContent?.trim()
      || ctaLinkRow?.querySelector?.('a[href]')?.textContent?.trim()
      || 'GET A FREE QUOTE';
    const ctaHref = getLink(ctaLinkRow) || '/get-a-quote';
    const cta = document.createElement('a');
    cta.className = 'button accent hero-cta';
    cta.href = ctaHref;
    cta.textContent = ctaText;

    const ctaWrapper = document.createElement('p');
    ctaWrapper.className = 'button-wrapper hero-cta-wrapper';
    ctaWrapper.append(cta);
    content.append(ctaWrapper);
  }

  block.textContent = '';
  if (picture) block.append(picture);
  block.append(content);
}

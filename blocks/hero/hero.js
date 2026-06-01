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

/**
 * loads and decorates the hero block
 * @param {Element} block The hero block element
 */
export default function decorate(block) {
  const rows = [...block.children];
  const [imageRow] = rows;
  const hasAuthoredAltRow = rows.length > 3;
  const altRow = hasAuthoredAltRow ? rows[1] : null;
  const textRow = hasAuthoredAltRow ? rows[2] : rows[1];
  const ctaTextRow = hasAuthoredAltRow ? rows[3] : rows[2];
  const ctaLinkRow = hasAuthoredAltRow ? rows[4] : rows[3];
  const imageCell = getCell(imageRow);
  const altCell = getCell(altRow);
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
  moveChildren(textCell, content);

  const existingCta = content.querySelector('a.button, a[href].hero-cta');
  if (!existingCta) {
    const ctaText = ctaTextRow?.textContent?.trim() || 'GET A FREE QUOTE';
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

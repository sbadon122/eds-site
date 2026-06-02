function getCell(row) {
  return row?.firstElementChild || row;
}

function hasContent(cell) {
  return !!(cell?.textContent?.trim() || cell?.children.length);
}

function moveChildren(from, to) {
  while (from?.firstChild) to.append(from.firstChild);
}

function appendTitle(cell, content) {
  const title = cell?.textContent?.trim();
  if (!title) return;

  const heading = document.createElement('h1');
  heading.className = 'adaptive-carousel--title';
  heading.textContent = title;
  content.append(heading);
}

function appendText(cell, content) {
  if (!hasContent(cell)) return;

  const text = document.createElement('div');
  text.className = 'head-text';
  moveChildren(cell, text);
  content.append(text);
}

/**
 * loads and decorates the head block
 * @param {Element} block The head block element
 */
export default function decorate(block) {
  const rows = [...block.children];
  const titleCell = getCell(rows[0]);
  const textCell = getCell(rows[1]);
  const content = document.createElement('div');
  content.className = 'head-content';

  appendTitle(titleCell, content);
  appendText(textCell, content);

  block.textContent = '';
  if (content.children.length) block.append(content);
}

function getGap(block) {
  const gap = block.dataset.gap || block.getAttribute('gap');
  if (!gap) return '';

  const value = Number.parseFloat(gap);
  return Number.isFinite(value) && value >= 0 ? `${value}px` : '';
}

export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  const gap = getGap(block);
  if (gap) block.style.setProperty('--columns-gap', gap);

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add('columns-img-col');
        }
      }
    });
  });
}

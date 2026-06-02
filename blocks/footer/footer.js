import { decorateIcons, getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

function isSocialImage(element) {
  const image = element?.querySelector?.('img');
  if (!image) return false;

  const text = `${image.alt || ''} ${image.src || ''}`;
  return /linkedin/i.test(text);
}

function appendChildren(from, to) {
  while (from?.firstElementChild) to.append(from.firstElementChild);
}

function decorateFooterLayout(footer) {
  const section = footer.querySelector('.columns-container');
  const columnsWrapper = section?.querySelector(':scope > .columns-wrapper');
  const wrappers = [...section?.querySelectorAll(':scope > .default-content-wrapper') || []];
  const logoWrapper = wrappers[0];
  const metaWrapper = wrappers[wrappers.length - 1];

  if (
    !section
    || !columnsWrapper
    || !logoWrapper
    || !metaWrapper
    || logoWrapper === metaWrapper
  ) return;

  const socialWrapper = document.createElement('div');
  socialWrapper.className = 'default-content-wrapper footer-social';

  [...metaWrapper.children].forEach((child) => {
    if (isSocialImage(child)) socialWrapper.append(child);
  });

  const bottomWrapper = document.createElement('div');
  bottomWrapper.className = 'default-content-wrapper footer-bottom';
  appendChildren(logoWrapper, bottomWrapper);
  appendChildren(metaWrapper, bottomWrapper);

  if (socialWrapper.children.length) section.insertBefore(socialWrapper, columnsWrapper);
  section.insertBefore(bottomWrapper, columnsWrapper.nextElementSibling);
  logoWrapper.remove();
  metaWrapper.remove();
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);
  if (!fragment) return;

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  decorateFooterLayout(footer);
  decorateIcons(footer);
  block.append(footer);
}

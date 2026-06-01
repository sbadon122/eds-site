export default function decorate(block) {
  const wrapper = document.createElement('div');
  wrapper.className = 'wrap-horizontal';
  wrapper.append(document.createElement('hr'));
  block.replaceChildren(wrapper);
}

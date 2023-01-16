/** native select tag를 custom select로 replace함 */
export default function Select($target) {
  // TODO: 2개이상
  const initOldSelect = () => $target.getElementsByTagName('select')[0];

  const initNewSelect = ($oldSelect) => {
    const $select = document.createElement('div');
    const option = document.createElement('div');
    $select.classList.add('custom-select');

    // copy option
    option.classList.add('custom-option');
    $oldSelect.children.forEach((e) => {
      const newNode = document.createElement('div');
      newNode.classList.add('custom-option-item');
      newNode.setAttribute('value', e.value);
      newNode.append(e.innerHTML);
      option.appendChild(newNode);
    });
    $select.appendChild(option);

    // add arrow
    const arrow = document.createElement('div');
    arrow.classList.add('custom-select-arrow');
    $select.appendChild(arrow);

    // add placeholder
    const placeholder = document.createElement('div');
    placeholder.classList.add('custom-select-placeholder');
    placeholder.append('옵션을 선택하세요');
    $select.appendChild(placeholder);

    return $select;
  };

  const setEvent = () => {
    const $select = $target.querySelector('.custom-select');
    $select.addEventListener('click', () => {
      $select.classList.toggle('active');
    });
    document.body.addEventListener('click', (e) => {
      const targetElement = e.target;
      const isSelect = targetElement.classList.contains('custom-select') || targetElement.closest('.custom-select');

      if (isSelect) return;

      const selectElements = document.querySelector('.custom-select');
      selectElements?.classList.remove('active');
    });
  };

  const onSelect = (callback) => {
    const $options = $target.querySelector('.custom-option');
    $options.addEventListener('click', (e) => {
      const optionValue = e.target.getAttribute('value');
      callback(optionValue);
    });
  };

  const render = () => {
    const $oldSelect = initOldSelect();
    const $select = initNewSelect($oldSelect);

    $oldSelect.outerHTML = $select.outerHTML;
    setEvent();
  };

  return {
    convertSelectToCustomSelect: render,
    onSelect,
  };
}

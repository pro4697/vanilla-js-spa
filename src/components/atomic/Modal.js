import Component from '../Component';
import ProductDetail from '../ProductDetailV2';

export default class ProductModal extends Component {
  template() {
    return `<div class='modal-container'>
              <div class='modal-close'></div>
              <div class='modal-content'></div>
            </div>`;
  }

  setState({ isOpen, key }) {
    const $modal = document.body.querySelector(`.modal`);
    if (isOpen) {
      $modal.classList.add('open');
      const $modalContent = this.target.querySelector('.modal-content');
      new ProductDetail($modalContent, { key });
    } else {
      $modal.classList.remove('open');
    }
  }

  initMounted() {
    // modal close event
    const $modal = document.body.querySelector(`.modal`);
    const $modalClose = this.target.querySelector(`.modal-close`);

    $modalClose.addEventListener('click', (e) => {
      e.preventDefault();
      this.setState({ isOpen: false });
    });
    document.body.addEventListener('click', (e) => {
      e.preventDefault();
      if (!e.target.matches('.modal')) return;
      this.setState({ isOpen: false });
    });
    document.body.addEventListener('keyup', (e) => {
      if (!['Escape', 'esc'].includes(e.key)) return;
      if ($modal.classList.contains('open')) {
        this.setState({ isOpen: false });
      }
    });

    // render content
    if (this.state?.data) {
      const $modalContent = this.target.querySelector('.modal-content');
      new ProductDetail($modalContent).setState({ data: this.state?.data });
    }
  }
}

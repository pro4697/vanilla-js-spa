import Select from '../components/atomic/Select';
import Component from '../components/Component';
import { mergeArray } from '../utils/dataUtils';
import { request, requestLocal } from '../utils/request';

const getProducts = async (productKeys) => {
  const data = await Promise.all(productKeys.map((productKey) => request('GET', `mall/${productKey}`)));
  return data;
};

export default class CartPage extends Component {
  setup() {
    this.state = { selectedCoupon: [] };
  }

  async initMounted() {
    const cart = requestLocal('GET', 'cart');
    const productKeys = Object.keys(cart);

    const [coupon, data] = await Promise.all([request('GET', 'coupon'), getProducts(productKeys)]);
    this.setState({ coupon, data });
  }

  mounted() {
    const $couponSelects = this.target.querySelector('.selected-list-item slim');

    $couponSelects?.forEach(($couponSelect) => {
      $couponSelect?.addEventListener('click', (e) => {
        const key = Number(e.target.closest('selected-list-item').getAttribute('key'));
      });
    });

    const select = new Select(this.target);
    select.convertSelectToCustomSelect();
    select.onSelect((op) =>
      this.setState({
        selectedCoupon: mergeArray(this.state.selectedCoupon, { id: Number(op.value), name: op.label }, 'id'),
      })
    );
  }

  template() {
    const { state } = this;
    console.log(state.coupon);
    return `
    <div class='cart-page'>
      <div class='cart-container'>
        <h1 class='cart-title'>장바구니/결제</h1>
        <div class='cart-section-1'>
          <h2>쿠폰 사용</h2>
          <div class='cart-divider'></div>
          <select class='cart-coupon-select'>
            ${state.coupon?.map((e) => `<option value=${e.id}>${e.couponName}</option>`).join('')}
          </select>
          <div class='selected-list'>
            ${state.selectedCoupon
              .map(
                (e) => `
              <div class='selected-list-item slim' key=${e.id}>
                <span>${e.name}</span>
                <div class='selected-list-item-close slim'></div>
              </div>
              
            `
              )
              .join('')}
          </div>
        </>
      </div>
      <a href='./' class='fixed-icon-container'>
        <div class='home-icon'></div>
      </a>
    </div>`;
  }
}

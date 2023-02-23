import { calcDiscountedPrice, mergeArray, setImageFormat, setNumericComma } from '../utils/dataUtils';
import { request, requestLocal } from '../utils/request';
import Component from './Component';
import Select from './atomic/Select';
import Spinner from './Spinner';

function getPrice(props) {
  const isDiscount = props.discountRate > 0;

  return `<div class='product-price'>${setNumericComma(props.discountedPrice)}</div>
          <div class='product-price-suffix'>원</div>
          ${
            isDiscount
              ? `<div class='product-price-before-price'>${setNumericComma(
                  props.price
                )}원</div><div class='product-price-discount-rate'>${props.discountRate}%</div>`
              : ''
          }`;
}

function getCounter(count) {
  return `<button class='counter-minus'></button>
          <div class='counter-number'>${count}</div>
          <button class='counter-plus'></button>`;
}

function getProductOption(state) {
  // 품절 상태
  if (state.data.stockCount === 0) {
    return `<div class='detail-btn-disabled'>
              <button class='detail-btn-buy-disabled'>품절된 상품입니다.</button>
              <button class='detail-btn-cart-disabled'></button>
              <button class='detail-btn-heart'></button>
            </div>`;
  }
  // 옵션 없음
  if (!state.data.option.length) {
    return `<div class='detail-description-1'>택배배송 / 무료배송</div>
            <div class='detail-divider'></div>
            <div class='detail-product-count'>${getCounter(state.count)}</div>
            <div class='detail-divider'></div>
            <div class='detail-info'>
              <div class='detail-info-description'>총 상품 금액</div>
              <div class='detail-info-count'>총 수량
                <div class='detail-info-count-number'>${state.count}</div>개
              </div>
              <div class='detail-info-divider'></div>
              <div class='detail-info-price'>
                <div class='price-number'>${setNumericComma(state.count * state.data.discountedPrice)}</div>
                <div class='price-prefix'>원</div>
              </div>
            </div>
            <div class='detail-btn'>
              <button class='detail-btn-buy'>바로 구매</button>
              <button class='detail-btn-cart'>
                <div class='detail-btn-cart-menu'>
                  <span>장바구니에 추가되었습니다.</span>
                  <a href='/cart' class='detail-btn-cart-menu-goto-cart'>장바구니 가기</a>
                  <div class='detail-btn-cart-menu-close'>계속 쇼핑하기</div>
                </div>
              </button>
              <button class='detail-btn-heart'></button>
            </div>`;
  }
  // 옵션 있음
  return `<div class='detail-description-1'>택배배송 / 무료배송</div>
          <div class='detail-divider'></div>
          <select>
            ${state.data.option.map(
              (e) => `
              <option value='${e.id}'>${e.optionName}${e.additionalFee > 0 ? ` (+${e.additionalFee}원)` : ''}</option>
              `
            )}
          </select>
          <div class='selected-list'>
            ${state.selectedOption
              .map((e) => {
                const selectedOne = state.data.option.find((op) => op.id === e.id);
                return `<div class='selected-list-item' key=${e.id}>
                          <div class='selected-list-item-first-section'>
                            <div class='selected-list-item-name'>${selectedOne.optionName}</div>
                            <div class='selected-list-item-close'></div>
                          </div>
                          <div class='selected-list-item-second-section'>
                            <div class='selected-list-item-count'>${getCounter(e.count)}</div>
                            <div class='selected-list-item-price'>${setNumericComma(
                              (state.data.discountedPrice + selectedOne.additionalFee) * e.count
                            )}<span>원</span></div>
                          </div>
                        </div>`;
              })
              .join('')}
          </div>
          <div class='detail-divider'></div>
          <div class='detail-info'>
            <div class='detail-info-description'>총 상품 금액</div>
            <div class='detail-info-count'>총 수량
              <div class='detail-info-count-number'>${state.selectedOption.reduce((acc, e) => acc + e.count, 0)}</div>개
            </div>
            <div class='detail-info-divider'></div>
            <div class='detail-info-price'>
              <div class='price-number'>${(() => {
                const price = state.selectedOption
                  .map((e) => {
                    const selectedOne = state.data.option.find((op) => op.id === e.id);
                    return (state.data.discountedPrice + selectedOne.additionalFee) * e.count;
                  })
                  .reduce((acc, ee) => acc + ee, 0);
                return setNumericComma(price);
              })()}</div>
              <div class='price-prefix'>원</div>
            </div>
          </div>
          <div class='detail-btn'>
            <button class='detail-btn-buy'>바로 구매</button>
            <button class='detail-btn-cart'>
              <div class='detail-btn-cart-menu'>
                <span>장바구니에 추가되었습니다.</span>
                <a href='/cart' class='detail-btn-cart-menu-goto-cart'>장바구니 가기</a>
                <div class='detail-btn-cart-menu-close'>계속 쇼핑하기</div>
              </div>
            </button>
            <button class='detail-btn-heart'></button>
          </div>`;
}

export default class ProductDetail extends Component {
  setup() {
    this.state = { count: 0, key: this.props.key, selectedOption: [] };
  }

  async handleRequest(key) {
    const data = await request('GET', `mall/${key}`).then((productDetail) => ({
      ...productDetail,
      discountedPrice: calcDiscountedPrice(productDetail),
      thumbnailImg: setImageFormat(productDetail.thumbnailImg),
      detailInfoImage: productDetail.detailInfoImage.map((ee) => setImageFormat(ee)),
    }));
    return data;
  }

  async initMounted() {
    const { key } = this.state;
    this.setState({ loading: true });
    const data = await this.handleRequest(key);
    this.setState({ data, loading: false });
  }

  mounted() {
    const $heartIcon = this.target.querySelector('.detail-btn-heart');
    const $cartIcon = this.target.querySelector('.detail-btn-cart');
    const $cartCloseIcon = this.target.querySelector('.detail-btn-cart-menu-close');
    const $productCount = this.target.querySelector('.detail-product-count');
    const $selectedOptionCounts = this.target.querySelectorAll('.selected-list-item');
    const $buybtn = this.target.querySelector('.detail-btn-buy');

    // 상품 갯수 - 옵션 없음
    $productCount?.addEventListener('click', (e) => {
      if (e.target.classList.contains('counter-plus')) {
        if (this.state.count >= 10) return;
        this.setState({ count: this.state.count + 1 });
      }
      if (e.target.classList.contains('counter-minus')) {
        if (this.state.count <= 0) return;
        this.setState({ count: this.state.count - 1 });
      }
    });
    // 상품 갯수 - 옵션 있음
    $selectedOptionCounts?.forEach(($selectedOptionCount) => {
      $selectedOptionCount?.addEventListener('click', (e) => {
        const key = Number(e.target.closest('.selected-list-item').getAttribute('key'));
        const selectedOne = this.state.selectedOption.find((op) => op.id === key);
        if (e.target.classList.contains('counter-plus')) {
          if (selectedOne.count >= 10) return;
          this.setState({
            selectedOption: mergeArray(
              this.state.selectedOption,
              { ...selectedOne, count: selectedOne.count + 1 },
              'id'
            ),
          });
        }
        if (e.target.classList.contains('counter-minus')) {
          if (selectedOne.count <= 1) return;
          this.setState({
            selectedOption: mergeArray(
              this.state.selectedOption,
              { ...selectedOne, count: selectedOne.count - 1 },
              'id'
            ),
          });
        }
        if (e.target.classList.contains('selected-list-item-close')) {
          this.setState({
            selectedOption: this.state.selectedOption.filter((ee) => ee.id !== key),
          });
        }
      });
    });
    // 즐겨찾기
    $heartIcon?.addEventListener('click', (e) => {
      let afterStatus;
      if (e.target.classList.contains('heart-on')) {
        e.target.classList.remove('heart-on');
        afterStatus = false;
      } else {
        e.target.classList.add('heart-on');
        afterStatus = true;
      }
      requestLocal('PATCH', 'heart', { [this.state.key]: afterStatus });
    });
    $heartIcon?.classList.toggle('heart-on');

    // 장바구니
    $cartIcon?.addEventListener('click', (e) => {
      if (!e.target.classList.contains('detail-btn-cart')) return;
      const $cartMenu = e.target.children[0];
      if ($cartMenu.classList.contains('open')) {
        $cartMenu.classList.remove('open');
      } else {
        if (!this.state.count && !this.state.selectedOption.length) return;

        $cartMenu.classList.add('open');
        const useSelectedOption = this.state.selectedOption.length > 0;
        requestLocal('PATCH', 'cart', {
          [this.state.key]: useSelectedOption ? this.state.selectedOption : this.state.count,
        });
      }
    });
    // 장바구니 버튼 > 계쇽 쇼핑하기
    $cartCloseIcon?.addEventListener('click', () => {
      const $cartMenu = $cartIcon.children[0];
      $cartMenu.classList.remove('open');
    });
    // 바로 구매
    $buybtn?.addEventListener('click', () => {
      if (!this.state.count && !this.state.selectedOption.length) return;

      const useSelectedOption = this.state.selectedOption.length > 0;
      requestLocal('PATCH', 'cart', {
        [this.state.key]: useSelectedOption ? this.state.selectedOption : this.state.count,
      });
      window.history.pushState(null, null, 'cart');
    });

    // select core function call
    if (this.state.data?.option?.length) {
      const select = new Select(this.target);
      select.convertSelectToCustomSelect();
      select.onSelect((op) =>
        this.setState({
          selectedOption: mergeArray(this.state.selectedOption, { id: Number(op.value), count: 1 }, 'id'),
        })
      );
    }
  }

  template() {
    const { data, loading } = this.state || {};
    if (loading) return Spinner();
    if (!data) return `<div>data is null!</div>`;

    return `<div class='detail'>
              <div class='detail-section-1'>
                <img class='detail-img' src="${data.thumbnailImg}"></img>
                <div class='detail-section-1-1'>            
                  <div class='detail-name'>${data.productName}</div>
                  <div class='detail-price'>${getPrice(data)}</div>
                  ${getProductOption(this.state)}
                </div>
              </div>
              <div class='detail-section-2-title'>상품 정보</div>
              <div class='detail-section-2'>
                <div class='detail-product-info'>
                  <div class='info-title'>상품 번호</div>
                  <div class='info-data'>${this.state.data.id}</div>
                </div>
                <div class='detail-product-info'>
                  <div class='info-title'>재고 수량</div>
                  <div class='info-data'>${this.state.data.stockCount}개</div>
                </div>
              </div>
              <div class='detail-section-3'>
              ${this.state.data.detailInfoImage.map(
                (e) => `
                <img src='${e}' />
              `
              )}
              </div>
            </div>`;
  }
}

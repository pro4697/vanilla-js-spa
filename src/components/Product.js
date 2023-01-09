import { setNumericComma } from '../utils/dataUtils';
import { requestLocal } from '../utils/request';
import Component from './Component';
import ProductModal from './Modal';

const calcDiscountedPrice = (price, discountRate) => {
  const calculatedPrice = price * ((100 - discountRate) / 100);
  const roundDownPrice = Math.floor(calculatedPrice / 1000) * 1000;
  return roundDownPrice;
};

function getPrice(props) {
  const isDiscount = props.discountRate > 0;
  const price = isDiscount ? calcDiscountedPrice(props.price, props.discountRate) : props.price;

  return `<div class='product-price'>${setNumericComma(price)}</div>
            <div class='product-price-suffix'>원</div>
            ${
              isDiscount
                ? `<div class='product-price-before-price'>${setNumericComma(
                    props.price
                  )}원</div><div class='product-price-discount-rate'>${props.discountRate}%</div>`
                : ''
            }`;
}

function getImage(props) {
  const isSoldOut = props.stockCount === 0;

  if (!isSoldOut) {
    return `<img class='product-img' src="${props.thumbnailImg}"></img>`;
  }

  return `<div>
            <img class='product-img' src="${props.thumbnailImg}"></img>
            <div class='product-img-background'></div>
            <div class='product-img-sold-out-text'>SOLDOUT</div>
          </div>`;
}

function getHeart(props) {
  const heart = requestLocal('GET', 'heart')?.[props.id];
  const heartStatus = heart ? 'heart-on' : 'heart-off';

  return `<div border="0" class='product-heart ${props.id} ${heartStatus}'></div>`;
}

export default class Product extends Component {
  setup() {}

  mounted() {
    // 즐겨찾기 아이콘 이벤트 등록
    const heartIcons = this.target.querySelectorAll('.product-heart');
    heartIcons.forEach((heartIcon) => {
      heartIcon.addEventListener('click', (e) => {
        const key = e.target.className.split(' ')[1];
        const status = requestLocal('GET', 'heart')?.[key];
        requestLocal('PATCH', 'heart', { [key]: !status });

        if (status) {
          e.target.classList.remove('heart-on');
          e.target.classList.add('heart-off');
        } else {
          e.target.classList.remove('heart-off');
          e.target.classList.add('heart-on');
        }
      });
    });

    // modal
    const $modal = this.target.querySelector('.modal');
    const $productItem = this.target.querySelectorAll('.product-item');
    const modal = new ProductModal($modal);

    $productItem.forEach((item) => {
      item.addEventListener('click', (e) => {
        if (!e.target.className.includes('product-heart')) {
          const key = item.className.split(' ')[1];
          modal.setState({ isOpen: true, key });
        }
      });
    });
  }

  template() {
    const data = this.state?.data || [];
    return `<div class='product-list'>
              ${data
                .map(
                  (e) =>
                    `<div class='product-item ${e.id}'>
                      ${getImage(e)}
                      <div class='product-first-line'>
                        <div class='product-name'>${e.productName}</div>
                        ${getHeart(e)}
                      </div>
                      <div class='product-second-line'>${getPrice(e)}</div>
                    </div>`
                )
                .join('')}
                <div class='modal'></div>
            </div>`;
  }
}

import { request } from '../utils/request';
import { setImageFormat } from '../utils/dataUtils';
import Product from '../components/Product';
import Component from '../components/Component';

export default class MainPage extends Component {
  async initMounted() {
    const data = await request('GET', 'mall').then((res) =>
      res?.map((e) => ({
        ...e,
        price: e.price,
        thumbnailImg: setImageFormat(e.thumbnailImg),
        detailInfoImage: e.detailInfoImage.map((ee) => setImageFormat(ee)),
      }))
    );

    const $product = this.target.querySelector('.product');
    new Product($product).setState({ data });
  }

  template() {
    return `<div class='main-page'>
              <div class='product'></div>
              <a href='./cart' class='cart-container'>
                <div class='cart-icon'></div>
              </a>
            </div>`;
  }
}

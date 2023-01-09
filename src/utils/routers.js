import FallbackPage from '../pages/FallbackPage';
import LandingPage from '../pages/MainPage';
import CartPage from '../pages/CartPage';

const root = document.body.querySelector('#root');

export function router() {
  const routes = {
    '/': LandingPage,
    '/cart': CartPage,
    '/404': FallbackPage,
  };

  const { pathname } = window.location;

  if (routes?.[pathname]) {
    new routes[pathname](root);
    return;
  }
  new routes['/404'](root);
}

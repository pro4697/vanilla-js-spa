import FallbackPage from '../pages/FallbackPage';
import LandingPage from '../pages/MainPage';
import CartPage from '../pages/CartPage';

export function router() {
  const routes = {
    '/': LandingPage,
    '/cart': CartPage,
    '/404': FallbackPage,
  };

  const { pathname } = window.location;

  if (routes?.[pathname]) {
    render(routes[pathname]);
    return;
  }
  render(routes['/404']);
}

function render(view) {
  const app = document.body.querySelector('#root');
  app.innerHTML = view();
}

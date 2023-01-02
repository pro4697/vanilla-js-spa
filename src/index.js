import { router } from './utils/routers';
import './style/style.css';

(() => {
  document.addEventListener('DOMContentLoaded', () => {
    // a tag router처리
    document.body.addEventListener('click', (e) => {
      const aTag = e.target.closest('a');
      if (aTag) {
        e.preventDefault();
        window.history.pushState(null, null, aTag.href);
        router();
      }
    });
    // 뒤로가기 router처리
    window.addEventListener('popstate', () => {
      router();
    });
    // dom loaded
    router();
  });
})();

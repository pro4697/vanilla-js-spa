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
    // pushState사용시 router처리
    window.history.pushState = new Proxy(window.history.pushState, {
      apply: (target, thisArg, argArray) => {
        target.apply(thisArg, argArray);
        router();
      },
    });
    // dom loaded
    router();
  });
})();
HTMLCollection.prototype.forEach = Array.prototype.forEach;
Element.prototype.forEach = Array.prototype.forEach;

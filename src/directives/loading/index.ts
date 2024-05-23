import type { App, Directive, DirectiveBinding } from 'vue';

import loadingImg from './assets/loading.gif';

const loadingDirective: Directive = function (el: HTMLElement, binding: DirectiveBinding<boolean>) {
  if (binding.value !== binding.oldValue) {
    const style = window.getComputedStyle(el);
    if (style.position == 'static') {
      el.style.position = 'relative';
    }
    if (binding.value) {
      const maskEl = document.createElement('div');
      maskEl.className = 'v-loading-dom';
      maskEl.style.width = '100%';
      maskEl.style.height = '100%';
      maskEl.style.backgroundColor = 'white';
      maskEl.style.position = 'absolute';
      maskEl.style.top = '0px';
      maskEl.style.left = '0px';
      maskEl.style.display = 'flex';
      maskEl.style.justifyContent = 'center';
      maskEl.style.alignItems = 'center';
      maskEl.style.overflow = 'hidden';
      maskEl.style.zIndex = '999';

      const imgEl = document.createElement('img');
      imgEl.src = loadingImg;

      maskEl.appendChild(imgEl);
      el.appendChild(maskEl);
    } else {
      const baseEl = el.querySelector('.v-loading-dom');
      if (baseEl) {
        el.removeChild(baseEl);
      }
    }
  }
};

export function setupLoadingDirective(app: App) {
  app.directive('loading', loadingDirective);
}

export default loadingDirective;

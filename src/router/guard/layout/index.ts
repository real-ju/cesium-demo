import type { Router } from 'vue-router';

import { setPageTitle } from '/@/router/helper/routeHelper';

export function createLayoutGuard(router: Router) {
  router.afterEach((to, from, failure) => {
    // 设置页面标题
    setPageTitle(to.meta.title, to.meta.hideTitleSuffix);
  });
}

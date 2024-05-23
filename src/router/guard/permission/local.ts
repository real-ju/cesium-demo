import type { Router } from 'vue-router';

import { useUserStore } from '/@/store/modules/user';
import { BasicPageEnum, ExceptionPageEnum } from '/@/enums/pageEnum';

export function createLocalPermissionGuard(router: Router) {
  router.beforeEach((to, from, next) => {
    // 检测是否匹配某路由
    let isMatched = to.matched.length !== 0;
    if (!isMatched) {
      let error = new Error(`"${to.path}"不是有效路径`);
      error.name = 'PathMatchError';
      next(error);
    } else {
      const userStore = useUserStore();
      let isLogin = userStore.isLogin;
      // 检测路由访问权限
      let requireAuth = to.matched.some((record) => !record.meta.public);
      if (requireAuth) {
        // 检测是否登录
        if (isLogin) {
          next();
        } else {
          next({
            path: BasicPageEnum.LOGIN,
            query: {
              back_url: from.name === null ? to.fullPath : from.fullPath
            }
          });
        }
      } else {
        // 登录后再次访问登录页
        if (to.path === BasicPageEnum.LOGIN && isLogin) {
          next('/');
        } else {
          next();
        }
      }
    }
  });

  router.onError((error) => {
    if (error.name === 'PathMatchError') {
      // 如果不存在/404 会导致死循环 浏览器卡死
      router.push(ExceptionPageEnum.EXCEPTION_404);
    } else if (error.name === 'PathAuthError') {
      router.push(ExceptionPageEnum.EXCEPTION_403);
    }
  });
}

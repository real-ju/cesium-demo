import type { Router, RouteRecordRaw } from 'vue-router';

import { routePathToName, getComponentFilePath } from '/@/router/helper/routeHelper';
import { asyncViewImport } from '/@/router/helper/asyncViewImport';
import projectSetting from '/@/settings/projectSetting';
import { useUserStore } from '/@/store/modules/user';
import { BasicPageEnum, ExceptionPageEnum } from '/@/enums/pageEnum';

const routeWhiteList: (ExceptionPageEnum | string)[] = [
  ExceptionPageEnum.EXCEPTION_403,
  ExceptionPageEnum.EXCEPTION_404
];

export function createSafetyPermissionGuard(router: Router) {
  let isFetchUserRoutes = false;

  router.beforeEach((to, from, next) => {
    if (routeWhiteList.indexOf(to.path) !== -1) {
      next();
      return;
    }

    const userStore = useUserStore();
    let isLogin = userStore.isLogin;
    if (isLogin) {
      if (!isFetchUserRoutes) {
        // 此处为获取用户路由表的接口
        Promise.resolve()
          .then((res: any) => {
            let datas = res.data;
            let routeList: RouteRecordRaw[] = [];
            let adminRoutes: RouteRecordRaw[] = [];

            let { multiplePlatformMode } = projectSetting;
            let userPlatform = userStore.getUser.platform;
            if (multiplePlatformMode && !userPlatform) {
              userStore.logout();
              router.push(BasicPageEnum.LOGIN);
              throw '登陆状态错误，请重新登陆';
            }

            // 添加所有admin route
            datas.forEach((item: any) => {
              adminRoutes.push({
                path: item.route,
                name: 'admin-' + routePathToName(item.route),
                meta: {
                  title: item.title,
                  public: false
                },
                component: asyncViewImport(
                  getComponentFilePath(
                    item.url,
                    multiplePlatformMode,
                    item.common,
                    userPlatform!.symbol
                  )
                )
              });
            });

            routeList.push({
              path: '/',
              redirect: '/admin'
            });

            routeList.push({
              path: '/admin',
              name: 'admin',
              meta: {
                title: 'Layout',
                public: false
              },
              component: asyncViewImport('admin/index.vue'),
              children: adminRoutes
            });

            routeList.push({
              path: '*',
              redirect: ExceptionPageEnum.EXCEPTION_404
            });

            routeList.forEach((record) => {
              router.addRoute(record);
            });

            isFetchUserRoutes = true;

            next(to);
          })
          .catch((res) => {
            let error = new Error('路由表获取失败');
            next(error);
          });
      } else if (to.path === BasicPageEnum.LOGIN) {
        next('/');
      } else {
        next();
      }
    } else {
      let isMatched = to.matched.length != 0;

      if (isMatched) {
        if (!to.meta.public) {
          next({
            path: BasicPageEnum.LOGIN,
            query: {
              back_url: encodeURIComponent(to.fullPath)
            }
          });
        } else {
          next();
        }
      } else {
        next(BasicPageEnum.LOGIN);
      }
    }
  });

  router.onError((error) => {
    router.push(ExceptionPageEnum.EXCEPTION_403);
  });
}

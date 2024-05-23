import type { App } from 'vue';

import { createRouter, createWebHistory } from 'vue-router';
import routes from './routes';
import { setupRouterGuard } from './guard';
import { getEnv } from '/@/utils/env';

// router instance
export const router = createRouter({
  history: createWebHistory(getEnv().VITE_PUBLIC_PATH),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth'
      };
    } else {
      return {
        top: 0,
        left: 0
      };
    }
  }
});

// config router
export function setupRouter(app: App) {
  setupRouterGuard(router);
  app.use(router);
}

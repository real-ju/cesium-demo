import type { Router } from 'vue-router';

import { createPermissionGuard } from './permission';
import { createLayoutGuard } from './layout';

export function setupRouterGuard(router: Router) {
  createPermissionGuard(router);
  createLayoutGuard(router);
}

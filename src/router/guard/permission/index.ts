import type { Router } from 'vue-router';

import { createLocalPermissionGuard } from './local';
import { createSafetyPermissionGuard } from './safety';
import projectSetting from '/@/settings/projectSetting';
import { RoutePermissionModeEnum } from '/@/enums/appEnum';

export function createPermissionGuard(router: Router) {
  let { routePermissionMode } = projectSetting;
  if (routePermissionMode === RoutePermissionModeEnum.LOCAL) {
    createLocalPermissionGuard(router);
  } else if (routePermissionMode === RoutePermissionModeEnum.SAFETY) {
    createSafetyPermissionGuard(router);
  }
}

import { RoutePermissionModeEnum } from '/@/enums/appEnum';

export interface ProjectSetting {
  routePermissionMode: RoutePermissionModeEnum;
  multiplePlatformMode: boolean;
  showPageTitleSuffix: boolean;
}

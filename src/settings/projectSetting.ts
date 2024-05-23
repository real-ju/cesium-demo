import { RoutePermissionModeEnum } from '/@/enums/appEnum';
import { ProjectSetting } from '/#/config';

const setting: ProjectSetting = {
  // 路由权限模式
  routePermissionMode: RoutePermissionModeEnum.LOCAL,
  // 多平台模式（比如企业管理端、用户端、开发者端）
  multiplePlatformMode: false,
  // 网页标题后缀
  showPageTitleSuffix: true
};

export default setting;

import type { App, Directive, DirectiveBinding } from 'vue';

// import { checkPermission } from '/@/logics/helper/permission';

const permissionDirective: Directive = function (
  el: HTMLElement,
  binding: DirectiveBinding<string | string[]>
) {
  if (binding.value !== binding.oldValue) {
    // 判断是否有权限
    // const hasPermission = checkPermission(binding.value);
    const hasPermission = true;

    // 没有权限的操作
    if (!hasPermission) {
      const arg = binding.arg || 'hide';
      if (arg === 'hide') {
        el.style.display = 'none';
        el.innerHTML = '';
      } else if (arg === 'blur') {
        el.style.visibility = 'hidden';
        setTimeout(() => {
          const elWidth = el.clientWidth;
          const elHeight = el.clientHeight;
          el.style.display = 'none';
          el.style.visibility = 'visible';
          el.style.width = elWidth + 'px';
          el.style.height = elHeight + 'px';
          el.style.position = 'relative';
          el.innerHTML = `<div style="width: 100%; height: 100%; position: absolute; top: 0px; left: 0px; background-color: white; opacity: 0.5; display: flex; justify-content: center; align-items: center; overflow: hidden;"><div style="font-size: 14px"><i class="el-icon-circle-close" style="margin-right: 5px"></i>无权限</div></div>`;
          el.style.display = 'block';
        }, 100);
      }
    }
  }
};

export function setupPermissionDirective(app: App) {
  app.directive('per', permissionDirective);
}

export default permissionDirective;

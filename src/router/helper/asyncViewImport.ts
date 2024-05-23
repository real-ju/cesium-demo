let viewModules: any;
let layoutModules: any;

/**
 * 异步导入页面级组件
 * @param {String} url 相对于/src/views文件夹的路径
 */
export function asyncViewImport(url: string) {
  if (!viewModules) {
    viewModules = import.meta.glob('../../views/**/*.vue'); // 这里只能用相对路径
  }
  return viewModules[`../../views/${url}`];
}

/**
 * 异步导入布局级组件
 * @param {String} url 相对于/src/layouts文件夹的路径
 */
export function asyncLayoutImport(url: string) {
  if (!layoutModules) {
    layoutModules = import.meta.glob('../../layouts/**/*.vue'); // 这里只能用相对路径
  }
  return layoutModules[`../../layouts/${url}`];
}

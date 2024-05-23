// @ts-nocheck
import type { Plugin } from 'vite';

import Components from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';

/**
 * 组件按需引入
 * https://next.antdv.com/docs/vue/introduce-cn
 */
export function configComponentsImportPlugin() {
  const componentsImportPlugin: Plugin = Components({
    dirs: [], // 默认会从/src/components目录导入组件
    resolvers: [AntDesignVueResolver()],
    dts: './types/components.d.ts'
  });

  return componentsImportPlugin;
}

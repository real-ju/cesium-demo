import type { Plugin, PluginOption } from 'vite';

import vue from '@vitejs/plugin-vue';
import vueSetupExtend from 'vite-plugin-vue-setup-extend';
import { configHtmlPlugin } from './html';
import { configAutoImportPlugin } from './autoImport';
import { configSvgIconsPlugin } from './svgSprite';

export function createVitePlugins(env: ViteEnv) {
  const vitePlugins: (Plugin | Plugin[] | PluginOption | PluginOption[])[] = [
    // have to
    vue(),
    vueSetupExtend()
  ];

  vitePlugins.push(configHtmlPlugin(env));
  vitePlugins.push(configAutoImportPlugin());
  vitePlugins.push(configSvgIconsPlugin());

  return vitePlugins;
}

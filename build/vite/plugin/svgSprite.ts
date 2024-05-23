/**
 * Vite Plugin for fast creating SVG sprites.
 * https://github.com/anncwb/vite-plugin-svg-icons
 */
import type { Plugin } from 'vite';

import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import { pathResolve } from '../../utils';

export function configSvgIconsPlugin() {
  const svgIconsPlugin: Plugin = createSvgIconsPlugin({
    iconDirs: [pathResolve('src/assets/icons')],
    svgoOptions: process.env.NODE_ENV === 'production',
    symbolId: '[dir]-[name]'
  });
  return svgIconsPlugin;
}

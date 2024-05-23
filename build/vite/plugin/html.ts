import type { PluginOption } from 'vite';

import { createHtmlPlugin } from 'vite-plugin-html';

export function configHtmlPlugin(env: ViteEnv) {
  const htmlPlugin: PluginOption[] = createHtmlPlugin({
    inject: {
      data: {
        title: env.VITE_APP_TITLE
      }
    }
  });

  return htmlPlugin;
}

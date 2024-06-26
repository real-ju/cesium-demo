import type { UserConfig, ConfigEnv } from 'vite';
import { loadEnv } from 'vite';
import { createVitePlugins } from './build/vite/plugin';
import { wrapEnv, pathResolve } from './build/utils';

// https://vitejs.dev/config/
export default ({ mode }: ConfigEnv): UserConfig => {
  const root = process.cwd();
  const env = loadEnv(mode, root);

  const viteEnv = wrapEnv(env);

  return {
    base: viteEnv.VITE_PUBLIC_PATH,
    resolve: {
      alias: [
        // /@/xxxx => /src/xxxx
        {
          find: /\/@\//,
          replacement: pathResolve('src') + '/'
        },
        // /#/xxxx => /types/xxxx
        {
          find: /\/#\//,
          replacement: pathResolve('types') + '/'
        }
      ]
    },
    plugins: createVitePlugins(viteEnv),
    server: {
      host: true,
      proxy: {
        '/api': {
          target: viteEnv.VITE_DEV_SERVER_PROXY,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    },
    define: {
      'process.env.VITE_ENV': viteEnv
    },
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true
        }
      }
    },
    build: {
      // outDir: 'dist' + viteEnv.VITE_PUBLIC_PATH,
      outDir: 'docs',
      sourcemap: mode === 'development'
    }
  };
};

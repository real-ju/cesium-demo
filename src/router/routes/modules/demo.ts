import type { RouteRecordRaw } from 'vue-router';

import { asyncViewImport } from '/@/router/helper/asyncViewImport';

const demo: RouteRecordRaw = {
  path: '/demo',
  name: 'demo',
  meta: {
    title: 'Cesium智慧城市',
    public: true,
    hideTitleSuffix: true
  },
  component: asyncViewImport('demo/index.vue')
};

export default demo;

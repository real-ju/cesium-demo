import type { RouteRecordRaw } from 'vue-router';

import { asyncViewImport } from '/@/router/helper/asyncViewImport';

const test: RouteRecordRaw = {
  path: '/test',
  name: 'test',
  meta: {
    title: '测试',
    public: true
  },
  component: asyncViewImport('test/index.vue')
};

export default test;

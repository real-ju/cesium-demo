// @ts-nocheck
import type { App } from 'vue';

import { plugin } from 'echarts-for-vue';
import * as echarts from 'echarts';
import { h } from 'vue';

export function setupEcharts(app: App) {
  app.use(plugin, { echarts, h });
}

<template>
  <router-view v-slot="{ Component, route }">
    <keep-alive :include="getCacheInclude(Component, route)">
      <component :is="Component" :key="route.fullPath" />
    </keep-alive>
  </router-view>
</template>

<script setup lang="ts" name="LAliveRouterView">
import type { VNode } from 'vue';
import type { RouteLocationNormalizedLoaded } from 'vue-router';

const cacheInclude: Set<string> = new Set();
const getCacheInclude = (Component: VNode, route: RouteLocationNormalizedLoaded) => {
  // 添加路由缓存
  if (route.meta.cache !== false) {
    const compType: any = Component.type;
    if (compType.name) {
      cacheInclude.add(compType.name);
    }
  }
  return Array.from(cacheInclude);
};
</script>

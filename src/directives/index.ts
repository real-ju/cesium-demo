/**
 * Configure and register global directives
 */
import type { App } from 'vue';
import { setupLoadingDirective } from './loading';
import { setupPermissionDirective } from './permission';

export function setupGlobDirectives(app: App) {
  setupLoadingDirective(app);
  setupPermissionDirective(app);
}

import { MockPlatformAdapter } from './mock/MockPlatformAdapter';
import { WebosPlatformAdapter } from './webos/WebosPlatformAdapter';
import type { WebosRuntime } from './webos/runtime';

export function selectPlatform(runtime: WebosRuntime | undefined, demo = false) {
  return runtime && !demo ? new WebosPlatformAdapter(runtime) : new MockPlatformAdapter();
}

import { TvShell } from './TvShell';
import { MockPlatformAdapter } from '../platform/mock/MockPlatformAdapter';

const platform = new MockPlatformAdapter();

export function App() {
  return <TvShell platform={platform} />;
}

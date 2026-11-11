import { TvShell } from './TvShell';
import { useMemo, useState } from 'react';
import { selectPlatform } from '../platform/selectPlatform';
import { getWebosRuntime } from '../platform/webos/runtime';

const runtime = getWebosRuntime();
const platformBack = runtime ? () => runtime.platformBack() : undefined;

export function App() {
  const [demo, setDemo] = useState(false);
  const platform = useMemo(() => selectPlatform(runtime, demo), [demo]);
  return <TvShell platform={platform} onPlatformBack={platformBack} onModeChange={runtime ? () => setDemo(value => !value) : undefined} />;
}

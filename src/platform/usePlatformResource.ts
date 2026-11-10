import { useEffect, useMemo, useRef, useState } from 'react';
import type { PlatformAdapter } from './contracts';

export const platformReadTimeoutMs = 10_000;
type ReadError = { readonly status: 'error'; readonly message: string };

/** Shared read/retry and command lifetime for the three platform-backed Home regions. */
export function usePlatformResource<T>(platform: PlatformAdapter, load: (platform: PlatformAdapter) => Promise<T>) {
  const [attempt, setAttempt] = useState(0);
  const scope = useMemo(() => ({ platform, attempt }), [platform, attempt]);
  const [snapshot, setSnapshot] = useState<{ scope: object; value: T | ReadError } | null>(null);
  const [pending, setPending] = useState<object | null>(null);
  const active = useRef<object | null>(null);
  const lock = useRef<object | null>(null);

  useEffect(() => {
    active.current = scope;
    let settled = false;
    const finish = (value: T | ReadError) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      setSnapshot({ scope, value });
    };
    const timer = window.setTimeout(() => finish({ status: 'error', message: 'La piattaforma non risponde. Riprova.' }), platformReadTimeoutMs);
    void load(platform).then(finish, () => finish({ status: 'error', message: 'Piattaforma non disponibile. Riprova.' }));
    return () => {
      settled = true;
      window.clearTimeout(timer);
      if (active.current === scope) active.current = null;
    };
  }, [platform, load, scope]);

  async function runCommand<R>(command: () => Promise<R>, apply: (result: R) => void) {
    if (active.current !== scope || lock.current === scope) return;
    lock.current = scope;
    setPending(scope);
    try {
      const result = await command();
      if (active.current === scope) apply(result);
    } finally {
      if (lock.current === scope) lock.current = null;
      if (active.current === scope) setPending(previous => previous === scope ? null : previous);
    }
  }

  return {
    state: snapshot?.scope === scope ? snapshot.value : null,
    busy: pending === scope,
    reload: () => setAttempt(value => value + 1),
    update: (change: (previous: T | ReadError) => T | ReadError) => setSnapshot(previous => previous?.scope === scope
      ? { scope, value: change(previous.value) } : previous),
    runCommand,
  };
}

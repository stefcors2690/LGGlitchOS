/** Narrow public webOSTV.js surface. Never call Palm bridges directly. */
export interface WebosRuntime {
  readonly platform: { readonly tv?: boolean };
  readonly service: {
    request(uri: string, options: {
      method: string;
      parameters: { keys: readonly string[] };
      subscribe: false;
      onSuccess: (value: unknown) => void;
      onFailure: (value: unknown) => void;
    }): { cancel(): void };
  };
  platformBack(): void;
}

export function getWebosRuntime(host: { readonly webOS?: WebosRuntime } = typeof window === 'undefined' ? {} : window as Window & { webOS?: WebosRuntime }): WebosRuntime | undefined {
  const runtime = host.webOS;
  return runtime?.platform?.tv === true && typeof runtime.service?.request === 'function' && typeof runtime.platformBack === 'function'
    ? runtime : undefined;
}

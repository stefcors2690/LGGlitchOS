/** Vite-only acceptance fixture. Not imported by the application or ordinary build. */
import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { TvShell } from '../../app/TvShell';
import { MockPlatformAdapter } from '../mock/MockPlatformAdapter';
import type { PlatformAdapter, Result } from '../contracts';
import '../../styles/global.css';

type Scenario = 'ready' | 'empty' | 'loading' | 'errors' | 'rejected' | 'unsupported-list' | 'unsupported-command' | 'command-errors' | 'slow-command';
const scenarios: readonly Scenario[] = ['ready', 'empty', 'loading', 'errors', 'rejected', 'unsupported-list', 'unsupported-command', 'command-errors', 'slow-command'];
const waits: (() => void)[] = [];
let failures = true;
const counts = { app: 0, input: 0, device: 0 };

function createScenario(scenario: Scenario): PlatformAdapter {
  const unsupported = scenario === 'unsupported-list' ? { appCatalog: 'Catalogo non supportato.', inputList: 'Elenco ingressi non supportato.', smartHomeList: 'Elenco domotica non supportato.' }
    : scenario === 'unsupported-command' ? { appLaunch: 'Avvio non supportato.', inputActivate: 'Cambio ingresso non supportato.', smartHomeSetState: 'Comando domotica non supportato.' } : {};
  const mock = new MockPlatformAdapter({ unsupported, failures: scenario === 'command-errors'
    ? { appLaunch: 'Errore simulato di avvio.', inputActivate: 'Errore simulato di cambio.', smartHomeSetState: 'Errore simulato di comando.' } : {} });
  async function read<T>(operation: () => Promise<Result<readonly T[]>>): Promise<Result<readonly T[]>> {
    if (scenario === 'loading') await new Promise<void>(resolve => waits.push(resolve));
    if (scenario === 'rejected') throw new Error('Trasporto simulato assente');
    if (scenario === 'errors' && failures) return { ok: false, mode: 'demo', error: { code: 'UNAVAILABLE', message: 'Lettura demo non disponibile.' } };
    return scenario === 'empty' ? { ok: true, mode: 'demo', data: [] } : operation();
  }
  async function command<T>(kind: keyof typeof counts, operation: () => Promise<T>) {
    counts[kind]++;
    if (scenario === 'slow-command') await new Promise<void>(resolve => waits.push(resolve));
    return operation();
  }
  return {
    ...mock,
    appCatalog: { list: () => read(() => mock.appCatalog.list()) },
    appLauncher: { launch: id => command('app', () => mock.appLauncher.launch(id)) },
    inputSource: { list: () => read(() => mock.inputSource.list()), activate: id => command('input', () => mock.inputSource.activate(id)) },
    smartHome: { listDevices: () => read(() => mock.smartHome.listDevices()), setState: (id, state) => command('device', () => mock.smartHome.setState(id, state)) },
  };
}

export function PlatformFixture() {
  const [platform, setPlatform] = useState(() => createScenario('ready'));
  return <>
    <nav aria-label="Scenari tecnici Demo" style={{ position: 'fixed', top: 0, left: 0, zIndex: 100, fontSize: 12 }}>
      {scenarios.map(scenario => <button id={`scenario-${scenario}`} key={scenario} onClick={() => {
        failures = true; counts.app = counts.input = counts.device = 0; setPlatform(createScenario(scenario));
      }}>{scenario}</button>)}
      <button id="recover-reads" onClick={() => { failures = false; }}>Ripristina letture</button>
      <button id="resolve-pending" onClick={() => { waits.splice(0).forEach(resolve => resolve()); }}>Risolvi risposte tardive</button>
      <button id="read-counts" onClick={() => { document.getElementById('command-counts')!.textContent = JSON.stringify(counts); }}>Contatori comandi</button>
      <output id="command-counts" />
    </nav>
    <TvShell platform={platform} />
  </>;
}
const root = document.getElementById('root');
if (root && import.meta.env.DEV) createRoot(root).render(<StrictMode><PlatformFixture /></StrictMode>);

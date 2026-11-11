import { useState } from 'react';
import type { InputInfo, PlatformAdapter } from '../../platform/contracts';
import { activateInput, loadInputs } from './inputActions';
import { usePlatformResource } from '../../platform/usePlatformResource';
import { ResourceNotice } from '../../components/ResourceNotice';
import './inputs.css';

export function InputsWidget({ platform }: { readonly platform: PlatformAdapter }) {
  const { state, busy, reload, update: setState, runCommand } = usePlatformResource(platform, loadInputs);
  const [feedback, setFeedback] = useState({ platform, text: '' });
  const message = feedback.platform === platform ? feedback.text : '';
  const setMessage = (text: string) => setFeedback({ platform, text });
  async function activate(input: InputInfo) {
    if (state?.status !== 'ready' || state.disabledReason !== undefined) return;
    await runCommand(() => activateInput(platform, input.id), result => {
      if (result.ok) {
        setState(previous => previous?.status === 'ready' ? { ...previous, inputs: previous.inputs.map(item => ({ ...item, active: item.id === result.data.id })) } : previous);
        setMessage(result.mode === 'demo' ? `Cambio simulato: ${result.data.name}. Nessun ingresso TV reale modificato.` : `Ingresso selezionato: ${result.data.name}.`);
      } else setMessage(`Cambio non riuscito: ${result.error.message}`);
    });
  }

  return <section className="inputs-widget holographic-panel widget-placeholder" aria-labelledby="inputs-title" aria-busy={!state || busy}>
    <svg className="inputs-frame" viewBox="0 0 600 200" preserveAspectRatio="none" aria-hidden="true">
      <path d="M25 3H575L597 23V177L575 197H25L3 177V23Z" fill="#0b1427" fillOpacity=".95" stroke="#385a73" />
      <path d="M28 9H572L590 27V173L572 190H28L10 173V27Z" fill="none" stroke="#4e7790" strokeOpacity=".5" />
      <path className="inputs-cyan" d="M25 197 3 177V23L25 3H575L597 23M530 11h35" />
      <path className="inputs-magenta" d="M597 145V177L575 197H80M14 40V25L30 11" />
    </svg>
    <h2 id="inputs-title" className="inputs-heading"><svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><rect x="3" y="4" width="26" height="20" rx="2" /><path d="M8 11h16v6H8zM10 29h12" /></svg>Ingressi<span>{platform.mode === 'demo' ? 'Demo' : 'TV'}</span></h2>
    <ResourceNotice id="inputs" zone="widgets" label={platform.mode === 'demo' ? 'ingressi demo' : 'ingressi TV'} loading={!state}
      error={state?.status === 'error' ? state.message : undefined} empty={state?.status === 'ready' && state.inputs.length === 0}
      onRetry={() => { setMessage(''); reload(); }} />
    {state?.status === 'ready' && <>
      <div className="input-buttons" aria-label={platform.mode === 'demo' ? 'Sorgenti demo' : 'Sorgenti TV'}>
        {state.inputs.map(input => <button key={input.id} type="button" className="input-button" data-tv-id={`input-${input.id}`} data-tv-zone="widgets"
          aria-label={`${input.name} · ${input.mode === 'demo' ? 'Cambio simulato' : 'Seleziona ingresso'}`} aria-pressed={input.active}
          aria-disabled={busy || state.disabledReason !== undefined} aria-describedby="inputs-feedback" onClick={() => { void activate(input); }}>
          <svg viewBox="0 0 64 40" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            {input.kind === 'hdmi' ? <path d="M7 9h50v17l-10 8H17L7 26zM15 17h34v7H15" /> : <path d="M17 4h30v25H17zM32 29v7M23 37h18" />}
          </svg><span>{input.name.replace(/ demo$/, '')}</span>
        </button>)}
      </div>
      <p id="inputs-feedback" className="input-feedback" role="status" aria-atomic="true">{state.disabledReason ?? (busy ? 'Cambio ingresso in corso…' : message)}</p>
    </>}
  </section>;
}

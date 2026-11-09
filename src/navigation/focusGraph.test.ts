import { describe, expect, it } from 'vitest';
import { mapRemoteKey, nextFocus } from './focusGraph';
import type { FocusNode } from './focusGraph';

const nodes: FocusNode[] = [
  { id: 'home', zone: 'header' }, { id: 'apps', zone: 'header' },
  { id: 'pause', zone: 'controls' },
  { id: 'cinema', zone: 'rail' }, { id: 'music', zone: 'rail' }, { id: 'video', zone: 'rail' },
];

describe('TV focus graph', () => {
  it('does not trap or wrap at horizontal and vertical boundaries', () => {
    expect(nextFocus(nodes, 'home', 'left', {})).toBe('home');
    expect(nextFocus(nodes, 'video', 'right', {})).toBe('video');
    expect(nextFocus(nodes, 'home', 'up', {})).toBe('home');
    expect(nextFocus(nodes, 'music', 'down', {})).toBe('music');
    expect(nextFocus(nodes, 'home', 'right', {})).toBe('apps');
    expect(nextFocus(nodes, 'music', 'left', {})).toBe('cinema');
  });
  it('visits all available rows and remembers the last position in each', () => {
    expect(nextFocus(nodes, 'apps', 'down', {})).toBe('pause');
    expect(nextFocus(nodes, 'pause', 'down', { rail: 'video' })).toBe('video');
    expect(nextFocus(nodes, 'video', 'up', {})).toBe('pause');
    expect(nextFocus(nodes, 'pause', 'up', { header: 'apps' })).toBe('apps');
  });
  it('skips absent/disabled rows and clamps differing row lengths', () => {
    const filtered = nodes.filter(node => node.zone !== 'controls');
    expect(nextFocus(filtered, 'apps', 'down', {})).toBe('music');
    expect(nextFocus(filtered, 'video', 'up', {})).toBe('apps');
    expect(nextFocus(filtered, 'home', 'down', { rail: 'removed' })).toBe('cinema');
  });
  it('handles empty catalogs, missing nodes and stale memories', () => {
    expect(nextFocus([], null, 'down', {})).toBeNull();
    expect(nextFocus(nodes, 'removed', 'right', {})).toBe('home');
    expect(nextFocus(nodes.slice(0, 2), 'apps', 'down', { rail: 'cinema' })).toBe('apps');
  });
});

describe('remote key map', () => {
  it.each(['Enter', 'OK', 'Accept', 'Select'])('maps %s to activation', key => expect(mapRemoteKey(key)).toBe('activate'));
  it.each(['Escape', 'Back', 'BrowserBack', 'Backspace'])('maps %s to browser back', key => expect(mapRemoteKey(key)).toBe('back'));
  it.each(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'])('maps %s to movement', key => expect(mapRemoteKey(key)).not.toBeNull());
  it.each(['Tab', ' ', 'Home', 'MediaPlayPause', 'a'])('leaves %s to the browser', key => expect(mapRemoteKey(key)).toBeNull());
});

describe('continue-watching row', () => {
  const expanded: FocusNode[] = [...nodes, { id: 'resume', zone: 'widgets' }];
  it('reaches the widget from any rail card and returns to the remembered card', () => {
    expect(nextFocus(expanded, 'video', 'down', {})).toBe('resume');
    expect(nextFocus(expanded, 'resume', 'up', { rail: 'video' })).toBe('video');
    expect(nextFocus(expanded, 'resume', 'down', {})).toBe('resume');
  });
  it('skips the widget when its Home region is absent', () => {
    expect(nextFocus(nodes, 'video', 'down', { widgets: 'resume' })).toBe('video');
  });
});

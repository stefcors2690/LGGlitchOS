import { describe, expect, it, vi } from 'vitest';
import { ParticleEngine } from './ParticleEngine';
import { FlyingVehicleEngine } from './FlyingVehicleEngine';
import { backgroundConfig, validateBackgroundConfig } from '../background.config';
const sprites = [{}, {}] as HTMLCanvasElement[];
function context() { return { drawImage: vi.fn(), globalAlpha: 1 } as unknown as CanvasRenderingContext2D; }
describe('ambient particle pool', () => {
  it('renders the configured count, disables completely, and validates the cap', () => {
    for (const [enabled, count, expected] of [[true, 40, 40], [false, 40, 0], [true, 0, 0], [true, 200, 200]] as const) {
      const engine = new ParticleEngine({ enabled, count }); const ctx = context();
      engine.draw(ctx, sprites, 33);
      expect(engine.count).toBe(expected); expect(ctx.drawImage).toHaveBeenCalledTimes(expected);
    }
    for (const count of [-1, .5, 201, NaN]) expect(() => validateBackgroundConfig({ ...backgroundConfig, particles: { enabled: true, count } })).toThrow(RangeError);
  });
  it('moves slowly, preserves normalized position through resize, and restores context alpha', () => {
    const engine = new ParticleEngine({ enabled: true, count: 1 }, () => .5); const ctx = context();
    engine.resize(1920, 1080); engine.draw(ctx, sprites, 0);
    const initial = vi.mocked(ctx.drawImage).mock.calls[0]!;
    engine.draw(ctx, sprites, 100);
    const moved = vi.mocked(ctx.drawImage).mock.calls[1]!;
    expect(Number(moved[1]) - Number(initial[1])).toBeGreaterThan(0);
    expect(Number(moved[1]) - Number(initial[1])).toBeLessThan(1);
    expect(Number(moved[2])).toBeLessThan(Number(initial[2]));
    engine.resize(960, 540); engine.draw(ctx, sprites, 0);
    const resized = vi.mocked(ctx.drawImage).mock.calls[2]!;
    for (let i = 1; i <= 4; i++) expect(Number(resized[i])).toBeCloseTo(Number(moved[i]) / 2);
    expect(ctx.globalAlpha).toBe(1);
  });
  it('recycles for 20 simulated minutes without invalid coordinates or changing count', () => {
    const engine = new ParticleEngine({ enabled: true, count: 2 }, () => .99);
    engine.resize(1920, 1080);
    let draws = 0;
    const ctx = { globalAlpha: 1, drawImage: (_: unknown, x: number, y: number, w: number, h: number) => {
      expect([x, y, w, h].every(Number.isFinite)).toBe(true);
      expect(x).toBeGreaterThan(-50); expect(x).toBeLessThan(1970);
      expect(y).toBeGreaterThan(-50); expect(y).toBeLessThan(1130); draws++;
    } } as unknown as CanvasRenderingContext2D;
    for (let i = 0; i < 12000; i++) engine.draw(ctx, sprites, 100);
    expect(draws).toBe(24000); expect(engine.count).toBe(2);
  });
  it('clamps long resume gaps and tolerates absent sprites without clearing other effects', () => {
    const a = new ParticleEngine({ enabled: true, count: 1 }, () => .5);
    const b = new ParticleEngine({ enabled: true, count: 1 }, () => .5);
    const first = context(); const second = context();
    a.draw(first, sprites, 100000); b.draw(second, sprites, 100);
    expect(first.drawImage).toHaveBeenCalledWith(...vi.mocked(second.drawImage).mock.calls[0]!);
    a.draw(first, [], 33); expect(first.drawImage).toHaveBeenCalledTimes(1);
  });
});
describe('optional vehicle module', () => {
  it('never draws with default config or without a separately supplied asset', () => {
    const ctx = context(); const asset = { image: sprites[0]!, aspectRatio: 3 };
    for (const engine of [new FlyingVehicleEngine(backgroundConfig.flyingVehicles, asset), new FlyingVehicleEngine({ enabled: true }), new FlyingVehicleEngine({ enabled: true }, { ...asset, aspectRatio: 0 })]) {
      expect(engine.active).toBe(false); engine.draw(ctx, 33);
    }
    expect(ctx.drawImage).not.toHaveBeenCalled();
  });
  it('uses only the supplied transparent sprite and leaves a long gap between crossings', () => {
    const ctx = context(); const engine = new FlyingVehicleEngine({ enabled: true }, { image: sprites[0]!, aspectRatio: 3 });
    engine.resize(1920, 1080); engine.draw(ctx, 100);
    expect(engine.active).toBe(true); expect(vi.mocked(ctx.drawImage).mock.calls[0]![0]).toBe(sprites[0]);
    for (let i = 0; i < 190; i++) engine.draw(ctx, 100);
    vi.mocked(ctx.drawImage).mockClear();
    for (let i = 0; i < 100; i++) engine.draw(ctx, 100);
    expect(ctx.drawImage).not.toHaveBeenCalled();
  });
});

import { describe, expect, it, vi } from 'vitest';
import { getRainBuffer, RainEngine } from './RainEngine';
import { backgroundConfig } from '../background.config';
function context() { return { clearRect: vi.fn(), drawImage: vi.fn(), globalAlpha: 1 } as unknown as CanvasRenderingContext2D; }
const sprites = [{}, {}, {}] as HTMLCanvasElement[];
describe('rain pool and rendering budget', () => {
  it('limits 4K and high DPR buffers to Full HD', () => {
    expect(getRainBuffer(3840, 2160, 2, 1)).toEqual({ width: 1920, height: 1080 });
    expect(getRainBuffer(960, 540, 3, 1)).toEqual({ width: 960, height: 540 });
    expect(getRainBuffer(0, 0, 1, 1)).toEqual({ width: 1, height: 1 });
  });
  it('allocates a fixed bounded pool and draws varied depths without replacing it', () => {
    let seed = 1; const random = () => ((seed = seed * 16807 % 2147483647) - 1) / 2147483646;
    const rain = new RainEngine(backgroundConfig.rain, random);
    const ctx = context(); rain.resize(1920, 1080); rain.draw(ctx, sprites, 33);
    expect(rain.count).toBe(208); expect(ctx.drawImage).toHaveBeenCalledTimes(208);
    const calls = vi.mocked(ctx.drawImage).mock.calls;
    expect(new Set(calls.map(call => call[0])).size).toBe(3);
    rain.resize(960, 540); rain.draw(ctx, sprites, 33);
    expect(rain.count).toBe(208); expect(ctx.globalAlpha).toBe(1);
  });
  it('has no drops when disabled, speed zero or intensity zero', () => {
    for (const config of [{...backgroundConfig.rain, enabled:false},{...backgroundConfig.rain,speed:0},{...backgroundConfig.rain,intensity:0}]) {
      const ctx = context(); const rain = new RainEngine(config); rain.draw(ctx,sprites,33);
      expect(rain.count).toBe(0); expect(ctx.drawImage).not.toHaveBeenCalled();
    }
  });
  it('recycles out-of-bounds drops and keeps positions finite through long use', () => {
    const rain = new RainEngine(backgroundConfig.rain, () => 0.5); const ctx = context(); rain.resize(1920,1080);
    for(let i=0;i<1000;i++) rain.draw(ctx,sprites,100);
    expect(vi.mocked(ctx.drawImage).mock.calls.every(call => call.slice(1).every(Number.isFinite))).toBe(true);
  });
});

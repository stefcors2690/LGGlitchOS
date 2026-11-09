import { BrandLogo } from '../components/BrandLogo';
import { LocalClock } from '../features/clock/LocalClock';
export function ShellHeader({ logoAnimated }: { readonly logoAnimated: boolean }) {
  return (
    <header className="shell-header">
      <BrandLogo animated={logoAnimated} />
      <LocalClock />
    </header>
  );
}

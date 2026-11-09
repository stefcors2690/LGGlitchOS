import './city.css';

interface CityBackdropProps { readonly animated: boolean }

/** User-supplied local scenery, separate from all semantic/interactive UI. */
export function CityBackdrop({ animated }: CityBackdropProps) {
  return (
    <div className="city-backdrop" data-motion={animated ? 'running' : 'still'} aria-hidden="true">
      <div className="city-layer city-image" />
      <div className="city-fog" />
      <div className="city-flight city-flight-near"><span className="city-shuttle" /></div>
      <div className="city-flight city-flight-far"><span className="city-shuttle" /></div>
      <div className="city-rain" />
      <div className="city-scrim" />
    </div>
  );
}

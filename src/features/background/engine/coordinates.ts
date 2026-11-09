import type { Region, Size } from '../background.types';

/** Same centered cover transform as object-fit:cover, including offscreen crop. */
export function getCoverTransform(image: Size, viewport: Size) {
  if (![image.width, image.height, viewport.width, viewport.height].every(value => Number.isFinite(value) && value > 0)) throw new RangeError('Dimensioni immagine/viewport non valide.');
  const scale = Math.max(viewport.width / image.width, viewport.height / image.height);
  const width = image.width * scale;
  const height = image.height * scale;
  return { scale, width, height, x: (viewport.width - width) / 2, y: (viewport.height - height) / 2 };
}
export function mapRegion(region: Region, image: Size, viewport: Size): Region {
  const cover = getCoverTransform(image, viewport);
  return { x: cover.x + region.x * cover.width, y: cover.y + region.y * cover.height, width: region.width * cover.width, height: region.height * cover.height };
}

export interface BackgroundConditions {
  readonly reducedMotion: boolean;
  readonly pageVisible: boolean;
  readonly userPaused: boolean;
  readonly idle?: boolean;
}

export function shouldAnimateBackground(conditions: BackgroundConditions): boolean {
  return !conditions.reducedMotion && conditions.pageVisible && !conditions.userPaused && !conditions.idle;
}

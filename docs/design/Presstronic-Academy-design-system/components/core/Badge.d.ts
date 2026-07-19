/** Mono uppercase status / category badge. Square, never a pill. */
export interface BadgeProps {
  /** 'neutral' | 'cyan' | 'volt' | 'green' | 'red' */
  tone?: 'neutral' | 'cyan' | 'volt' | 'green' | 'red';
  /** 'soft' (tint + border) | 'solid' */
  variant?: 'soft' | 'solid';
  style?: React.CSSProperties;
  children?: React.ReactNode;
}
export declare function Badge(props: BadgeProps): JSX.Element;

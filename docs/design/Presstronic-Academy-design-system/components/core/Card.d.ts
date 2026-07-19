/** Surface card: graphite fill, hairline border, radius 0. */
export interface CardProps {
  /** Clip the top-right corner (signature motif). */
  notch?: boolean;
  /** Selected state: 2px accent left edge + tint fill. */
  selected?: boolean;
  /** Edge color when selected: 'cyan' (default) or 'volt' (story choices). */
  selectedTone?: 'cyan' | 'volt';
  /** Hover strengthens border + lightens fill; pointer cursor. */
  interactive?: boolean;
  /** Inner padding in px. Default 20. */
  padding?: number | string;
  style?: React.CSSProperties;
  onClick?: () => void;
  children?: React.ReactNode;
}
export declare function Card(props: CardProps): JSX.Element;

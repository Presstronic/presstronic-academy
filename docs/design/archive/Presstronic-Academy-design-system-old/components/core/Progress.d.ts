/** Square progress / XP bar with optional mono label row. */
export interface ProgressProps {
  value?: number;
  max?: number;
  /** 'cyan' | 'volt' | 'green' */
  tone?: 'cyan' | 'volt' | 'green';
  /** Mono uppercase label above the track. */
  label?: string;
  /** Show "value / max" readout. */
  showValue?: boolean;
  /** Track height in px. Default 8. */
  height?: number;
  style?: React.CSSProperties;
}
export declare function Progress(props: ProgressProps): JSX.Element;

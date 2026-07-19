/** Hover tooltip: mono 10px, graphite panel, square. */
export interface TooltipProps {
  content: React.ReactNode;
  /** 'top' (default) | 'bottom' */
  side?: 'top' | 'bottom';
  style?: React.CSSProperties;
  children?: React.ReactNode;
}
export declare function Tooltip(props: TooltipProps): JSX.Element;

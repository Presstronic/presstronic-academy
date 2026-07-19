/** Native select styled to match Input; mono chevron. */
export interface SelectProps {
  label?: string;
  /** Array of strings or { value, label }. */
  options: Array<string | { value: string; label: string }>;
  value?: string;
  onChange?: (e: any) => void;
  style?: React.CSSProperties;
  selectStyle?: React.CSSProperties;
}
export declare function Select(props: SelectProps): JSX.Element;

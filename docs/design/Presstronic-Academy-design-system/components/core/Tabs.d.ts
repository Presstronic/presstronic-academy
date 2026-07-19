/** Underline tabs with mono uppercase labels; active = cyan text + 2px bottom edge. */
export interface TabsProps {
  /** Array of strings or { value, label } objects. */
  items: Array<string | { value: string; label: string }>;
  /** Controlled active value; uncontrolled if omitted. */
  value?: string;
  onChange?: (value: string) => void;
  style?: React.CSSProperties;
}
export declare function Tabs(props: TabsProps): JSX.Element;

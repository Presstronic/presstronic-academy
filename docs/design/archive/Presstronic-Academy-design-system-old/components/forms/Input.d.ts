/** Text input: inset graphite field, square, cyan focus ring. */
export interface InputProps {
  /** Mono uppercase label above the field. */
  label?: string;
  /** Helper text below. */
  hint?: string;
  /** Error message; turns field + label red. */
  error?: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: any) => void;
  style?: React.CSSProperties;
  inputStyle?: React.CSSProperties;
}
export declare function Input(props: InputProps): JSX.Element;

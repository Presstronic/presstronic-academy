/**
 * Academy action button. Square corners, mono uppercase label.
 * @startingPoint section="Components" subtitle="Primary / secondary / ghost / destructive, square, mono label" viewport="700x220"
 */
export interface ButtonProps {
  /** 'primary' | 'secondary' | 'ghost' | 'destructive' */
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  /** 'sm' | 'md' | 'lg' */
  size?: 'sm' | 'md' | 'lg';
  /** Clip the top-right corner (signature CTA motif — max one class per screen). */
  notch?: boolean;
  /** Subtle cyan edge-glow; primary variant only. */
  glow?: boolean;
  disabled?: boolean;
  style?: React.CSSProperties;
  onClick?: () => void;
  children?: React.ReactNode;
}
export declare function Button(props: ButtonProps): JSX.Element;

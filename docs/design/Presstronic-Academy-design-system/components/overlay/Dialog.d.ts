/** Modal dialog: notched panel on a 65% black scrim. */
export interface DialogProps {
  open?: boolean;
  onClose?: () => void;
  /** Mono uppercase eyebrow, e.g. "// CONFIRM". */
  eyebrow?: string;
  title?: string;
  /** Action row content (Buttons). */
  footer?: React.ReactNode;
  /** Panel width in px. Default 480. */
  width?: number;
  children?: React.ReactNode;
}
export declare function Dialog(props: DialogProps): JSX.Element;

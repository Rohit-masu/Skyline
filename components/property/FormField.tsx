interface ControlProps {
  id: string;
  "aria-invalid": boolean;
  "aria-describedby"?: string;
}

interface FormFieldProps {
  id: string;
  label: string;
  error?: string;
  optional?: boolean;
  hint?: string;
  /** Receives the id and aria attributes to spread on the input. */
  children: (control: ControlProps) => React.ReactNode;
}

// Label, control and inline error wired together: the error is announced through
// aria-describedby and the control is marked aria-invalid.
export function FormField({ id, label, error, optional, hint, children }: FormFieldProps) {
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(" ") || undefined;

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-xs text-mist">
        {label}{" "}
        {optional ? <span className="text-mist/70">(optional)</span> : <span aria-hidden="true" className="text-brass">*</span>}
      </label>
      {children({ id, "aria-invalid": Boolean(error), "aria-describedby": describedBy })}
      {hint && !error && (
        <p id={hintId} className="text-[11px] text-mist/80">{hint}</p>
      )}
      {error && (
        <p id={errorId} className="text-[11px] text-red-400">{error}</p>
      )}
    </div>
  );
}

import type { FieldError, UseFormRegisterReturn } from "react-hook-form";

type FormFieldProps = {
  label: string;
  error?: FieldError;
  registration: UseFormRegisterReturn;
  multiline?: boolean;
};

export function FormField({
  label,
  error,
  registration,
  multiline = false,
}: FormFieldProps) {
  const fieldClass = "contact-input";
  const errorId = `${registration.name}-error`;

  return (
    <label className="contact-field">
      <span className="contact-field-label">{label}</span>
      {multiline ? (
        <textarea
          className={fieldClass}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          maxLength={2000}
          {...registration}
        />
      ) : (
        <input
          className={fieldClass}
          type={registration.name === "email" ? "email" : "text"}
          autoComplete={registration.name === "email" ? "email" : "name"}
          maxLength={registration.name === "name" ? 100 : undefined}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          {...registration}
        />
      )}
      {error ? (
        <span
          id={errorId}
          className="mt-2 block text-sm text-[var(--color-gold-light)]"
        >
          {error.message}
        </span>
      ) : null}
    </label>
  );
}

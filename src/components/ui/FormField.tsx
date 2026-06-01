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
  const fieldClass =
    "mt-2 w-full border border-[var(--color-border)] bg-[#0D131A] px-4 py-3 text-base text-[var(--color-text)] transition-colors duration-200 placeholder:text-[var(--color-subtle)] focus:border-[var(--color-gold)]";

  return (
    <label className="block">
      <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-muted)]">
        {label}
      </span>
      {multiline ? (
        <textarea
          className={`${fieldClass} min-h-32 resize-y lg:min-h-[clamp(112px,16vh,152px)]`}
          {...registration}
        />
      ) : (
        <input className={fieldClass} {...registration} />
      )}
      {error ? (
        <span className="mt-2 block text-sm text-[var(--color-gold-light)]">
          {error.message}
        </span>
      ) : null}
    </label>
  );
}

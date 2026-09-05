"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";

function groupThousands(digits: string) {
  if (!digits) return "";
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function sanitizeInteger(raw: string) {
  return raw.replace(/[^\d]/g, "");
}

function sanitizeDecimal(raw: string) {
  const cleaned = raw.replace(/[^\d.]/g, "");
  const firstDot = cleaned.indexOf(".");
  if (firstDot === -1) return cleaned;
  return cleaned.slice(0, firstDot + 1) + cleaned.slice(firstDot + 1).replace(/\./g, "");
}

interface NumberInputProps {
  id?: string;
  name?: string;
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  allowDecimal?: boolean;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
}

/**
 * Text-based numeric input: displays thousand-separator dots (integer mode),
 * and lets the field be cleared to empty instead of snapping back to "0"
 * while the user is typing. The raw unformatted digits are submitted via a
 * hidden input for form actions.
 */
export function NumberInput({
  id,
  name,
  value,
  defaultValue,
  onValueChange,
  allowDecimal = false,
  placeholder,
  className,
  autoFocus,
}: NumberInputProps) {
  const isControlled = value !== undefined;
  const initial = isControlled ? value : defaultValue;

  const [raw, setRaw] = React.useState(() =>
    initial !== undefined && initial !== null ? String(initial) : "",
  );

  React.useEffect(() => {
    if (isControlled) {
      setRaw(value !== undefined && value !== null ? String(value) : "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const sanitized = allowDecimal
      ? sanitizeDecimal(e.target.value)
      : sanitizeInteger(e.target.value);
    setRaw(sanitized);
    const num = sanitized === "" || sanitized === "." ? 0 : Number(sanitized);
    onValueChange?.(Number.isFinite(num) ? num : 0);
  }

  const displayValue = allowDecimal ? raw : groupThousands(raw);

  return (
    <>
      <Input
        id={id}
        type="text"
        inputMode={allowDecimal ? "decimal" : "numeric"}
        autoComplete="off"
        autoFocus={autoFocus}
        value={displayValue}
        onChange={handleChange}
        placeholder={placeholder}
        className={className}
      />
      {name && <input type="hidden" name={name} value={raw} />}
    </>
  );
}

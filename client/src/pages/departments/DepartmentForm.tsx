import { useEffect, useState } from "react";
import { Button } from "@/components/Button";
import { FormField } from "@/components/FormField";
import type { CreateDepartmentDto } from "@/types/department";

export interface DepartmentFormValues {
  name: string;
  description: string;
}

const empty: DepartmentFormValues = { name: "", description: "" };

interface Props {
  initial?: Partial<DepartmentFormValues>;
  submitLabel: string;
  submitting?: boolean;
  fieldErrors?: Record<string, string[]>;
  onSubmit: (dto: CreateDepartmentDto) => void;
  onCancel: () => void;
}

export const DepartmentForm = ({
  initial,
  submitLabel,
  submitting,
  fieldErrors,
  onSubmit,
  onCancel,
}: Props) => {
  const [values, setValues] = useState<DepartmentFormValues>({ ...empty, ...initial });
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initial) setValues((v) => ({ ...v, ...initial }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(initial)]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (values.name.trim().length < 2) errs.name = "Мінімум 2 символи";
    setLocalErrors(errs);
    if (Object.keys(errs).length > 0) return;

    onSubmit({
      name: values.name.trim(),
      description: values.description.trim() || undefined,
    });
  };

  const errorOf = (k: string): string | undefined =>
    localErrors[k] ?? fieldErrors?.[k]?.join(", ");

  return (
    <form className="form" onSubmit={handleSubmit}>
      <FormField label="Назва" htmlFor="name" required error={errorOf("name")}>
        <input
          id="name"
          className="text-input"
          value={values.name}
          onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
        />
      </FormField>
      <FormField label="Опис" htmlFor="description" error={errorOf("description")}>
        <textarea
          id="description"
          className="textarea-input"
          value={values.description}
          onChange={(e) => setValues((v) => ({ ...v, description: e.target.value }))}
        />
      </FormField>
      <div className="form-actions">
        <Button variant="ghost" type="button" onClick={onCancel} disabled={submitting}>
          Скасувати
        </Button>
        <Button variant="primary" type="submit" disabled={submitting}>
          {submitting ? "Збереження…" : submitLabel}
        </Button>
      </div>
    </form>
  );
};

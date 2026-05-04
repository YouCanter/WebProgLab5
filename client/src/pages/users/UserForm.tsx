import { useEffect, useState } from "react";
import { Button } from "@/components/Button";
import { FormField } from "@/components/FormField";
import { departmentsService } from "@/services/departmentsService";
import type { CreateUserDto } from "@/types/user";
import type { Department } from "@/types/department";

export interface UserFormValues {
  fullName: string;
  email: string;
  phone: string;
  position: string;
  isActive: boolean;
  departmentId: number | "";
}

const empty: UserFormValues = {
  fullName: "",
  email: "",
  phone: "",
  position: "",
  isActive: true,
  departmentId: "",
};

interface UserFormProps {
  initial?: Partial<UserFormValues>;
  submitLabel: string;
  submitting?: boolean;
  fieldErrors?: Record<string, string[]>;
  onSubmit: (dto: CreateUserDto) => void;
  onCancel: () => void;
}

export const UserForm = ({
  initial,
  submitLabel,
  submitting,
  fieldErrors,
  onSubmit,
  onCancel,
}: UserFormProps) => {
  const [values, setValues] = useState<UserFormValues>({ ...empty, ...initial });
  const [departments, setDepartments] = useState<Department[]>([]);
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    departmentsService
      .loadAllDepartments()
      .then((res) => setDepartments(res.data))
      .catch(() => setDepartments([]));
  }, []);

  useEffect(() => {
    if (initial) setValues((v) => ({ ...v, ...initial }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(initial)]);

  const setField = <K extends keyof UserFormValues>(key: K, value: UserFormValues[K]) => {
    setValues((v) => ({ ...v, [key]: value }));
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (values.fullName.trim().length < 2) errs.fullName = "ПІБ повинно містити щонайменше 2 символи";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errs.email = "Введіть коректний email";
    if (values.position.trim().length < 2) errs.position = "Посада повинна містити щонайменше 2 символи";
    if (values.departmentId === "" || Number(values.departmentId) <= 0) errs.departmentId = "Оберіть підрозділ";
    setLocalErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      fullName: values.fullName.trim(),
      email: values.email.trim(),
      phone: values.phone.trim() || undefined,
      position: values.position.trim(),
      isActive: values.isActive,
      departmentId: Number(values.departmentId),
    });
  };

  const errorOf = (k: string): string | undefined =>
    localErrors[k] ?? fieldErrors?.[k]?.join(", ");

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <FormField label="ПІБ" htmlFor="fullName" required error={errorOf("fullName")}>
          <input
            id="fullName"
            className="text-input"
            value={values.fullName}
            onChange={(e) => setField("fullName", e.target.value)}
          />
        </FormField>
        <FormField label="Email" htmlFor="email" required error={errorOf("email")}>
          <input
            id="email"
            type="email"
            className="text-input"
            value={values.email}
            onChange={(e) => setField("email", e.target.value)}
          />
        </FormField>
        <FormField label="Телефон" htmlFor="phone" error={errorOf("phone")}>
          <input
            id="phone"
            className="text-input"
            value={values.phone}
            onChange={(e) => setField("phone", e.target.value)}
          />
        </FormField>
        <FormField label="Посада" htmlFor="position" required error={errorOf("position")}>
          <input
            id="position"
            className="text-input"
            value={values.position}
            onChange={(e) => setField("position", e.target.value)}
          />
        </FormField>
        <FormField label="Підрозділ" htmlFor="departmentId" required error={errorOf("departmentId")}>
          <select
            id="departmentId"
            className="select-input"
            value={values.departmentId}
            onChange={(e) =>
              setField("departmentId", e.target.value === "" ? "" : Number(e.target.value))
            }
          >
            <option value="">— оберіть —</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </FormField>
        <FormField label="Статус">
          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={values.isActive}
              onChange={(e) => setField("isActive", e.target.checked)}
            />
            <span>Активний</span>
          </label>
        </FormField>
      </div>

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

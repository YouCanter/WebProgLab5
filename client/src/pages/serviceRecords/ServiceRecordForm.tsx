import { useEffect, useState } from "react";
import { Button } from "@/components/Button";
import { FormField } from "@/components/FormField";
import { departmentsService } from "@/services/departmentsService";
import { usersService } from "@/services/usersService";
import type { Department } from "@/types/department";
import type { User } from "@/types/user";
import {
  serviceRecordTypeLabels,
  serviceRecordTypes,
  type CreateServiceRecordDto,
  type ServiceRecordType,
} from "@/types/serviceRecord";

export interface ServiceRecordFormValues {
  userId: number | "";
  departmentId: number | "";
  type: ServiceRecordType;
  note: string;
  occurredAt: string;
}

const empty: ServiceRecordFormValues = {
  userId: "",
  departmentId: "",
  type: "NOTE",
  note: "",
  occurredAt: "",
};

interface Props {
  initial?: Partial<ServiceRecordFormValues>;
  submitLabel: string;
  submitting?: boolean;
  fieldErrors?: Record<string, string[]>;
  onSubmit: (dto: CreateServiceRecordDto) => void;
  onCancel: () => void;
}

export const ServiceRecordForm = ({
  initial,
  submitLabel,
  submitting,
  fieldErrors,
  onSubmit,
  onCancel,
}: Props) => {
  const [values, setValues] = useState<ServiceRecordFormValues>({ ...empty, ...initial });
  const [users, setUsers] = useState<User[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    usersService.loadUsers({ pageSize: 100, sort: "fullName", order: "asc" }).then((r) => setUsers(r.data)).catch(() => setUsers([]));
    departmentsService.loadAllDepartments().then((r) => setDepartments(r.data)).catch(() => setDepartments([]));
  }, []);

  useEffect(() => {
    if (initial) setValues((v) => ({ ...v, ...initial }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(initial)]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (values.userId === "" || Number(values.userId) <= 0) errs.userId = "Оберіть користувача";
    if (!serviceRecordTypes.includes(values.type)) errs.type = "Оберіть тип";
    setLocalErrors(errs);
    if (Object.keys(errs).length > 0) return;

    onSubmit({
      userId: Number(values.userId),
      departmentId: values.departmentId === "" ? undefined : Number(values.departmentId),
      type: values.type,
      note: values.note.trim() || undefined,
      occurredAt: values.occurredAt ? new Date(values.occurredAt).toISOString() : undefined,
    });
  };

  const errorOf = (k: string): string | undefined =>
    localErrors[k] ?? fieldErrors?.[k]?.join(", ");

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <FormField label="Користувач" htmlFor="userId" required error={errorOf("userId")}>
          <select
            id="userId"
            className="select-input"
            value={values.userId}
            onChange={(e) => setValues((v) => ({ ...v, userId: e.target.value === "" ? "" : Number(e.target.value) }))}
          >
            <option value="">— оберіть —</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>{u.fullName} ({u.email})</option>
            ))}
          </select>
        </FormField>
        <FormField label="Тип" htmlFor="type" required error={errorOf("type")}>
          <select
            id="type"
            className="select-input"
            value={values.type}
            onChange={(e) => setValues((v) => ({ ...v, type: e.target.value as ServiceRecordType }))}
          >
            {serviceRecordTypes.map((t) => (
              <option key={t} value={t}>{serviceRecordTypeLabels[t]}</option>
            ))}
          </select>
        </FormField>
        <FormField label="Підрозділ (за бажанням)" htmlFor="departmentId" error={errorOf("departmentId")}>
          <select
            id="departmentId"
            className="select-input"
            value={values.departmentId}
            onChange={(e) => setValues((v) => ({ ...v, departmentId: e.target.value === "" ? "" : Number(e.target.value) }))}
          >
            <option value="">—</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </FormField>
        <FormField label="Дата події" htmlFor="occurredAt" error={errorOf("occurredAt")} hint="Якщо порожнє — буде використано поточний час">
          <input
            id="occurredAt"
            type="datetime-local"
            className="text-input"
            value={values.occurredAt}
            onChange={(e) => setValues((v) => ({ ...v, occurredAt: e.target.value }))}
          />
        </FormField>
      </div>
      <FormField label="Примітка" htmlFor="note" error={errorOf("note")}>
        <textarea
          id="note"
          className="textarea-input"
          value={values.note}
          onChange={(e) => setValues((v) => ({ ...v, note: e.target.value }))}
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

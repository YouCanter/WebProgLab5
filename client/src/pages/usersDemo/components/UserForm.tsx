import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/Button";
import { FormField } from "@/components/FormField";
import { useToast } from "@/hooks/useToast";
import { departmentsService } from "@/services/departmentsService";
import { useUsers } from "@/state/users/useUsers";
import type { Department } from "@/types/department";

interface FormValues {
  fullName: string;
  email: string;
  position: string;
  departmentId: number | "";
}

const empty: FormValues = {
  fullName: "",
  email: "",
  position: "",
  departmentId: "",
};

export const UserForm = () => {
  const { state, createUser, updateUser, selectUser } = useUsers();
  const { show } = useToast();

  const [values, setValues] = useState<FormValues>(empty);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedUser = state.data.selectedUser;
  const isEditing = selectedUser !== null;

  useEffect(() => {
    departmentsService
      .loadAllDepartments()
      .then((res) => setDepartments(res.data))
      .catch(() => setDepartments([]));
  }, []);

  useEffect(() => {
    if (selectedUser) {
      setValues({
        fullName: selectedUser.fullName,
        email: selectedUser.email,
        position: selectedUser.position,
        departmentId: selectedUser.departmentId,
      });
      setErrors({});
    } else {
      setValues(empty);
      setErrors({});
    }
  }, [selectedUser]);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (values.fullName.trim().length < 2) errs.fullName = "Мінімум 2 символи";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errs.email = "Некоректний email";
    if (values.position.trim().length < 2) errs.position = "Мінімум 2 символи";
    if (values.departmentId === "" || Number(values.departmentId) <= 0) errs.departmentId = "Оберіть підрозділ";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const dto = {
        fullName: values.fullName.trim(),
        email: values.email.trim(),
        position: values.position.trim(),
        departmentId: Number(values.departmentId),
        isActive: true,
      };

      if (isEditing && selectedUser) {
        await updateUser(selectedUser.id, dto);
        show(`Дані користувача "${dto.fullName}" оновлено`, "success");
      } else {
        await createUser(dto);
        show(`Користувача "${dto.fullName}" створено`, "success");
        setValues(empty);
      }
    } catch (err) {
      show((err as Error).message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    if (isEditing) {
      selectUser(null);
    } else {
      setValues(empty);
      setErrors({});
    }
  };

  return (
    <section className="card user-form-card">
      <div className="user-form-card__header">
        <h3 className="demo-section-title">
          {isEditing ? "Редагування користувача" : "Створення користувача"}
        </h3>
        <p className="user-form-card__hint">
          Форма використовує локальний стан, а збереження проходить через загальний hook.
        </p>
      </div>

      <form className="form" onSubmit={handleSubmit}>
        <FormField label="Ім'я" htmlFor="demo-fullName" required error={errors.fullName}>
          <input
            id="demo-fullName"
            className="text-input"
            placeholder="Наприклад, Олена Коваль"
            value={values.fullName}
            onChange={(e) => setValues((v) => ({ ...v, fullName: e.target.value }))}
          />
        </FormField>

        <FormField label="Email" htmlFor="demo-email" required error={errors.email}>
          <input
            id="demo-email"
            type="email"
            className="text-input"
            placeholder="user@example.com"
            value={values.email}
            onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
          />
        </FormField>

        <FormField label="Роль" htmlFor="demo-position" required error={errors.position}>
          <input
            id="demo-position"
            className="text-input"
            placeholder="Аналітик, адміністратор, розробник…"
            value={values.position}
            onChange={(e) => setValues((v) => ({ ...v, position: e.target.value }))}
          />
        </FormField>

        <FormField label="Підрозділ" htmlFor="demo-department" required error={errors.departmentId}>
          <select
            id="demo-department"
            className="select-input"
            value={values.departmentId}
            onChange={(e) =>
              setValues((v) => ({
                ...v,
                departmentId: e.target.value === "" ? "" : Number(e.target.value),
              }))
            }
          >
            <option value="">— оберіть —</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </FormField>

        <div className="user-form-card__actions">
          <Button variant="primary" type="submit" disabled={submitting}>
            {submitting ? "Збереження…" : isEditing ? "Зберегти зміни" : "Створити запис"}
          </Button>
          <Button variant="secondary" type="button" onClick={handleReset} disabled={submitting}>
            {isEditing ? "Скасувати" : "Очистити форму"}
          </Button>
        </div>
      </form>
    </section>
  );
};

import { useEffect, useState, type FormEvent } from "react";
import { departmentsApi } from "@/api/departmentsApi";
import { Button } from "@/components/Button";
import { FormField } from "@/components/FormField";
import { useToast } from "@/hooks/useToast";
import { useUsers } from "@/hooks/useUsers";
import type { Department } from "@/types/user";

interface FormValues {
  fullName: string;
  email: string;
  position: string;
  departmentId: number | "";
  isActive: boolean;
}

const empty: FormValues = {
  fullName: "",
  email: "",
  position: "",
  departmentId: "",
  isActive: true,
};

export const UserForm = () => {
  const { selectedUser, mutating, createUser, updateUser, selectUser } = useUsers();
  const { show } = useToast();

  const [values, setValues] = useState<FormValues>(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [departments, setDepartments] = useState<Department[]>([]);

  const isEditing = selectedUser !== null;

  useEffect(() => {
    let cancelled = false;
    departmentsApi
      .getAllDepartments()
      .then((list) => { if (!cancelled) setDepartments(list); })
      .catch(() => { if (!cancelled) setDepartments([]); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (selectedUser) {
      setValues({
        fullName: selectedUser.fullName,
        email: selectedUser.email,
        position: selectedUser.position,
        departmentId: selectedUser.departmentId,
        isActive: selectedUser.isActive,
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

    const dto = {
      fullName: values.fullName.trim(),
      email: values.email.trim(),
      position: values.position.trim(),
      departmentId: Number(values.departmentId),
      isActive: values.isActive,
    };

    try {
      if (isEditing && selectedUser) {
        await updateUser(selectedUser.id, dto);
        show(`Дані користувача "${dto.fullName}" оновлено`, "success");
      } else {
        await createUser(dto);
        show(`Користувача "${dto.fullName}" створено`, "success");
        setValues(empty);
      }
    } catch (err) {
      show((err as Error).message ?? "Помилка збереження", "error");
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
          {isEditing
            ? "Зміни проходять через async thunk updateUser і автоматично оновлюють список."
            : "Збереження — async thunk createUser, після успіху список інвалідовується."}
        </p>
      </div>

      <form className="form" onSubmit={handleSubmit}>
        <FormField label="ПІБ" htmlFor="fullName" required error={errors.fullName}>
          <input
            id="fullName"
            className="text-input"
            placeholder="Наприклад, Олена Коваль"
            value={values.fullName}
            onChange={(e) => setValues((v) => ({ ...v, fullName: e.target.value }))}
          />
        </FormField>

        <FormField label="Email" htmlFor="email" required error={errors.email}>
          <input
            id="email"
            type="email"
            className="text-input"
            placeholder="user@example.com"
            value={values.email}
            onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
          />
        </FormField>

        <FormField label="Посада / роль" htmlFor="position" required error={errors.position}>
          <input
            id="position"
            className="text-input"
            placeholder="Адміністратор, аналітик, розробник…"
            value={values.position}
            onChange={(e) => setValues((v) => ({ ...v, position: e.target.value }))}
          />
        </FormField>

        <FormField label="Підрозділ" htmlFor="departmentId" required error={errors.departmentId}>
          <select
            id="departmentId"
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

        <FormField label="Статус">
          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={values.isActive}
              onChange={(e) => setValues((v) => ({ ...v, isActive: e.target.checked }))}
            />
            <span>Активний користувач</span>
          </label>
        </FormField>

        <div className="user-form-card__actions">
          <Button variant="primary" type="submit" disabled={mutating}>
            {mutating ? "Збереження…" : isEditing ? "Зберегти зміни" : "Створити запис"}
          </Button>
          <Button variant="secondary" type="button" onClick={handleReset} disabled={mutating}>
            {isEditing ? "Скасувати" : "Очистити форму"}
          </Button>
        </div>
      </form>
    </section>
  );
};

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ApiError } from "@/api/httpClient";
import { useToast } from "@/hooks/useToast";
import { usersService } from "@/services/usersService";
import type { CreateUserDto } from "@/types/user";
import { UserForm } from "./UserForm";

export const UserCreatePage = () => {
  const navigate = useNavigate();
  const { show } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>();

  const handleSubmit = async (dto: CreateUserDto) => {
    setSubmitting(true);
    setFieldErrors(undefined);
    try {
      const created = await usersService.createUser(dto);
      show(`Користувача "${created.fullName}" створено`, "success");
      navigate(`/users/${created.id}`);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.fieldErrors) setFieldErrors(err.fieldErrors);
        show(err.message, "error");
      } else {
        show((err as Error).message, "error");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Новий користувач</h1>
      </div>
      <div className="card">
        <UserForm
          submitLabel="Створити"
          submitting={submitting}
          fieldErrors={fieldErrors}
          onSubmit={handleSubmit}
          onCancel={() => navigate("/users")}
        />
      </div>
    </div>
  );
};

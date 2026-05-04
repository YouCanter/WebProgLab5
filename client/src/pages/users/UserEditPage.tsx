import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ApiError } from "@/api/httpClient";
import { ErrorMessage } from "@/components/ErrorMessage";
import { useToast } from "@/hooks/useToast";
import { usersService } from "@/services/usersService";
import type { CreateUserDto, User } from "@/types/user";
import { UserForm, type UserFormValues } from "./UserForm";

export const UserEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { show } = useToast();

  const [user, setUser] = useState<User | null>(null);
  const [loadError, setLoadError] = useState<ApiError | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>();

  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();
    usersService
      .loadUser(Number(id), controller.signal)
      .then(setUser)
      .catch((err) => {
        if ((err as Error).name === "AbortError") return;
        setLoadError(err instanceof ApiError ? err : new ApiError({ code: "UNKNOWN", message: (err as Error).message, status: 0 }));
      });
    return () => controller.abort();
  }, [id]);

  const initial: Partial<UserFormValues> | undefined = user
    ? {
        fullName: user.fullName,
        email: user.email,
        phone: user.phone ?? "",
        position: user.position,
        isActive: user.isActive,
        departmentId: user.departmentId,
      }
    : undefined;

  const handleSubmit = async (dto: CreateUserDto) => {
    if (!id) return;
    setSubmitting(true);
    setFieldErrors(undefined);
    try {
      const updated = await usersService.updateUser(Number(id), dto);
      show(`Дані користувача "${updated.fullName}" оновлено`, "success");
      navigate(`/users/${updated.id}`);
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
        <h1>Редагування користувача</h1>
      </div>
      <ErrorMessage error={loadError} />
      <div className="card">
        {user ? (
          <UserForm
            initial={initial}
            submitLabel="Зберегти"
            submitting={submitting}
            fieldErrors={fieldErrors}
            onSubmit={handleSubmit}
            onCancel={() => navigate(`/users/${user.id}`)}
          />
        ) : (
          !loadError && <div className="empty-state">Завантаження…</div>
        )}
      </div>
    </div>
  );
};

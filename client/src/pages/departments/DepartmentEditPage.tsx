import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ApiError } from "@/api/httpClient";
import { ErrorMessage } from "@/components/ErrorMessage";
import { useToast } from "@/hooks/useToast";
import { departmentsService } from "@/services/departmentsService";
import type { CreateDepartmentDto, Department } from "@/types/department";
import { DepartmentForm, type DepartmentFormValues } from "./DepartmentForm";

export const DepartmentEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { show } = useToast();

  const [dep, setDep] = useState<Department | null>(null);
  const [loadError, setLoadError] = useState<ApiError | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>();

  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();
    departmentsService
      .loadDepartment(Number(id), controller.signal)
      .then(setDep)
      .catch((err) => {
        if ((err as Error).name === "AbortError") return;
        setLoadError(err instanceof ApiError ? err : new ApiError({ code: "UNKNOWN", message: (err as Error).message, status: 0 }));
      });
    return () => controller.abort();
  }, [id]);

  const initial: Partial<DepartmentFormValues> | undefined = dep
    ? { name: dep.name, description: dep.description ?? "" }
    : undefined;

  const handleSubmit = async (dto: CreateDepartmentDto) => {
    if (!id) return;
    setSubmitting(true);
    setFieldErrors(undefined);
    try {
      const updated = await departmentsService.updateDepartment(Number(id), dto);
      show(`Підрозділ "${updated.name}" оновлено`, "success");
      navigate(`/departments/${updated.id}`);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.fieldErrors) setFieldErrors(err.fieldErrors);
        show(err.message, "error");
      } else show((err as Error).message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="page-header"><h1>Редагування підрозділу</h1></div>
      <ErrorMessage error={loadError} />
      <div className="card">
        {dep ? (
          <DepartmentForm
            initial={initial}
            submitLabel="Зберегти"
            submitting={submitting}
            fieldErrors={fieldErrors}
            onSubmit={handleSubmit}
            onCancel={() => navigate(`/departments/${dep.id}`)}
          />
        ) : (
          !loadError && <div className="empty-state">Завантаження…</div>
        )}
      </div>
    </div>
  );
};

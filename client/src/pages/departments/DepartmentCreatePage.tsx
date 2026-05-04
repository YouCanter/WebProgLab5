import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ApiError } from "@/api/httpClient";
import { useToast } from "@/hooks/useToast";
import { departmentsService } from "@/services/departmentsService";
import type { CreateDepartmentDto } from "@/types/department";
import { DepartmentForm } from "./DepartmentForm";

export const DepartmentCreatePage = () => {
  const navigate = useNavigate();
  const { show } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>();

  const handleSubmit = async (dto: CreateDepartmentDto) => {
    setSubmitting(true);
    setFieldErrors(undefined);
    try {
      const created = await departmentsService.createDepartment(dto);
      show(`Підрозділ "${created.name}" створено`, "success");
      navigate(`/departments/${created.id}`);
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
      <div className="page-header"><h1>Новий підрозділ</h1></div>
      <div className="card">
        <DepartmentForm
          submitLabel="Створити"
          submitting={submitting}
          fieldErrors={fieldErrors}
          onSubmit={handleSubmit}
          onCancel={() => navigate("/departments")}
        />
      </div>
    </div>
  );
};

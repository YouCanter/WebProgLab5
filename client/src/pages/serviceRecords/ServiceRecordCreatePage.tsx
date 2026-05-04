import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ApiError } from "@/api/httpClient";
import { useToast } from "@/hooks/useToast";
import { serviceRecordsService } from "@/services/serviceRecordsService";
import type { CreateServiceRecordDto } from "@/types/serviceRecord";
import { ServiceRecordForm } from "./ServiceRecordForm";

export const ServiceRecordCreatePage = () => {
  const navigate = useNavigate();
  const { show } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>();

  const handleSubmit = async (dto: CreateServiceRecordDto) => {
    setSubmitting(true);
    setFieldErrors(undefined);
    try {
      await serviceRecordsService.createServiceRecord(dto);
      show("Службовий запис створено", "success");
      navigate("/service-records");
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
      <div className="page-header"><h1>Новий службовий запис</h1></div>
      <div className="card">
        <ServiceRecordForm
          submitLabel="Створити"
          submitting={submitting}
          fieldErrors={fieldErrors}
          onSubmit={handleSubmit}
          onCancel={() => navigate("/service-records")}
        />
      </div>
    </div>
  );
};

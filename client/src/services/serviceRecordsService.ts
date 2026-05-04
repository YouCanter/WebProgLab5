import { serviceRecordsApi } from "@/api/serviceRecordsApi";
import type {
  CreateServiceRecordDto,
  ServiceRecordsQuery,
  UpdateServiceRecordDto,
} from "@/types/serviceRecord";

export const serviceRecordsService = {
  loadServiceRecords: (query: ServiceRecordsQuery, signal?: AbortSignal) =>
    serviceRecordsApi.getServiceRecords(query, signal),
  loadServiceRecord: (id: number, signal?: AbortSignal) =>
    serviceRecordsApi.getServiceRecord(id, signal),
  createServiceRecord: (dto: CreateServiceRecordDto) =>
    serviceRecordsApi.createServiceRecord(dto),
  updateServiceRecord: (id: number, dto: UpdateServiceRecordDto) =>
    serviceRecordsApi.updateServiceRecord(id, dto),
  deleteServiceRecord: (id: number) => serviceRecordsApi.deleteServiceRecord(id),
};

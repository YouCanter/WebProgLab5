import { httpClient } from "./httpClient";
import type { Paginated, SingleResource } from "@/types/api";
import type {
  CreateServiceRecordDto,
  ServiceRecord,
  ServiceRecordsQuery,
  UpdateServiceRecordDto,
} from "@/types/serviceRecord";
import { buildQueryString } from "@/utils/buildQueryString";

export const serviceRecordsApi = {
  getServiceRecords(
    query: ServiceRecordsQuery = {},
    signal?: AbortSignal,
  ): Promise<Paginated<ServiceRecord>> {
    return httpClient.get<Paginated<ServiceRecord>>(
      `/service-records${buildQueryString(query)}`,
      signal,
    );
  },
  getServiceRecord(id: number, signal?: AbortSignal): Promise<ServiceRecord> {
    return httpClient
      .get<SingleResource<ServiceRecord>>(`/service-records/${id}`, signal)
      .then((r) => r.data);
  },
  createServiceRecord(dto: CreateServiceRecordDto): Promise<ServiceRecord> {
    return httpClient
      .post<SingleResource<ServiceRecord>>(`/service-records`, dto)
      .then((r) => r.data);
  },
  updateServiceRecord(id: number, dto: UpdateServiceRecordDto): Promise<ServiceRecord> {
    return httpClient
      .patch<SingleResource<ServiceRecord>>(`/service-records/${id}`, dto)
      .then((r) => r.data);
  },
  deleteServiceRecord(id: number): Promise<void> {
    return httpClient.delete<void>(`/service-records/${id}`);
  },
};

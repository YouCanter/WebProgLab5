import type { Request, Response } from "express";
import { serviceRecordsService } from "../services/serviceRecords.service.js";
import type {
  CreateServiceRecordDto,
  ServiceRecordsQuery,
  UpdateServiceRecordDto,
} from "../schemas/serviceRecords.schema.js";

export const serviceRecordsController = {
  async list(req: Request, res: Response): Promise<void> {
    const result = await serviceRecordsService.list(req.query as unknown as ServiceRecordsQuery);
    res.json(result);
  },

  async getOne(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);
    const record = await serviceRecordsService.getById(id);
    res.json({ data: record });
  },

  async create(req: Request, res: Response): Promise<void> {
    const record = await serviceRecordsService.create(req.body as CreateServiceRecordDto);
    res.status(201).json({ data: record });
  },

  async update(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);
    const record = await serviceRecordsService.update(id, req.body as UpdateServiceRecordDto);
    res.json({ data: record });
  },

  async remove(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);
    await serviceRecordsService.remove(id);
    res.status(204).send();
  },
};

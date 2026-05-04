import type { Request, Response } from "express";
import { departmentsService } from "../services/departments.service.js";
import type {
  CreateDepartmentDto,
  DepartmentsQuery,
  UpdateDepartmentDto,
} from "../schemas/departments.schema.js";

export const departmentsController = {
  async list(req: Request, res: Response): Promise<void> {
    const result = await departmentsService.list(req.query as unknown as DepartmentsQuery);
    res.json(result);
  },

  async getOne(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);
    const dep = await departmentsService.getById(id);
    res.json({ data: dep });
  },

  async create(req: Request, res: Response): Promise<void> {
    const dep = await departmentsService.create(req.body as CreateDepartmentDto);
    res.status(201).json({ data: dep });
  },

  async update(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);
    const dep = await departmentsService.update(id, req.body as UpdateDepartmentDto);
    res.json({ data: dep });
  },

  async remove(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);
    await departmentsService.remove(id);
    res.status(204).send();
  },
};

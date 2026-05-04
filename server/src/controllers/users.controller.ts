import type { Request, Response } from "express";
import { usersService } from "../services/users.service.js";
import type {
  CreateUserDto,
  UpdateUserDto,
  UsersQuery,
} from "../schemas/users.schema.js";

export const usersController = {
  async list(req: Request, res: Response): Promise<void> {
    const result = await usersService.list(req.query as unknown as UsersQuery);
    res.json(result);
  },

  async getOne(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);
    const user = await usersService.getById(id);
    res.json({ data: user });
  },

  async create(req: Request, res: Response): Promise<void> {
    const user = await usersService.create(req.body as CreateUserDto);
    res.status(201).json({ data: user });
  },

  async update(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);
    const user = await usersService.update(id, req.body as UpdateUserDto);
    res.json({ data: user });
  },

  async remove(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);
    await usersService.remove(id);
    res.status(204).send();
  },
};

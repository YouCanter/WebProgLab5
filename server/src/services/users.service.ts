import type { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma.js";
import { NotFoundError } from "../errors/AppError.js";
import { buildMeta, buildPagination, type PaginatedResult } from "../utils/buildListQuery.js";
import type {
  CreateUserDto,
  UpdateUserDto,
  UsersQuery,
} from "../schemas/users.schema.js";

const userInclude = {
  department: { select: { id: true, name: true } },
} satisfies Prisma.UserInclude;

export type UserWithDepartment = Prisma.UserGetPayload<{ include: typeof userInclude }>;

const buildWhere = (q: UsersQuery): Prisma.UserWhereInput => {
  const where: Prisma.UserWhereInput = {};
  if (q.departmentId !== undefined) where.departmentId = q.departmentId;
  if (q.isActive !== undefined) where.isActive = q.isActive;
  if (q.search) {
    where.OR = [
      { fullName: { contains: q.search, mode: "insensitive" } },
      { email: { contains: q.search, mode: "insensitive" } },
      { position: { contains: q.search, mode: "insensitive" } },
    ];
  }
  return where;
};

export const usersService = {
  async list(query: UsersQuery): Promise<PaginatedResult<UserWithDepartment>> {
    const where = buildWhere(query);
    const { skip, take } = buildPagination(query.page, query.pageSize);

    const [data, total] = await prisma.$transaction([
      prisma.user.findMany({
        where,
        include: userInclude,
        orderBy: { [query.sort]: query.order },
        skip,
        take,
      }),
      prisma.user.count({ where }),
    ]);

    return { data, meta: buildMeta(query.page, query.pageSize, total) };
  },

  async getById(id: number): Promise<UserWithDepartment> {
    const user = await prisma.user.findUnique({
      where: { id },
      include: userInclude,
    });
    if (!user) throw new NotFoundError("Користувача");
    return user;
  },

  async create(dto: CreateUserDto): Promise<UserWithDepartment> {
    return prisma.user.create({
      data: dto,
      include: userInclude,
    });
  },

  async update(id: number, dto: UpdateUserDto): Promise<UserWithDepartment> {
    return prisma.user.update({
      where: { id },
      data: dto,
      include: userInclude,
    });
  },

  async remove(id: number): Promise<void> {
    await prisma.user.delete({ where: { id } });
  },
};

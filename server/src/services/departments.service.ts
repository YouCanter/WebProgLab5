import type { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma.js";
import { NotFoundError } from "../errors/AppError.js";
import { buildMeta, buildPagination, type PaginatedResult } from "../utils/buildListQuery.js";
import type {
  CreateDepartmentDto,
  DepartmentsQuery,
  UpdateDepartmentDto,
} from "../schemas/departments.schema.js";

const departmentInclude = {
  _count: { select: { users: true } },
} satisfies Prisma.DepartmentInclude;

export type DepartmentWithCount = Prisma.DepartmentGetPayload<{ include: typeof departmentInclude }>;

const buildWhere = (q: DepartmentsQuery): Prisma.DepartmentWhereInput => {
  const where: Prisma.DepartmentWhereInput = {};
  if (q.search) {
    where.OR = [
      { name: { contains: q.search, mode: "insensitive" } },
      { description: { contains: q.search, mode: "insensitive" } },
    ];
  }
  return where;
};

export const departmentsService = {
  async list(query: DepartmentsQuery): Promise<PaginatedResult<DepartmentWithCount>> {
    const where = buildWhere(query);
    const { skip, take } = buildPagination(query.page, query.pageSize);

    const [data, total] = await prisma.$transaction([
      prisma.department.findMany({
        where,
        include: departmentInclude,
        orderBy: { [query.sort]: query.order },
        skip,
        take,
      }),
      prisma.department.count({ where }),
    ]);

    return { data, meta: buildMeta(query.page, query.pageSize, total) };
  },

  async getById(id: number): Promise<DepartmentWithCount> {
    const dep = await prisma.department.findUnique({
      where: { id },
      include: departmentInclude,
    });
    if (!dep) throw new NotFoundError("Підрозділ");
    return dep;
  },

  async create(dto: CreateDepartmentDto): Promise<DepartmentWithCount> {
    return prisma.department.create({
      data: dto,
      include: departmentInclude,
    });
  },

  async update(id: number, dto: UpdateDepartmentDto): Promise<DepartmentWithCount> {
    return prisma.department.update({
      where: { id },
      data: dto,
      include: departmentInclude,
    });
  },

  async remove(id: number): Promise<void> {
    await prisma.department.delete({ where: { id } });
  },
};

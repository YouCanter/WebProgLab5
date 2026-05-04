import type { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma.js";
import { NotFoundError } from "../errors/AppError.js";
import { buildMeta, buildPagination, type PaginatedResult } from "../utils/buildListQuery.js";
import type {
  CreateServiceRecordDto,
  ServiceRecordsQuery,
  UpdateServiceRecordDto,
} from "../schemas/serviceRecords.schema.js";

const serviceRecordInclude = {
  user: { select: { id: true, fullName: true, email: true } },
  department: { select: { id: true, name: true } },
} satisfies Prisma.ServiceRecordInclude;

export type ServiceRecordWithRelations = Prisma.ServiceRecordGetPayload<{
  include: typeof serviceRecordInclude;
}>;

const buildWhere = (q: ServiceRecordsQuery): Prisma.ServiceRecordWhereInput => {
  const where: Prisma.ServiceRecordWhereInput = {};
  if (q.userId !== undefined) where.userId = q.userId;
  if (q.departmentId !== undefined) where.departmentId = q.departmentId;
  if (q.type !== undefined) where.type = q.type;
  if (q.search) {
    where.OR = [
      { note: { contains: q.search, mode: "insensitive" } },
      { user: { fullName: { contains: q.search, mode: "insensitive" } } },
    ];
  }
  return where;
};

export const serviceRecordsService = {
  async list(query: ServiceRecordsQuery): Promise<PaginatedResult<ServiceRecordWithRelations>> {
    const where = buildWhere(query);
    const { skip, take } = buildPagination(query.page, query.pageSize);

    const [data, total] = await prisma.$transaction([
      prisma.serviceRecord.findMany({
        where,
        include: serviceRecordInclude,
        orderBy: { [query.sort]: query.order },
        skip,
        take,
      }),
      prisma.serviceRecord.count({ where }),
    ]);

    return { data, meta: buildMeta(query.page, query.pageSize, total) };
  },

  async getById(id: number): Promise<ServiceRecordWithRelations> {
    const record = await prisma.serviceRecord.findUnique({
      where: { id },
      include: serviceRecordInclude,
    });
    if (!record) throw new NotFoundError("Службовий запис");
    return record;
  },

  async create(dto: CreateServiceRecordDto): Promise<ServiceRecordWithRelations> {
    return prisma.serviceRecord.create({
      data: dto,
      include: serviceRecordInclude,
    });
  },

  async update(id: number, dto: UpdateServiceRecordDto): Promise<ServiceRecordWithRelations> {
    return prisma.serviceRecord.update({
      where: { id },
      data: dto,
      include: serviceRecordInclude,
    });
  },

  async remove(id: number): Promise<void> {
    await prisma.serviceRecord.delete({ where: { id } });
  },
};

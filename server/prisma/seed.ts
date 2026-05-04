import { PrismaClient, ServiceRecordType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.serviceRecord.deleteMany();
  await prisma.user.deleteMany();
  await prisma.department.deleteMany();

  const departments = await prisma.$transaction([
    prisma.department.create({
      data: { name: "Відділ розробки", description: "Команда інженерів програмного забезпечення" },
    }),
    prisma.department.create({
      data: { name: "Відділ кадрів", description: "Управління персоналом" },
    }),
    prisma.department.create({
      data: { name: "Бухгалтерія", description: "Фінансовий облік і звітність" },
    }),
    prisma.department.create({
      data: { name: "Відділ маркетингу", description: "Просування та реклама" },
    }),
  ]);

  const [dev, hr, fin, mkt] = departments;

  const usersData = [
    { fullName: "Іваненко Олег Петрович", email: "ivanenko@example.com", phone: "+380501112233", position: "Інженер-програміст", departmentId: dev.id },
    { fullName: "Петрова Ірина Сергіївна", email: "petrova@example.com", phone: "+380501112244", position: "Тімлід", departmentId: dev.id },
    { fullName: "Сидоренко Андрій Олегович", email: "sydorenko@example.com", phone: "+380501112255", position: "QA-інженер", departmentId: dev.id },
    { fullName: "Коваленко Ольга Ігорівна", email: "kovalenko@example.com", phone: "+380501112266", position: "DevOps-інженер", departmentId: dev.id, isActive: false },
    { fullName: "Мельник Тарас Васильович", email: "melnyk@example.com", phone: "+380501112277", position: "Менеджер з персоналу", departmentId: hr.id },
    { fullName: "Шевченко Наталія Миколаївна", email: "shevchenko@example.com", phone: "+380501112288", position: "HR-директор", departmentId: hr.id },
    { fullName: "Бондаренко Сергій Анатолійович", email: "bondarenko@example.com", phone: "+380501112299", position: "Головний бухгалтер", departmentId: fin.id },
    { fullName: "Ткаченко Валентина Юріївна", email: "tkachenko@example.com", phone: "+380501113300", position: "Бухгалтер", departmentId: fin.id },
    { fullName: "Кравченко Дмитро Олександрович", email: "kravchenko@example.com", phone: "+380501113311", position: "Маркетолог", departmentId: mkt.id },
    { fullName: "Лисенко Анна Володимирівна", email: "lysenko@example.com", phone: "+380501113322", position: "SMM-менеджер", departmentId: mkt.id },
    { fullName: "Гончаренко Максим Ігорович", email: "honcharenko@example.com", phone: "+380501113333", position: "Junior-розробник", departmentId: dev.id },
    { fullName: "Поліщук Софія Андріївна", email: "polishchuk@example.com", phone: "+380501113344", position: "Дизайнер", departmentId: mkt.id },
    { fullName: "Романенко Богдан Степанович", email: "romanenko@example.com", phone: "+380501113355", position: "Senior-розробник", departmentId: dev.id },
    { fullName: "Захарченко Юлія Володимирівна", email: "zakharchenko@example.com", phone: "+380501113366", position: "Рекрутер", departmentId: hr.id },
    { fullName: "Марченко Віктор Петрович", email: "marchenko@example.com", phone: "+380501113377", position: "Аналітик", departmentId: fin.id, isActive: false },
  ];

  const createdUsers = [];
  for (const u of usersData) {
    const created = await prisma.user.create({ data: u });
    createdUsers.push(created);
  }

  const serviceRecords = [
    { userId: createdUsers[0].id, departmentId: dev.id, type: ServiceRecordType.HIRE, note: "Прийнято на посаду інженера-програміста" },
    { userId: createdUsers[0].id, departmentId: dev.id, type: ServiceRecordType.PROMOTION, note: "Підвищення до Middle" },
    { userId: createdUsers[1].id, departmentId: dev.id, type: ServiceRecordType.HIRE, note: "Прийнято на посаду тімліда" },
    { userId: createdUsers[3].id, departmentId: dev.id, type: ServiceRecordType.DISMISSAL, note: "Звільнено за власним бажанням" },
    { userId: createdUsers[4].id, departmentId: hr.id, type: ServiceRecordType.HIRE, note: "Прийнято на посаду менеджера з персоналу" },
    { userId: createdUsers[6].id, departmentId: fin.id, type: ServiceRecordType.HIRE, note: "Прийнято на посаду головного бухгалтера" },
    { userId: createdUsers[8].id, departmentId: mkt.id, type: ServiceRecordType.TRANSFER, note: "Переведено з відділу розробки" },
    { userId: createdUsers[10].id, departmentId: dev.id, type: ServiceRecordType.NOTE, note: "Пройшов навчання з TypeScript" },
  ];

  for (const r of serviceRecords) {
    await prisma.serviceRecord.create({ data: r });
  }

  console.log(`Seed: ${departments.length} підрозділів, ${createdUsers.length} користувачів, ${serviceRecords.length} службових записів.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

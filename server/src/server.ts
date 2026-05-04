import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { prisma } from "./config/prisma.js";

const app = createApp();

const server = app.listen(env.PORT, () => {
  console.log(`API сервер запущено: http://localhost:${env.PORT}/api`);
});

const shutdown = async (signal: string) => {
  console.log(`\nОтримано сигнал ${signal}, завершення роботи...`);
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
};

process.on("SIGINT", () => void shutdown("SIGINT"));
process.on("SIGTERM", () => void shutdown("SIGTERM"));

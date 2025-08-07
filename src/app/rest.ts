
import server from "$server/instance";
import Logger from '$pkg/logger';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Database connection function
// This function connects to the database and logs the status
async function dbConnection() {
  try {
    await prisma.$connect();
    Logger.info(`✅ Database connected successfully`);
  } catch (error) {
    Logger.warn(`❌ Database connection error: ${error}`);
    process.exit(1);
  }
}

const startRestApp =  () => {
  Logger.info("Starting App : rest")
  const app = server.restServer();
  const PORT: number = Number(process.env.NODE_LOCAL_PORT) || 3010;
  return app.listen(PORT, () => {
    dbConnection(),
    Logger.info(`🚀Rest App is Running at Port ${PORT}`),
    Logger.info(`🔒 Authentication API: http://localhost:${PORT}/api/auth`),
    Logger.info(`📁 File API: http://localhost:${PORT}/api/files`)
  });
};

export default startRestApp;


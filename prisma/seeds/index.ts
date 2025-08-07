import { PrismaClient } from "@prisma/client";
import { seedAdmin } from "./seedAdmin";

async function seed(){
    const prisma = new PrismaClient()
    await seedAdmin(prisma)
}

seed().then(()=>{
    console.log("ALL SEEDING DONE")
})
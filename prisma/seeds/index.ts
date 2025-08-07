import { PrismaClient } from "@prisma/client";
import { seedAdmin } from "./seedAdmin";
import { seedProduct } from "./seedProduct";

async function seed(){
    const prisma = new PrismaClient()
    await seedAdmin(prisma)
    await seedProduct(prisma)
}

seed().then(()=>{
    console.log("ALL SEEDING DONE")
})
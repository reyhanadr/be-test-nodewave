import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
export async function seedAdmin(prisma:PrismaClient){
    const countAdmin = await prisma.user.count({where:{
        role: 'ADMIN'
    }})

    if(countAdmin === 0) {
        const hashedPassword = await bcrypt.hash("admin123", 12)
    
        await prisma.user.create({
            data: {
                fullName: "Admin",
                password: hashedPassword,
                email: "admin@test.com",
                role: 'ADMIN' as const,
            }
        });
        
        console.log("Admin seeded successfully");
    } else {
        console.log("Admin already exists");
    }
}
import { PrismaClient } from '@prisma/client';

export async function seedProduct(prisma: PrismaClient) {
    try {
        const productCount = await prisma.product.count();
        if (productCount > 0) {
            console.log('Products already exist in database');
            return;
        }

        const sampleProducts = [
            { "name": "FAT LIP", "description": "red cabbage, lettuce, onion, beef slice, chicken grilled", "price": 46000, "stock": 9, "category": "Bagel" },
            { "name": "DUMBSTRUCK", "description": "onion, chicken grilled, beef patty", "price": 53000, "stock": 9, "category": "Bagel" },
            { "name": "FAT MIKE", "description": "pickles, cheese, beef patty", "price": 41000, "stock": 10, "category": "Bagel" },
            { "name": "DOUBLE FAT MIKE", "description": "pickles, double cheese, double beef patty", "price": 60000, "stock": 9, "category": "Bagel" },
            { "name": "BALTIMORE", "description": "onion, fried chicken", "price": 35000, "stock": 8, "category": "Bagel" },
            { "name": "FIN", "description": "onion, chicken grilled", "price": 31000, "stock": 10, "category": "Bagel" },
            { "name": "SUMMER FLING", "description": "Lorem ipsum dolor sit amet.", "price": 27000, "stock": 10, "category": "Bagel" },
            { "name": "RAPE ME", "description": "chicken steak, blackpapper sauce", "price": 45000, "stock": 10, "category": "Steak" },
            { "name": "SONDERLAND", "description": "chicken steak, BBQ sauce", "price": 25000, "stock": 10, "category": "Steak" },
            { "name": "MIGHTY FALL", "description": "chicken steak, mushroom sauce", "price": 25000, "stock": 10, "category": "Steak" },
            { "name": "MAC DE MARCO", "description": "macaroni, cheese sauce", "price": 17000, "stock": 8, "category": "Macaroni" },
            { "name": "MAC HOPPUS", "description": "macaroni, cheese sauce, beef slice", "price": 24000, "stock": 9, "category": "Macaroni" },
            { "name": "MAC VICIOUS", "description": "macaroni, cheese sauce, chicken slice", "price": 24000, "stock": 10, "category": "Macaroni" },
            { "name": "SUCKER WINGS", "description": "potato wedges, blackpapper sauce", "price": 23000, "stock": 10, "category": "Wings" },
            { "name": "WHATSERNAME", "description": "potato wedges, BBQ sauce", "price": 23000, "stock": 10, "category": "Wings" },
            { "name": "PAIN YOU WINGS", "description": "potato wedges, mushroom sauce", "price": 23000, "stock": 10, "category": "Wings" },
            { "name": "BEN BARLOW", "description": "french fries, onion, cheese sauce", "price": 17000, "stock": 10, "category": "Fries" },
            { "name": "BILLIE JOE", "description": "french fries, beef slice, onion, cheese sauce", "price": 24000, "stock": 10, "category": "Fries" },
            { "name": "BRENDON URIE", "description": "french fries, chicken slice, onion, cheese sauce", "price": 24000, "stock": 10, "category": "Fries" },
        ];

        for (const product of sampleProducts) {
            await prisma.product.create({
                data: product
            });
        }

        console.log('Sample products seeded successfully');
    } catch (error) {
        console.error('Error seeding products:', error);
        throw error;
    }
}
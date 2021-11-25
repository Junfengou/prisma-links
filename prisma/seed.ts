import { PrismaClient } from "@prisma/client"
import { links } from "../data/links"


const prisma = new PrismaClient();

export const main = async () => {
  await prisma.user.create({
    data: {
      email: 'test@gmail.com',
      role: 'ADMIN',
    },
  });

  await prisma.link.createMany({
    data: links,
  });
}

// Won't work if the main function is not called lol
main()
.catch((e) => {
    console.error(e);
    process.exit(1);
  })
.finally(async () => await prisma.$disconnect);
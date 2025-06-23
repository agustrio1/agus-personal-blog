import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';


const prisma = new PrismaClient();

// Ambil argumen dari command line
const [,, nameArg, emailArg, passwordArg] = process.argv;

const name = nameArg || process.env.SEED_USER_NAME!;
const email = emailArg || process.env.SEED_USER_EMAIL!;
const passwordPlain = passwordArg || process.env.SEED_USER_PASSWORD!;

async function main() {
  const password = await argon2.hash(passwordPlain);
  await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      name,
      email,
      password,
    },
  });
  console.log(`Seed user created! Name: ${name}, Email: ${email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 
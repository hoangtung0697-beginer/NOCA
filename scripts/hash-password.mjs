import bcrypt from "bcryptjs";

const password = process.argv[2];
if (!password) {
  console.error("Cách dùng: node scripts/hash-password.mjs <mat-khau>");
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 10);
console.log("\nDán dòng sau vào .env (local) và Environment Variables trên Vercel:\n");
console.log(`SITE_PASSWORD_HASH="${hash}"`);

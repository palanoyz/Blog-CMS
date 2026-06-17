import { prisma } from "../lib/db";

async function main() {
  console.log("Cleaning up database...");

  // Order matters due to foreign key constraints
  await prisma.comment.deleteMany();
  console.log("Deleted comments");

  await prisma.blogImage.deleteMany();
  console.log("Deleted blog images");

  await prisma.blog.deleteMany();
  console.log("Deleted blogs");

  await prisma.user.deleteMany();
  console.log("Deleted users");

  console.log("Cleanup completed successfully.");
}

main()
  .catch((e) => {
    console.error("Error during cleanup:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

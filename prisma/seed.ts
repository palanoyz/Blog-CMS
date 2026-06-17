import { prisma } from "../lib/db";
import bcrypt from "bcrypt";

async function main() {
  // 1. Create a default Admin User
  const adminEmail = "admin@blogcms.com";
  const existingUser = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingUser) {
    await prisma.user.create({
      data: {
        email: adminEmail,
        password: await bcrypt.hash("1234", 10),
      },
    });
    console.log("Admin user created.");
  }

  // 2. Create Sample Blogs
  const blogs = [
    {
      title: "เริ่มต้นกับ Next.js 15",
      slug: "getting-started-with-nextjs-15",
      excerpt: "เรียนรู้วิธีการสร้างแอปพลิเคชันด้วย Next.js 15 และฟีเจอร์ใหม่ๆ",
      content: "Next.js 15 มาพร้อมกับฟีเจอร์ที่น่าตื่นเต้นมากมาย...",
      coverImage: "https://images.unsplash.com/photo-1643208589889-0735ad7218f0?q=80&w=1000",
      status: "PUBLISHED" as const,
      publishedAt: new Date(),
    },
    {
      title: "การใช้งาน Tailwind CSS 4",
      slug: "using-tailwind-css-4",
      excerpt: "Tailwind CSS 4 เปลี่ยนโฉมการเขียนสไตล์ด้วยประสิทธิภาพที่ดียิ่งขึ้น",
      content: "ในบทความนี้เราจะมาดูการเปลี่ยนแปลงที่สำคัญใน Tailwind CSS 4...",
      coverImage: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=1000",
      status: "PUBLISHED" as const,
      publishedAt: new Date(),
    },
    {
      title: "Prisma ORM เบื้องต้น",
      slug: "intro-to-prisma-orm",
      excerpt: "จัดการฐานข้อมูลได้ง่ายและปลอดภัยด้วย Prisma ORM สำหรับ TypeScript",
      content: "Prisma ช่วยให้การเขียน Query ฐานข้อมูลเป็นเรื่องง่าย...",
      coverImage: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=1000",
      status: "PUBLISHED" as const,
      publishedAt: new Date(),
    },
    {
      title: "โพสต์ตัวอย่างที่ยังไม่เผยแพร่",
      slug: "draft-post-example",
      excerpt: "นี่คือตัวอย่างโพสต์ที่ยังอยู่ในสถานะ Draft",
      content: "เนื้อหาลับที่กำลังเขียนอยู่...",
      coverImage: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1000",
      status: "DRAFT" as const,
    },
    {
      title: "React 19 มีอะไรใหม่บ้าง?",
      slug: "whats-new-in-react-19",
      excerpt: "สำรวจฟีเจอร์เด่นใน React 19 เช่น Actions และ useOptimistic",
      content: "React 19 เป็นก้าวกระโดดที่สำคัญของ Library...",
      coverImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1000",
      status: "PUBLISHED" as const,
      publishedAt: new Date(),
    },
  ];

  console.log("Seeding blogs...");
  for (const blog of blogs) {
    await prisma.blog.upsert({
      where: { slug: blog.slug },
      update: {},
      create: blog,
    });
  }

  // 3. Create some sample comments
  const publishedBlog = await prisma.blog.findFirst({
    where: { status: "PUBLISHED" },
  });

  if (publishedBlog) {
    await prisma.comment.create({
      data: {
        senderName: "สมชาย ใจดี",
        message: "บทความดีมากครับ 2025",
        status: "APPROVED",
        blogId: publishedBlog.id,
      },
    });
    console.log("Sample comment added.");
  }

  console.log("Seeding completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

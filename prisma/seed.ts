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
      coverImage: "https://picsum.photos/800/450",
      status: "PUBLISHED" as const,
      publishedAt: new Date("2026-05-01"),
    },
    {
      title: "การใช้งาน Tailwind CSS 4",
      slug: "using-tailwind-css-4",
      excerpt: "Tailwind CSS 4 เปลี่ยนโฉมการเขียนสไตล์ด้วยประสิทธิภาพที่ดียิ่งขึ้น",
      content: "ในบทความนี้เราจะมาดูการเปลี่ยนแปลงที่สำคัญใน Tailwind CSS 4...",
      coverImage: "https://picsum.photos/800/450",
      status: "PUBLISHED" as const,
      publishedAt: new Date("2026-05-03"),
    },
    {
      title: "Prisma ORM เบื้องต้น",
      slug: "intro-to-prisma-orm",
      excerpt: "จัดการฐานข้อมูลได้ง่ายและปลอดภัยด้วย Prisma ORM สำหรับ TypeScript",
      content: "Prisma ช่วยให้การเขียน Query ฐานข้อมูลเป็นเรื่องง่าย...",
      coverImage: "https://picsum.photos/800/450",
      status: "PUBLISHED" as const,
      publishedAt: new Date("2026-05-05"),
    },
    {
      title: "โพสต์ตัวอย่างที่ยังไม่เผยแพร่",
      slug: "draft-post-example",
      excerpt: "นี่คือตัวอย่างโพสต์ที่ยังอยู่ในสถานะ Draft",
      content: "เนื้อหาลับที่กำลังเขียนอยู่...",
      coverImage: "https://picsum.photos/800/450",
      status: "DRAFT" as const,
    },
    {
      title: "React 19 มีอะไรใหม่บ้าง?",
      slug: "whats-new-in-react-19",
      excerpt: "สำรวจฟีเจอร์เด่นใน React 19 เช่น Actions และ useOptimistic",
      content: "React 19 เป็นก้าวกระโดดที่สำคัญของ Library...",
      coverImage: "https://picsum.photos/800/450",
      status: "PUBLISHED" as const,
      publishedAt: new Date("2026-05-08"),
    },
    {
      title: "TypeScript Tips สำหรับ Developer",
      slug: "typescript-tips-for-developers",
      excerpt: "เทคนิคการใช้งาน TypeScript ให้เขียนโค้ดได้ปลอดภัยขึ้น",
      content: "TypeScript ช่วยลด Bug ได้อย่างมีประสิทธิภาพ...",
      coverImage: "https://picsum.photos/800/450",
      status: "PUBLISHED" as const,
      publishedAt: new Date("2026-05-10"),
    },
    {
      title: "เข้าใจ Server Actions ใน Next.js",
      slug: "understanding-server-actions",
      excerpt: "ทำความรู้จัก Server Actions และการจัดการ Form",
      content: "Server Actions ช่วยให้การเขียน Full Stack App ง่ายขึ้น...",
      coverImage: "https://picsum.photos/800/450",
      status: "PUBLISHED" as const,
      publishedAt: new Date("2026-05-12"),
    },
    {
      title: "Docker สำหรับนักพัฒนาเว็บ",
      slug: "docker-for-web-developers",
      excerpt: "เริ่มต้นใช้งาน Docker เพื่อจัดการ Environment",
      content: "Docker ช่วยให้การ Deploy และ Development สะดวกขึ้น...",
      coverImage: "https://picsum.photos/800/450",
      status: "PUBLISHED" as const,
      publishedAt: new Date("2026-05-14"),
    },
    {
      title: "Database Indexing ทำงานอย่างไร",
      slug: "how-database-indexing-works",
      excerpt: "เพิ่มความเร็ว Query ด้วย Database Indexing",
      content: "Index เป็นโครงสร้างข้อมูลที่ช่วยค้นหาข้อมูลได้เร็วขึ้น...",
      coverImage: "https://picsum.photos/800/450",
      status: "PUBLISHED" as const,
      publishedAt: new Date("2026-05-16"),
    },
    {
      title: "Clean Architecture สำหรับ Backend",
      slug: "clean-architecture-backend",
      excerpt: "ออกแบบ Backend ให้ดูแลรักษาและขยายระบบได้ง่าย",
      content: "Clean Architecture แบ่ง Layer อย่างชัดเจน...",
      coverImage: "https://picsum.photos/800/450",
      status: "PUBLISHED" as const,
      publishedAt: new Date("2026-05-18"),
    },
    {
      title: "Go Fiber vs Gin Framework",
      slug: "go-fiber-vs-gin",
      excerpt: "เปรียบเทียบ Framework ยอดนิยมสำหรับ Go",
      content: "ทั้ง Fiber และ Gin มีจุดเด่นที่แตกต่างกัน...",
      coverImage: "https://picsum.photos/800/450",
      status: "PUBLISHED" as const,
      publishedAt: new Date("2026-05-20"),
    },
    {
      title: "Authentication ด้วย JWT",
      slug: "authentication-with-jwt",
      excerpt: "สร้างระบบ Login และ Authentication ด้วย JWT",
      content: "JWT เป็นมาตรฐานสำหรับการส่งข้อมูลระหว่าง Client และ Server...",
      coverImage: "https://picsum.photos/800/450",
      status: "PUBLISHED" as const,
      publishedAt: new Date("2026-05-22"),
    },
    {
      title: "Redis ใช้ทำอะไรได้บ้าง",
      slug: "what-can-redis-do",
      excerpt: "รู้จัก Redis มากกว่าแค่ Cache",
      content: "Redis สามารถใช้เป็น Cache, Queue และ Session Store...",
      coverImage: "https://picsum.photos/800/450",
      status: "PUBLISHED" as const,
      publishedAt: new Date("2026-05-24"),
    },
    {
      title: "CI/CD Pipeline สำหรับมือใหม่",
      slug: "cicd-pipeline-for-beginners",
      excerpt: "Automate การ Build, Test และ Deploy",
      content: "CI/CD ช่วยลดข้อผิดพลาดจากการ Deploy ด้วยมือ...",
      coverImage: "https://picsum.photos/800/450",
      status: "PUBLISHED" as const,
      publishedAt: new Date("2026-05-26"),
    },
    {
      title: "Deploy Next.js บน VPS",
      slug: "deploy-nextjs-on-vps",
      excerpt: "คู่มือ Deploy Next.js ด้วย Docker และ Nginx",
      content: "การ Deploy บน VPS ช่วยควบคุม Infrastructure ได้เต็มที่...",
      coverImage: "https://picsum.photos/800/450",
      status: "PUBLISHED" as const,
      publishedAt: new Date("2026-05-28"),
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

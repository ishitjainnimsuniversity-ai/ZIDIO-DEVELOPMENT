import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting Unified Database Seeding...");

  // 1. Create Workspace
  const workspace = await prisma.workspace.upsert({
    where: { id: "ws_demo_acme" },
    update: {},
    create: {
      id: "ws_demo_acme",
      name: "Acme Corporation",
      slug: "acme-corp",
    },
  });

  console.log(`✅ Workspace ready: ${workspace.name} (${workspace.id})`);

  // 2. Create Users
  const hashedPassword = await bcrypt.hash("password123", 10);

  const demoUsers = [
    { id: "usr_admin_001", email: "admin@loop.dev", name: "Admin User", role: "ADMIN" },
    { id: "usr_analyst_001", email: "analyst@loop.dev", name: "Analyst User", role: "ANALYST" },
    { id: "usr_viewer_001", email: "viewer@loop.dev", name: "Viewer User", role: "VIEWER" },
  ];

  for (const u of demoUsers) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: { password: hashedPassword, role: u.role },
      create: {
        id: u.id,
        name: u.name,
        email: u.email,
        password: hashedPassword,
        role: u.role,
        workspaceId: workspace.id,
      },
    });
  }
  console.log("✅ Demo users seeded (Password: password123)");

  // 3. Clear existing feedback
  await prisma.feedback.deleteMany({ where: { workspaceId: workspace.id } });

  // 4. Seed 150+ Multi-channel customer items
  const seedItems = [
    { text: "Checkout fails consistently when using American Express corporate cards on mobile.", sentiment: "NEGATIVE", sentimentScore: -0.85, featureArea: "Billing & Payments", source: "Website" },
    { text: "Love the new dark mode UI and smooth animations! Fast and responsive.", sentiment: "POSITIVE", sentimentScore: 0.95, featureArea: "Design & UX", source: "App" },
    { text: "SMS two-factor authentication codes take over 10 minutes to arrive. Often expires.", sentiment: "NEGATIVE", sentimentScore: -0.9, featureArea: "Authentication & Security", source: "Support" },
    { text: "App crashes when attempting to export quarterly analytics reports to PDF format.", sentiment: "NEGATIVE", sentimentScore: -0.8, featureArea: "Reporting & Export", source: "Survey" },
    { text: "Support team resolved my billing issue in under 5 minutes. Amazing service!", sentiment: "POSITIVE", sentimentScore: 0.9, featureArea: "Customer Support", source: "Support" },
    { text: "Search filter is somewhat slow on large datasets but gets the job done.", sentiment: "NEUTRAL", sentimentScore: 0.1, featureArea: "Search & Filtering", source: "Website" },
  ];

  for (let i = 0; i < 150; i++) {
    const base = seedItems[i % seedItems.length];
    const timestamp = new Date(Date.now() - (i % 30) * 86400000 - (i % 12) * 3600000);
    await prisma.feedback.create({
      data: {
        text: `[Item #${i + 1}] ${base.text}`,
        source: base.source,
        status: i % 4 === 0 ? "RESOLVED" : i % 3 === 0 ? "REVIEWED" : "NEW",
        sentiment: base.sentiment,
        sentimentScore: base.sentimentScore,
        featureArea: base.featureArea,
        aiRationale: `Classified as ${base.sentiment} due to clear sentiment keywords in feedback item #${i + 1}.`,
        createdAt: timestamp,
        workspaceId: workspace.id,
      },
    });
  }

  console.log("✅ 150+ realistic multi-channel customer feedback items seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

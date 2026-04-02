import "dotenv/config";
import { count } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  categories,
  discountCodes,
  flavors,
  ingredients,
  packagingOptions,
  products,
} from "../drizzle/schema";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.log("[seed] DATABASE_URL غير مضبوط — تم تخطي الزرع.");
    return;
  }

  const db = drizzle(url);

  const [{ n: categoryCount }] = await db
    .select({ n: count() })
    .from(categories);

  if (categoryCount > 0) {
    console.log("[seed] توجد بيانات مسبقاً — تم تخطي الزرع.");
    return;
  }

  console.log("[seed] إدراج بيانات تجريبية…");

  await db.insert(categories).values([
    {
      name: "Wellness",
      slug: "wellness",
      description: "Daily vitamins & immune support",
      icon: "Sparkles",
    },
    {
      name: "Sleep",
      slug: "sleep",
      description: "Calm nights & recovery",
      icon: "Moon",
    },
  ]);

  const catRows = await db.select().from(categories);
  const wellnessId = catRows.find(c => c.slug === "wellness")?.id;
  const sleepId = catRows.find(c => c.slug === "sleep")?.id;

  if (!wellnessId || !sleepId) {
    throw new Error("فشل تحديد معرفات الفئات بعد الإدراج");
  }

  await db.insert(products).values([
    {
      name: "Vitamin C Citrus Gummies",
      slug: "vitamin-c-citrus",
      description: "Immune support with a bright citrus taste.",
      categoryId: wellnessId,
      price: 1999,
      discountPrice: null,
      image: "https://placehold.co/400x400/f97316/ffffff?text=Vit+C",
      color: "#F97316",
      flavor: "Orange",
      healthBenefit: "Immune support",
      ingredients: JSON.stringify(["Vitamin C", "Zinc"]),
      rating: 450,
      reviewCount: 12,
      stock: 100,
      featured: 1,
    },
    {
      name: "Berry Sleep Blend",
      slug: "berry-sleep-blend",
      description: "Wind down with berry flavor and calming botanicals.",
      categoryId: sleepId,
      price: 2499,
      discountPrice: 2199,
      image: "https://placehold.co/400x400/7c3aed/ffffff?text=Sleep",
      color: "#7C3AED",
      flavor: "Mixed Berry",
      healthBenefit: "Rest & recovery",
      ingredients: JSON.stringify(["Magnesium", "L-Theanine"]),
      rating: 480,
      reviewCount: 8,
      stock: 80,
      featured: 1,
    },
  ]);

  await db.insert(flavors).values([
    { name: "Strawberry", color: "#FB7185", priceModifier: 0 },
    { name: "Blueberry", color: "#6366F1", priceModifier: 50 },
    { name: "Mango", color: "#FBBF24", priceModifier: 25 },
  ]);

  await db.insert(ingredients).values([
    {
      name: "Vitamin C",
      category: "vitamin",
      priceModifier: 199,
      description: "Antioxidant support",
    },
    {
      name: "Zinc",
      category: "mineral",
      priceModifier: 149,
      description: "Immune mineral",
    },
    {
      name: "Melatonin",
      category: "herbal",
      priceModifier: 299,
      description: "Sleep support",
    },
  ]);

  await db.insert(packagingOptions).values([
    {
      name: "Pouch (30)",
      quantity: 30,
      priceModifier: 0,
      description: "Standard monthly pouch",
    },
    {
      name: "Jar (60)",
      quantity: 60,
      priceModifier: 899,
      description: "Better value jar",
    },
  ]);

  await db.insert(discountCodes).values({
    code: "WELCOME10",
    discountType: "percentage",
    discountValue: 10,
    maxUses: 1000,
    currentUses: 0,
    minOrderAmount: 0,
    active: 1,
  });

  console.log("[seed] تم — يمكنك فتح الواجهة ومشاهدة المنتجات.");
}

main().catch(err => {
  console.error("[seed] خطأ:", err);
  process.exit(1);
});

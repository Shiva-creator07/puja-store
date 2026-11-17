import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const categories = [
  { slug: "puja-kits", name: "Puja Kits", description: "Complete samagri kits for festivals and ceremonies." },
  { slug: "daily-puja-items", name: "Daily Puja Items", description: "Everyday essentials for your home mandir." },
  { slug: "oil-and-wicks", name: "Oil & Wicks", description: "Wicks and diya essentials." },
  { slug: "puja-accessories", name: "Puja Accessories", description: "Diyas, kalash, thalis and more." },
  { slug: "temple-decor", name: "Temple Decor", description: "Decor for your mandir and festival celebrations." },
];

// Prices are in paise: 34900 = Rs 349.00
const products = [
  { category: "puja-kits", slug: "daily-puja-kit", name: "Daily Puja Kit", pricePaise: 34900, mrpPaise: 59900, stock: 80, isFeatured: true, description: "Everything you need for your daily puja in one box." },
  { category: "puja-kits", slug: "ganesh-puja-kit", name: "Ganesh Puja Kit", pricePaise: 79900, mrpPaise: 99900, stock: 40, isFeatured: true, description: "Complete samagri for Ganesh Chaturthi and Ganesh puja." },
  { category: "puja-kits", slug: "diwali-lakshmi-puja-kit", name: "Diwali Lakshmi Puja Kit", pricePaise: 99900, mrpPaise: 129900, stock: 60, isFeatured: true, description: "Samagri for Lakshmi-Ganesh puja on Diwali." },
  { category: "puja-kits", slug: "griha-pravesh-puja-kit", name: "Griha Pravesh Puja Kit", pricePaise: 149900, mrpPaise: 189900, stock: 25, isFeatured: false, description: "Samagri for the housewarming ceremony." },

  { category: "daily-puja-items", slug: "camphor-kapoor-100g", name: "Camphor (Kapoor) 100 g", pricePaise: 14900, mrpPaise: 19900, stock: 120, isFeatured: false, description: "Pure camphor for aarti." },
  { category: "daily-puja-items", slug: "roli-chandan-set", name: "Roli and Chandan Set", pricePaise: 9900, mrpPaise: 14900, stock: 100, isFeatured: false, description: "Roli and sandalwood paste for tilak and puja." },
  { category: "daily-puja-items", slug: "sandalwood-incense-6-pack", name: "Sandalwood Incense Sticks (Pack of 6)", pricePaise: 12900, mrpPaise: 17900, stock: 150, isFeatured: true, description: "Six packs of long-burning sandalwood agarbatti." },
  { category: "daily-puja-items", slug: "akshat-rice-250g", name: "Akshat (Whole Rice) 250 g", pricePaise: 6900, mrpPaise: 9900, stock: 90, isFeatured: false, description: "Unbroken rice for puja offerings." },

  { category: "oil-and-wicks", slug: "cotton-wicks-200", name: "Cotton Wicks (Pack of 200)", pricePaise: 12900, mrpPaise: 19900, stock: 200, isFeatured: false, description: "Soft cotton wicks for diyas." },
  { category: "oil-and-wicks", slug: "floating-wicks-50", name: "Floating Wicks (Pack of 50)", pricePaise: 14900, mrpPaise: 21900, stock: 110, isFeatured: false, description: "Floating wicks for water diyas." },

  { category: "puja-accessories", slug: "brass-diya-pair", name: "Brass Diya (Pair)", pricePaise: 24900, mrpPaise: 34900, stock: 70, isFeatured: true, description: "A pair of hand-finished brass diyas." },
  { category: "puja-accessories", slug: "copper-kalash-with-lid", name: "Copper Kalash with Lid", pricePaise: 34900, mrpPaise: 44900, stock: 50, isFeatured: false, description: "Copper kalash for puja rituals." },
  { category: "puja-accessories", slug: "brass-puja-thali-set", name: "Brass Puja Thali Set", pricePaise: 59900, mrpPaise: 79900, stock: 35, isFeatured: false, description: "Thali set for aarti and puja." },

  { category: "temple-decor", slug: "marigold-garland-set", name: "Artificial Marigold Garland (Set of 2)", pricePaise: 19900, mrpPaise: 29900, stock: 90, isFeatured: false, description: "Reusable marigold garlands for the mandir and doorway." },
  { category: "temple-decor", slug: "embroidered-door-toran", name: "Embroidered Door Toran", pricePaise: 29900, mrpPaise: 39900, stock: 45, isFeatured: false, description: "Embroidered toran for festive doorways." },
];

async function main() {
  const idBySlug = {};
  for (const c of categories) {
    const row = await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name, description: c.description },
      create: c,
    });
    idBySlug[c.slug] = row.id;
  }
  for (const p of products) {
    const { category, ...data } = p;
    const categoryId = idBySlug[category];
    await prisma.product.upsert({
      where: { slug: data.slug },
      update: { ...data, categoryId },
      create: { ...data, categoryId },
    });
  }
  console.log(`Seeded ${categories.length} categories and ${products.length} products`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

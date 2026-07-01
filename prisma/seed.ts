import { PrismaClient, ContentStatus } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed process...')

  // Upsert Categories
  const catTech = await prisma.category.upsert({
    where: { slug: 'technology' },
    update: {},
    create: {
      slug: 'technology',
      name: 'Technology',
      description: 'Hardware, software, and tech services.',
    },
  })

  const catFood = await prisma.category.upsert({
    where: { slug: 'food-beverage' },
    update: {},
    create: {
      slug: 'food-beverage',
      name: 'Food & Beverage',
      description: 'Restaurants, cafes, and groceries.',
    },
  })

  // Upsert Partners
  const partner1 = await prisma.partner.upsert({
    where: { slug: 'apple-student' },
    update: {},
    create: {
      slug: 'apple-student',
      name: 'Apple Education',
      description: 'Special pricing on Mac, iPad, and AppleCare+ for university students.',
      website: 'https://www.apple.com/pk/education/higher-ed/',
      status: ContentStatus.PUBLISHED,
      categories: { connect: [{ id: catTech.id }] }
    },
  })

  const partner2 = await prisma.partner.upsert({
    where: { slug: 'foodpanda-pro' },
    update: {},
    create: {
      slug: 'foodpanda-pro',
      name: 'foodpanda',
      description: 'Discounts on delivery and pro subscriptions for students.',
      website: 'https://www.foodpanda.pk',
      status: ContentStatus.PUBLISHED,
      categories: { connect: [{ id: catFood.id }] }
    },
  })

  // Upsert Offers
  await prisma.offer.create({
    data: {
      partnerId: partner1.id,
      title: 'MacBook Air M3 Student Discount',
      description: 'Save up to 10% on the new MacBook Air with M3 chip.',
      discountType: 'PERCENTAGE',
      discountValue: 10,
      status: ContentStatus.PUBLISHED,
    }
  })

  console.log('Seeding complete. Realistic, deterministic data inserted.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

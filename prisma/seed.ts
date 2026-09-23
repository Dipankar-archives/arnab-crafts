import { PrismaClient, FrameColor, FrameSize } from '@prisma/client';

const prisma = new PrismaClient();
const products = [
  ['Classic Walnut Memory Frame', 149, FrameSize.A4, FrameColor.WALNUT, 'A handcrafted walnut finish for a timeless memory.', 'https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=900&q=80'],
  ['Black Minimal Portrait Frame', 299, FrameSize.A3, FrameColor.BLACK, 'Clean lines and a modern gallery look.', 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80'],
  ['Royal Gold Wedding Frame', 499, FrameSize.LARGE, FrameColor.GOLDEN, 'A statement frame for celebrations and gifting.', 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80'],
  ['Natural Oak Family Frame', 699, FrameSize.LARGE, FrameColor.NATURAL_OAK, 'Warm natural wood for family walls.', 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80']
] as const;

async function main() {
  for (const [name, price, size, color, description, imageUrl] of products) {
    await prisma.product.upsert({ where: { id: name }, update: {}, create: { id: name, name, price, size, color, description, imageUrl } });
  }
}
main().finally(() => prisma.$disconnect());

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getStock = async () => {
  return await prisma.pharmacyInventory.findMany({
    include: {
      Pharmacy: true,
      Medicine: true,
    },
  });
};
export const reorderStock = async (data: {
  pharmacy_id: number;
  medicine_id: number;
  stock_quantity: number;
  price: number;
}) => {
  const { pharmacy_id, medicine_id, stock_quantity, price } = data;
  return await prisma.pharmacyInventory.upsert({
    where: {
      pharmacy_id_medicine_id: {
        // Use the compound unique input
        pharmacy_id,
        medicine_id,
      },
    },
    update: {
      stock_quantity,
      price,
    },
    create: {
      pharmacy_id,
      medicine_id,
      stock_quantity,
      price,
    },
  });
};

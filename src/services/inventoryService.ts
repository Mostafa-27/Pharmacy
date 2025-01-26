import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getStock = async (pharmacy_id: number) => {
  return await prisma.pharmacyInventory.findMany({
    where: {
      pharmacy_id,
    },
    select: {
      stock_quantity: true,
      price: true,
      Pharmacy: true,
      Medicine: true,
    },
  });
};

export const getMedicineStock = async (
  pharmacy_id: number,
  medicine_id: number
) => {
  // Check if the medicine_id exists in the Medicine table
  const medicineExists = await prisma.medicine.findUnique({
    where: { medicine_id },
  });

  if (!medicineExists) {
    throw new Error(`Medicine with id ${medicine_id} does not exist`);
  }

  // Check if there is stock for the medicine in the pharmacy
  const stock = await prisma.pharmacyInventory.findUnique({
    where: {
      pharmacy_id_medicine_id: {
        pharmacy_id,
        medicine_id,
      },
    },
    select: {
      stock_quantity: true,
      price: true,
      Pharmacy: true,
      Medicine: true,
    },
  });

  if (!stock) {
    throw new Error(
      `No stock available for medicine with id ${medicine_id} in pharmacy with id ${pharmacy_id}`
    );
  }

  return stock;
};

export const reorderStock = async (
  pharmacy_id: number,
  data: {
    medicine_id: number;
    quantity: number;
    price: number;
  }
) => {
  const { medicine_id, quantity, price } = data;
  console.log(pharmacy_id, medicine_id, quantity, price);
  if (pharmacy_id === undefined) {
    throw new Error("User is not assigenned to pharmacy");
  }
  if (quantity === undefined || price === undefined) {
    throw new Error("stock_quantity and price must be defined");
  }

  // Check if the medicine_id exists in the Medicine table
  const medicineExists = await prisma.medicine.findUnique({
    where: { medicine_id },
  });

  if (!medicineExists) {
    throw new Error(`Medicine with id ${medicine_id} does not exist`);
  }

  try {
    return await prisma.pharmacyInventory.upsert({
      where: {
        pharmacy_id_medicine_id: {
          pharmacy_id,
          medicine_id,
        },
      },
      update: {
        stock_quantity: quantity,
        price,
      },
      create: {
        pharmacy_id,
        medicine_id,
        stock_quantity: quantity,
        price,
      },
    });
  } catch (error) {
    console.error("Error reordering stock:", error);
    throw error;
  }
};

export const getStockByBarcode = async (
  pharmacyId: number,
  barcode: string
) => {
  return await prisma.pharmacyInventory.findFirst({
    where: {
      pharmacy_id: pharmacyId,
      Medicine: {
        barcode: barcode,
      },
    },
    select: {
      stock_quantity: true,
      price: true,
      Medicine: true,
    },
  });
};

export const updateStockQuantity = async (
  pharmacyId: number,
  barcode: string,
  newQuantity: number
) => {
  const stockItem = await prisma.pharmacyInventory.findFirst({
    where: {
      pharmacy_id: pharmacyId,
      Medicine: {
        barcode: barcode,
      },
    },
  });

  if (!stockItem) {
    throw new Error("Item not found");
  }

  return await prisma.pharmacyInventory.update({
    where: {
      inventory_id: stockItem.inventory_id,
    },
    data: {
      stock_quantity: newQuantity,
    },
    select: {
      stock_quantity: true,
      price: true,
      Medicine: true,
    },
  });
};

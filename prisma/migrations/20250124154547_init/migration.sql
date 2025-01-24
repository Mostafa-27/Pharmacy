-- CreateEnum
CREATE TYPE "Role" AS ENUM ('pharmacy', 'company', 'user');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('pending', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "SearchType" AS ENUM ('medicine', 'category', 'disease', 'location');

-- CreateTable
CREATE TABLE "User" (
    "user_id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "phone_number" TEXT,
    "location" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Medicine" (
    "medicine_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "active_substance" TEXT,
    "description" TEXT,
    "uses" TEXT,
    "company_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Medicine_pkey" PRIMARY KEY ("medicine_id")
);

-- CreateTable
CREATE TABLE "Category" (
    "category_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("category_id")
);

-- CreateTable
CREATE TABLE "MedicineCategory" (
    "medicine_id" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,

    CONSTRAINT "MedicineCategory_pkey" PRIMARY KEY ("medicine_id","category_id")
);

-- CreateTable
CREATE TABLE "Pharmacy" (
    "pharmacy_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "phone_number" TEXT,
    "location" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Pharmacy_pkey" PRIMARY KEY ("pharmacy_id")
);

-- CreateTable
CREATE TABLE "PharmacyInventory" (
    "inventory_id" SERIAL NOT NULL,
    "pharmacy_id" INTEGER NOT NULL,
    "medicine_id" INTEGER NOT NULL,
    "stock_quantity" INTEGER NOT NULL DEFAULT 0,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "PharmacyInventory_pkey" PRIMARY KEY ("inventory_id")
);

-- CreateTable
CREATE TABLE "Order" (
    "order_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "pharmacy_id" INTEGER NOT NULL,
    "total_price" DOUBLE PRECISION NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("order_id")
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "order_item_id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "medicine_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("order_item_id")
);

-- CreateTable
CREATE TABLE "SearchHistory" (
    "search_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "search_query" TEXT NOT NULL,
    "search_type" "SearchType" NOT NULL,
    "result_count" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SearchHistory_pkey" PRIMARY KEY ("search_id")
);

-- CreateTable
CREATE TABLE "Disease" (
    "disease_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Disease_pkey" PRIMARY KEY ("disease_id")
);

-- CreateTable
CREATE TABLE "DiseaseMedicine" (
    "disease_id" INTEGER NOT NULL,
    "medicine_id" INTEGER NOT NULL,

    CONSTRAINT "DiseaseMedicine_pkey" PRIMARY KEY ("disease_id","medicine_id")
);

-- CreateTable
CREATE TABLE "Review" (
    "review_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "pharmacy_id" INTEGER,
    "medicine_id" INTEGER,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("review_id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "notification_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("notification_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Medicine_name_key" ON "Medicine"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Pharmacy_user_id_key" ON "Pharmacy"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "PharmacyInventory_pharmacy_id_medicine_id_key" ON "PharmacyInventory"("pharmacy_id", "medicine_id");

-- CreateIndex
CREATE UNIQUE INDEX "Disease_name_key" ON "Disease"("name");

-- AddForeignKey
ALTER TABLE "Medicine" ADD CONSTRAINT "Medicine_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "User"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicineCategory" ADD CONSTRAINT "MedicineCategory_medicine_id_fkey" FOREIGN KEY ("medicine_id") REFERENCES "Medicine"("medicine_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicineCategory" ADD CONSTRAINT "MedicineCategory_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("category_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pharmacy" ADD CONSTRAINT "Pharmacy_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PharmacyInventory" ADD CONSTRAINT "PharmacyInventory_pharmacy_id_fkey" FOREIGN KEY ("pharmacy_id") REFERENCES "Pharmacy"("pharmacy_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PharmacyInventory" ADD CONSTRAINT "PharmacyInventory_medicine_id_fkey" FOREIGN KEY ("medicine_id") REFERENCES "Medicine"("medicine_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_pharmacy_id_fkey" FOREIGN KEY ("pharmacy_id") REFERENCES "Pharmacy"("pharmacy_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("order_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_medicine_id_fkey" FOREIGN KEY ("medicine_id") REFERENCES "Medicine"("medicine_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SearchHistory" ADD CONSTRAINT "SearchHistory_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiseaseMedicine" ADD CONSTRAINT "DiseaseMedicine_disease_id_fkey" FOREIGN KEY ("disease_id") REFERENCES "Disease"("disease_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiseaseMedicine" ADD CONSTRAINT "DiseaseMedicine_medicine_id_fkey" FOREIGN KEY ("medicine_id") REFERENCES "Medicine"("medicine_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_pharmacy_id_fkey" FOREIGN KEY ("pharmacy_id") REFERENCES "Pharmacy"("pharmacy_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_medicine_id_fkey" FOREIGN KEY ("medicine_id") REFERENCES "Medicine"("medicine_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

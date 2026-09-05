-- CreateEnum
CREATE TYPE "Sku" AS ENUM ('DEN', 'DO_CHOI', 'MOC_KHOA', 'KHAC');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'IN_PRODUCTION', 'SHIPPED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ExpenseCategory" AS ENUM ('NGUYEN_LIEU', 'DIEN_KHAU_HAO', 'VAT_TU', 'KHAC');

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "sku" "Sku" NOT NULL,
    "productName" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" DECIMAL(12,0) NOT NULL,
    "total" DECIMAL(12,0) NOT NULL,
    "orderDate" TIMESTAMP(3) NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Expense" (
    "id" TEXT NOT NULL,
    "category" "ExpenseCategory" NOT NULL,
    "amount" DECIMAL(12,0) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Expense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PricingPreset" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sku" "Sku" NOT NULL,
    "filamentWeightGram" DECIMAL(10,2) NOT NULL,
    "filamentPricePerKg" DECIMAL(12,0) NOT NULL,
    "printHours" DECIMAL(10,2) NOT NULL,
    "machineWattage" DECIMAL(10,2) NOT NULL,
    "electricityPricePerKwh" DECIMAL(12,0) NOT NULL,
    "machinePrice" DECIMAL(12,0) NOT NULL,
    "machineLifetimeHours" DECIMAL(10,2) NOT NULL,
    "materialsCost" DECIMAL(12,0) NOT NULL,
    "materialsNote" TEXT,
    "marginPercent" DECIMAL(6,2) NOT NULL,
    "computedCost" DECIMAL(12,0) NOT NULL,
    "computedPrice" DECIMAL(12,0) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PricingPreset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Settings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "filamentPricePerKgDefault" DECIMAL(12,0) NOT NULL,
    "machineWattageDefault" DECIMAL(10,2) NOT NULL,
    "electricityPricePerKwhDefault" DECIMAL(12,0) NOT NULL,
    "machinePriceDefault" DECIMAL(12,0) NOT NULL,
    "machineLifetimeHoursDefault" DECIMAL(10,2) NOT NULL,
    "marginPercentDefault" DECIMAL(6,2) NOT NULL,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Order_orderDate_idx" ON "Order"("orderDate");

-- CreateIndex
CREATE INDEX "Order_status_idx" ON "Order"("status");

-- CreateIndex
CREATE INDEX "Order_sku_idx" ON "Order"("sku");

-- CreateIndex
CREATE INDEX "Expense_date_idx" ON "Expense"("date");

-- CreateIndex
CREATE INDEX "Expense_category_idx" ON "Expense"("category");

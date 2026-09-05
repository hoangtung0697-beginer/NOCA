"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { Sku, OrderStatus } from "@/generated/prisma/enums";
import { calculatePricing } from "@/lib/pricing";

async function parseOrderFormData(formData: FormData) {
  const customerName = String(formData.get("customerName") ?? "").trim();
  const productId = String(formData.get("productId") ?? "").trim();
  const salespersonId = String(formData.get("salespersonId") ?? "").trim();
  const quantity = Number(formData.get("quantity"));
  const unitPrice = Number(formData.get("unitPrice"));
  const unitCommissionCost = Number(formData.get("commissionCost"));
  const depositAmount = Number(formData.get("depositAmount"));
  const orderDate = String(formData.get("orderDate") ?? "");
  const status = String(formData.get("status") ?? "PENDING") as OrderStatus;
  const note = String(formData.get("note") ?? "").trim();

  if (!customerName) throw new Error("Thiếu tên khách hàng");
  if (!Number.isFinite(quantity) || quantity <= 0) throw new Error("Số lượng không hợp lệ");
  if (!Number.isFinite(unitPrice) || unitPrice < 0) throw new Error("Đơn giá không hợp lệ");
  if (!Number.isFinite(unitCommissionCost) || unitCommissionCost < 0) {
    throw new Error("Chi phí hoa hồng không hợp lệ");
  }
  if (!Number.isFinite(depositAmount) || depositAmount < 0) {
    throw new Error("Tiền cọc không hợp lệ");
  }
  if (depositAmount > quantity * unitPrice) {
    throw new Error("Tiền cọc không được lớn hơn thành tiền");
  }
  if (!orderDate) throw new Error("Thiếu ngày đặt hàng");
  if (!Object.values(OrderStatus).includes(status)) throw new Error("Trạng thái không hợp lệ");

  let sku: Sku;
  let productName: string;
  let unitCost: number = unitCommissionCost;
  let unitProductionCost: number | null = null;
  let unitOtherCost: number | null = null;

  if (productId) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { printer: true },
    });
    if (!product) throw new Error("Sản phẩm không tồn tại");
    sku = product.sku;
    productName = product.name;
    const breakdown = calculatePricing({
      filamentWeightGram: Number(product.filamentWeightGram),
      filamentPricePerKg: Number(product.filamentPricePerKg),
      printHours: Number(product.printHours),
      machineWattage: Number(product.printer.machineWattage),
      electricityPricePerKwh: Number(product.printer.electricityPricePerKwh),
      machinePrice: Number(product.printer.machinePrice),
      machineLifetimeHours: Number(product.printer.machineLifetimeHours),
      otherCost: Number(product.otherCost),
      commissionCost: 0,
      marginPercent: Number(product.marginPercent),
    });
    unitProductionCost = breakdown.generalProductionCost;
    unitOtherCost = breakdown.otherCost;
    unitCost = breakdown.materialCost + breakdown.generalProductionCost + breakdown.otherCost + unitCommissionCost;
  } else {
    sku = String(formData.get("sku") ?? "") as Sku;
    productName = String(formData.get("productName") ?? "").trim();
    if (!Object.values(Sku).includes(sku)) throw new Error("SKU không hợp lệ");
    if (!productName) throw new Error("Thiếu tên sản phẩm");
  }

  return {
    customerName,
    sku,
    productName,
    productId: productId || null,
    salespersonId: salespersonId || null,
    quantity,
    unitPrice,
    unitCost,
    unitProductionCost,
    unitOtherCost,
    unitCommissionCost,
    total: quantity * unitPrice,
    depositAmount,
    orderDate: new Date(orderDate),
    status,
    note: note || null,
  };
}

export async function createOrder(formData: FormData) {
  const data = await parseOrderFormData(formData);
  await prisma.order.create({ data });
  revalidatePath("/orders");
  revalidatePath("/");
  revalidatePath("/commission");
}

export async function updateOrder(id: string, formData: FormData) {
  const data = await parseOrderFormData(formData);
  await prisma.order.update({ where: { id }, data });
  revalidatePath("/orders");
  revalidatePath("/");
  revalidatePath("/commission");
}

export async function deleteOrder(id: string) {
  await prisma.order.delete({ where: { id } });
  revalidatePath("/orders");
  revalidatePath("/");
  revalidatePath("/commission");
}

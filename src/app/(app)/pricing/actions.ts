"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { Sku } from "@/generated/prisma/enums";

function parseProductFormData(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const sku = String(formData.get("sku") ?? "") as Sku;
  const printerId = String(formData.get("printerId") ?? "").trim();
  const filamentWeightGram = Number(formData.get("filamentWeightGram"));
  const filamentPricePerKg = Number(formData.get("filamentPricePerKg"));
  const printHours = Number(formData.get("printHours"));
  const otherCost = Number(formData.get("otherCost"));
  const otherCostNote = String(formData.get("otherCostNote") ?? "").trim();
  const commissionCost = Number(formData.get("commissionCost"));
  const marginPercent = Number(formData.get("marginPercent"));

  if (!name) throw new Error("Thiếu tên sản phẩm");
  if (!Object.values(Sku).includes(sku)) throw new Error("SKU không hợp lệ");
  if (!printerId) throw new Error("Thiếu loại máy in");

  const inputs = {
    filamentWeightGram,
    filamentPricePerKg,
    printHours,
    otherCost,
    commissionCost,
    marginPercent,
  };
  for (const [key, value] of Object.entries(inputs)) {
    if (!Number.isFinite(value) || value < 0) {
      throw new Error(`Giá trị "${key}" không hợp lệ`);
    }
  }

  return {
    name,
    sku,
    printerId,
    ...inputs,
    otherCostNote: otherCostNote || null,
  };
}

export async function createProduct(formData: FormData) {
  const data = parseProductFormData(formData);
  await prisma.product.create({ data });
  revalidatePath("/pricing");
  revalidatePath("/orders");
}

export async function updateProduct(id: string, formData: FormData) {
  const data = parseProductFormData(formData);
  await prisma.product.update({ where: { id }, data });
  revalidatePath("/pricing");
  revalidatePath("/orders");
}

export async function deleteProduct(id: string) {
  await prisma.product.delete({ where: { id } });
  revalidatePath("/pricing");
  revalidatePath("/orders");
}

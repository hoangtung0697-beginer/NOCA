"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

function parseFixedAssetFormData(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const price = Number(formData.get("price"));
  const purchaseDate = String(formData.get("purchaseDate") ?? "");
  const note = String(formData.get("note") ?? "").trim();

  if (!name) throw new Error("Thiếu tên tài sản");
  if (!Number.isFinite(price) || price <= 0) throw new Error("Giá trị không hợp lệ");
  if (!purchaseDate) throw new Error("Thiếu ngày mua");

  return {
    name,
    price,
    purchaseDate: new Date(purchaseDate),
    note: note || null,
  };
}

export async function createFixedAsset(formData: FormData) {
  const data = parseFixedAssetFormData(formData);
  await prisma.fixedAsset.create({ data });
  revalidatePath("/expenses");
}

export async function updateFixedAsset(id: string, formData: FormData) {
  const data = parseFixedAssetFormData(formData);
  await prisma.fixedAsset.update({ where: { id }, data });
  revalidatePath("/expenses");
}

export async function deleteFixedAsset(id: string) {
  await prisma.fixedAsset.delete({ where: { id } });
  revalidatePath("/expenses");
}

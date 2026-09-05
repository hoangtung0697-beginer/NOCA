"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

function parseMaterialFormData(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const type = String(formData.get("type") ?? "").trim();
  const pricePerKg = Number(formData.get("pricePerKg"));
  const remainingGram = Number(formData.get("remainingGram"));
  const note = String(formData.get("note") ?? "").trim();

  if (!name) throw new Error("Thiếu tên loại nhựa");
  if (!Number.isFinite(pricePerKg) || pricePerKg < 0) throw new Error("Giá/kg không hợp lệ");
  if (!Number.isFinite(remainingGram) || remainingGram < 0) throw new Error("Tồn kho không hợp lệ");

  return {
    name,
    type: type || null,
    pricePerKg,
    remainingGram,
    note: note || null,
  };
}

export async function createMaterial(formData: FormData) {
  const data = parseMaterialFormData(formData);
  await prisma.material.create({ data });
  revalidatePath("/calculator");
}

export async function updateMaterial(id: string, formData: FormData) {
  const data = parseMaterialFormData(formData);
  await prisma.material.update({ where: { id }, data });
  revalidatePath("/calculator");
}

export async function deleteMaterial(id: string) {
  await prisma.material.delete({ where: { id } });
  revalidatePath("/calculator");
}
